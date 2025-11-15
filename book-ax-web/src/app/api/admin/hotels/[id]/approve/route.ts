import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { z } from 'zod';

// ✅ Dynamic route
export const dynamic = 'force-dynamic';

// Validation schema for hotel approval
const approvalSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: 'Status must be either approved or rejected' }),
  }),
  rejectionReason: z.string().optional(),
});

/**
 * POST /api/admin/hotels/[id]/approve
 * Approve or reject a hotel (Admin only)
 * 
 * Body: { status: 'approved' | 'rejected', rejectionReason?: string }
 */
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return requireAdmin(async (authReq) => {
    try {
      const hotelId = context.params.id;
      const body = await req.json();

      // Validate input
      const validation = approvalSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error.errors[0].message },
          { status: 400 }
        );
      }

      const { status, rejectionReason } = validation.data;

      // Get hotel details
      const { data: hotel, error: hotelError } = await supabaseAdmin
        .from('hotels')
        .select(`
          *,
          hotel_translations!inner(
            language,
            name,
            description
          )
        `)
        .eq('id', hotelId)
        .single();

      if (hotelError || !hotel) {
        return NextResponse.json(
          { error: 'Hotel not found' },
          { status: 404 }
        );
      }

      // Check current status
      if (hotel.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending hotels can be approved or rejected' },
          { status: 400 }
        );
      }

      // Update hotel status
      const { data: updatedHotel, error: updateError } = await supabaseAdmin
        .from('hotels')
        .update({
          status,
          rejection_reason: status === 'rejected' ? rejectionReason : null,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', hotelId)
        .select()
        .single();

      if (updateError) throw updateError;

      // TODO: Send email notification to hotelier
      console.log(`✅ Admin ${authReq.user!.email} ${status} hotel: ${hotel.hotel_translations[0]?.name} (ID: ${hotelId})`);

      return NextResponse.json({
        message: status === 'approved' 
          ? 'Hotel approved successfully' 
          : 'Hotel rejected',
        hotel: {
          id: updatedHotel.id,
          name: hotel.hotel_translations[0]?.name,
          status: updatedHotel.status,
          approvedAt: updatedHotel.approved_at,
          rejectionReason: updatedHotel.rejection_reason,
        },
      });

    } catch (error) {
      console.error('Error approving/rejecting hotel:', error);
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req);
}
