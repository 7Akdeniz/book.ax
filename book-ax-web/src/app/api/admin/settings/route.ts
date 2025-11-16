import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin Settings Management
 * 
 * Security: Admin-only endpoint
 * Returns: Platform-wide configuration settings
 */

interface Settings {
  defaultCommissionPercentage: number;
  minCommissionPercentage: number;
  maxCommissionPercentage: number;
  taxRate: number;
  taxIncluded: boolean;
  defaultCurrency: string;
  supportedCurrencies: string[];
  emailFrom: string;
  emailReplyTo: string;
  sendBookingConfirmations: boolean;
  sendStatusUpdates: boolean;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  minPasswordLength: number;
}

// Default settings (fallback if not in database)
const DEFAULT_SETTINGS: Settings = {
  defaultCommissionPercentage: 15,
  minCommissionPercentage: 10,
  maxCommissionPercentage: 50,
  taxRate: 19,
  taxIncluded: true,
  defaultCurrency: 'EUR',
  supportedCurrencies: ['EUR', 'USD', 'GBP'],
  emailFrom: 'noreply@book.ax',
  emailReplyTo: 'support@book.ax',
  sendBookingConfirmations: true,
  sendStatusUpdates: true,
  maintenanceMode: false,
  registrationEnabled: true,
  minPasswordLength: 8,
};

export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // TODO: Fetch settings from database (system_settings table)
    // For now, return default settings
    const settings = DEFAULT_SETTINGS;

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Admin settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get updated settings from request body
    const body = await req.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data required' },
        { status: 400 }
      );
    }

    // Validate settings
    if (settings.minCommissionPercentage > settings.maxCommissionPercentage) {
      return NextResponse.json(
        { error: 'Min commission cannot be greater than max commission' },
        { status: 400 }
      );
    }

    if (settings.defaultCommissionPercentage < settings.minCommissionPercentage ||
        settings.defaultCommissionPercentage > settings.maxCommissionPercentage) {
      return NextResponse.json(
        { error: 'Default commission must be between min and max' },
        { status: 400 }
      );
    }

    if (settings.minPasswordLength < 6 || settings.minPasswordLength > 32) {
      return NextResponse.json(
        { error: 'Password length must be between 6 and 32 characters' },
        { status: 400 }
      );
    }

    // TODO: Save settings to database (system_settings table)
    // For now, just log the update
    console.log(`⚙️ Admin ${decoded.email} updated platform settings:`, {
      commission: `${settings.defaultCommissionPercentage}% (${settings.minCommissionPercentage}-${settings.maxCommissionPercentage}%)`,
      tax: `${settings.taxRate}% (${settings.taxIncluded ? 'included' : 'excluded'})`,
      currency: settings.defaultCurrency,
      email: settings.emailFrom,
      maintenanceMode: settings.maintenanceMode,
      registrationEnabled: settings.registrationEnabled,
    });

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
