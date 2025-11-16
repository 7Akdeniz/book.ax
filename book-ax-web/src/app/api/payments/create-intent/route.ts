// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError, NotFoundError } from '@/utils/errors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new NotFoundError('Booking');
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.total_amount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    await supabaseAdmin.from('payments').insert({
      booking_id: booking.id,
      amount: booking.total_amount,
      currency: 'EUR',
      status: 'pending',
      payment_method: 'credit_card',
      stripe_payment_intent_id: paymentIntent.id,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.total_amount,
      currency: 'EUR',
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
