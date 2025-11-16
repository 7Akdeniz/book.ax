// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ValidationError, NotFoundError, AuthorizationError, AuthenticationError } from '@/utils/errors';
import { z } from 'zod';

// Validation Schema
const TranslationSchema = z.object({
  language: z.string().length(2).or(z.string().length(3)), // 'en', 'de', 'fil', etc.
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  policies: z.string().optional(),
});

const BulkTranslationsSchema = z.object({
  translations: z.array(TranslationSchema).min(1),
});

// Helper to verify auth from request
function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No authentication token provided');
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return decoded;
}

// =====================================================
// GET: Get all translations for a hotel
// =====================================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    const { id: hotelId } = params;

    // Get hotel to verify ownership (if hotelier)
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id, owner_id')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Check authorization: Only owner or admin can access
    if (user.role === 'hotelier' && hotel.owner_id !== user.userId) {
      throw new AuthorizationError('You can only access your own hotels');
    }

    // Get all translations
    const { data: translations, error } = await supabaseAdmin
      .from('hotel_translations')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('language', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ translations: translations || [] });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// POST: Add or update translations (bulk or single)
// =====================================================
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can modify translations');
    }

    const { id: hotelId } = params;
    const body = await req.json();

    // Validate input
    let translations;
    try {
      // Try to parse as bulk first
      const parsed = BulkTranslationsSchema.parse(body);
      translations = parsed.translations;
    } catch {
      // If that fails, try single translation
      const parsed = TranslationSchema.parse(body);
      translations = [parsed];
    }

    // Get hotel and verify ownership
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id, owner_id')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Check authorization: Only owner or admin can modify
    if (user.role === 'hotelier' && hotel.owner_id !== user.userId) {
      throw new AuthorizationError('You can only modify your own hotels');
    }

    // Upsert translations (insert or update if exists)
    const translationsToUpsert = translations.map(t => ({
      hotel_id: hotelId,
      language: t.language,
      name: t.name,
      description: t.description || null,
      policies: t.policies || null,
    }));

    const { data, error } = await supabaseAdmin
      .from('hotel_translations')
      .upsert(translationsToUpsert, {
        onConflict: 'hotel_id,language',
        ignoreDuplicates: false,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: `Successfully upserted ${data.length} translation(s)`,
      translations: data,
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// PUT: Update a single translation
// =====================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can modify translations');
    }

    const { id: hotelId } = params;
    const body = await req.json();

    // Validate input
    const { language, ...updates } = TranslationSchema.parse(body);

    // Get hotel and verify ownership
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id, owner_id')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Check authorization
    if (user.role === 'hotelier' && hotel.owner_id !== user.userId) {
      throw new AuthorizationError('You can only modify your own hotels');
    }

    // Check if translation exists
    const { data: existing, error: existError } = await supabaseAdmin
      .from('hotel_translations')
      .select('id')
      .eq('hotel_id', hotelId)
      .eq('language', language)
      .single();

    if (existError || !existing) {
      throw new NotFoundError(`Translation for language '${language}'`);
    }

    // Update translation
    const { data, error } = await supabaseAdmin
      .from('hotel_translations')
      .update({
        name: updates.name,
        description: updates.description || null,
        policies: updates.policies || null,
        updated_at: new Date().toISOString(),
      })
      .eq('hotel_id', hotelId)
      .eq('language', language)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Translation updated successfully',
      translation: data,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// DELETE: Delete a specific translation
// =====================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    
    // Check role
    if (user.role !== 'hotelier' && user.role !== 'admin') {
      throw new AuthorizationError('Only hoteliers and admins can delete translations');
    }

    const { id: hotelId } = params;
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language');

    if (!language) {
      throw new ValidationError('Language parameter is required');
    }

    // Get hotel and verify ownership
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .select('id, owner_id')
      .eq('id', hotelId)
      .single();

    if (hotelError || !hotel) {
      throw new NotFoundError('Hotel');
    }

    // Check authorization
    if (user.role === 'hotelier' && hotel.owner_id !== user.userId) {
      throw new AuthorizationError('You can only modify your own hotels');
    }

    // Delete translation
    const { error } = await supabaseAdmin
      .from('hotel_translations')
      .delete()
      .eq('hotel_id', hotelId)
      .eq('language', language);

    if (error) throw error;

    return NextResponse.json({
      message: `Translation for language '${language}' deleted successfully`,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
