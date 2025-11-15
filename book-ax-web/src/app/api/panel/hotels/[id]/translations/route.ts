import { NextRequest, NextResponse } from 'next/server';
import { requireHotelier } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { z } from 'zod';

// ✅ Dynamic route
export const dynamic = 'force-dynamic';

// Validation schema for translation
const addTranslationSchema = z.object({
  language: z.string().min(2).max(5, 'Invalid language code'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  checkInInstructions: z.string().optional(),
  checkOutInstructions: z.string().optional(),
  houseRules: z.string().optional(),
});

/**
 * POST /api/panel/hotels/[id]/translations
 * Add or update a translation for a hotel
 */
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireHotelier(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const userId = authReq.user!.userId;
      const body = await req.json();

      // Validate input
      const validation = addTranslationSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error.errors[0].message },
          { status: 400 }
        );
      }

      const data = validation.data;

      // Verify hotel ownership
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select('id, hotelier_id')
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      if (hotel.hotelier_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to modify this hotel' },
          { status: 403 }
        );
      }

      // Check if translation already exists
      const { data: existing } = await supabaseAdmin
        .from('hotel_translations')
        .select('id')
        .eq('hotel_id', hotelId)
        .eq('language', data.language)
        .single();

      let translation;

      if (existing) {
        // Update existing translation
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('hotel_translations')
          .update({
            name: data.name,
            description: data.description,
            check_in_instructions: data.checkInInstructions || null,
            check_out_instructions: data.checkOutInstructions || null,
            house_rules: data.houseRules || null,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        translation = updated;
      } else {
        // Insert new translation
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('hotel_translations')
          .insert({
            hotel_id: hotelId,
            language: data.language,
            name: data.name,
            description: data.description,
            check_in_instructions: data.checkInInstructions || null,
            check_out_instructions: data.checkOutInstructions || null,
            house_rules: data.houseRules || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        translation = inserted;
      }

      return NextResponse.json({
        message: existing ? 'Translation updated successfully' : 'Translation added successfully',
        translation: {
          id: translation.id,
          language: translation.language,
          name: translation.name,
          description: translation.description,
          checkInInstructions: translation.check_in_instructions,
          checkOutInstructions: translation.check_out_instructions,
          houseRules: translation.house_rules,
        },
      }, { status: existing ? 200 : 201 });

    } catch (error) {
      console.error('Error adding/updating hotel translation:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}

/**
 * GET /api/panel/hotels/[id]/translations
 * Get all translations for a hotel
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireHotelier(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const userId = authReq.user!.userId;

      // Verify hotel ownership
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select('id, hotelier_id')
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      if (hotel.hotelier_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to access this hotel' },
          { status: 403 }
        );
      }

      // Get all translations
      const { data: translations, error } = await supabaseAdmin
        .from('hotel_translations')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('language', { ascending: true });

      if (error) throw error;

      return NextResponse.json({
        translations: translations.map((t: any) => ({
          id: t.id,
          language: t.language,
          name: t.name,
          description: t.description,
          checkInInstructions: t.check_in_instructions,
          checkOutInstructions: t.check_out_instructions,
          houseRules: t.house_rules,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        })),
        total: translations.length,
      });

    } catch (error) {
      console.error('Error fetching hotel translations:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}

/**
 * DELETE /api/panel/hotels/[id]/translations?language=en
 * Delete a translation from a hotel
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireHotelier(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const userId = authReq.user!.userId;
      const { searchParams } = req.nextUrl;
      const language = searchParams.get('language');

      if (!language) {
        return NextResponse.json(
          { error: 'language parameter is required' },
          { status: 400 }
        );
      }

      // Verify hotel ownership
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select('id, hotelier_id')
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      if (hotel.hotelier_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to modify this hotel' },
          { status: 403 }
        );
      }

      // Check how many translations exist
      const { data: translations, error: countError } = await supabaseAdmin
        .from('hotel_translations')
        .select('id')
        .eq('hotel_id', hotelId);

      if (countError) throw countError;

      if (translations && translations.length <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last translation. Hotel must have at least one translation.' },
          { status: 400 }
        );
      }

      // Delete translation
      const { error: deleteError } = await supabaseAdmin
        .from('hotel_translations')
        .delete()
        .eq('hotel_id', hotelId)
        .eq('language', language);

      if (deleteError) throw deleteError;

      return NextResponse.json({
        message: 'Translation deleted successfully',
      });

    } catch (error) {
      console.error('Error deleting hotel translation:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}
