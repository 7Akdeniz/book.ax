'use client';

import { Fragment, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import {
  PanelBookingWithDetails,
  statusBadgeClassMap,
  statusTranslationKeyMap,
  sourceBadgeClassMap,
  sourceTranslationKeyMap,
} from './bookingHelpers';

interface BookingDetailsDrawerProps {
  booking: PanelBookingWithDetails | null;
  open: boolean;
  onClose: () => void;
  onOpenStatusModal: (booking: PanelBookingWithDetails) => void;
  locale: string;
  currency?: string;
}

export function BookingDetailsDrawer({
  booking,
  open,
  onClose,
  onOpenStatusModal,
  locale,
  currency = 'EUR',
}: BookingDetailsDrawerProps) {
  const tPanel = useTranslations('panel.bookings');
  const tBooking = useTranslations('booking');
  const tCommon = useTranslations('common');
  const tAdminFinances = useTranslations('admin.finances');

  const nights = useMemo(() => {
    if (!booking) return 0;
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const diff = checkOut.getTime() - checkIn.getTime();
    const dayInMs = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.round(diff / dayInMs));
  }, [booking]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || 'en', {
        style: 'currency',
        currency,
      }),
    [locale, currency]
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale || 'en', {
        dateStyle: 'medium',
      }),
    [locale]
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale || 'en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [locale]
  );

  const formatCurrency = (value?: string | number | null) => {
    if (!value) return currencyFormatter.format(0);
    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    return currencyFormatter.format(isNaN(numeric) ? 0 : numeric);
  };

  if (!booking) {
    return (
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onClose}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Dialog>
      </Transition>
    );
  }

  const statusLabelKey = statusTranslationKeyMap[booking.status];
  const sourceLabelKey = sourceTranslationKeyMap[booking.source];

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="border-b border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Dialog.Title className="text-lg font-semibold text-gray-900">
                            {tPanel('actions.viewDetails')}
                          </Dialog.Title>
                          <p className="mt-1 text-sm text-gray-500">
                            {tPanel('table.reference')}: {booking.booking_reference}
                          </p>
                        </div>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
                      <section>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {tBooking('bookingDetails')}
                        </h3>
                        <dl className="mt-3 space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('table.reference')}</dt>
                            <dd className="font-medium text-gray-900">{booking.booking_reference}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tCommon('status')}</dt>
                            <dd>
                              <span
                                className={clsx(
                                  'px-2 py-1 text-xs font-semibold rounded-full',
                                  statusBadgeClassMap[booking.status]
                                )}
                              >
                                {statusLabelKey ? tPanel(`status.${statusLabelKey}`) : booking.status}
                              </span>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('table.source')}</dt>
                            <dd>
                              <span
                                className={clsx(
                                  'px-2 py-1 text-xs font-semibold rounded-full',
                                  sourceBadgeClassMap[booking.source]
                                )}
                              >
                                {sourceLabelKey ? tPanel(`source.${sourceLabelKey}`) : booking.source}
                              </span>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('details.createdAt')}</dt>
                            <dd className="font-medium text-gray-900">
                              {dateTimeFormatter.format(new Date(booking.created_at))}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('details.updatedAt')}</dt>
                            <dd className="font-medium text-gray-900">
                              {dateTimeFormatter.format(new Date(booking.updated_at))}
                            </dd>
                          </div>
                        </dl>
                        {booking.cancellation_reason && (
                          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm">
                            <p className="font-medium text-red-800">{tPanel('status.cancelled')}</p>
                            <p className="mt-1 text-red-700">{booking.cancellation_reason}</p>
                            {booking.cancellation_date && (
                              <p className="mt-1 text-red-500">
                                {dateTimeFormatter.format(new Date(booking.cancellation_date))}
                              </p>
                            )}
                          </div>
                        )}
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {tPanel('table.dates')}
                        </h3>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div className="rounded-lg border border-gray-200 p-3">
                            <p className="text-gray-500">{tPanel('status.checkedIn')}</p>
                            <p className="font-semibold text-gray-900">
                              {dateFormatter.format(new Date(booking.check_in_date))}
                            </p>
                          </div>
                          <div className="rounded-lg border border-gray-200 p-3">
                            <p className="text-gray-500">{tPanel('status.checkedOut')}</p>
                            <p className="font-semibold text-gray-900">
                              {dateFormatter.format(new Date(booking.check_out_date))}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <p>{tPanel('details.nights', { count: nights })}</p>
                          <p className="mt-1">
                            {tPanel('details.guestsRooms', {
                              guests: booking.num_guests,
                              rooms: booking.num_rooms,
                            })}
                          </p>
                          <p className="mt-1 text-gray-500">{booking.room_category_name}</p>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {tBooking('guestDetails')}
                        </h3>
                        <div className="mt-3 space-y-2 text-sm text-gray-700">
                          <p className="font-medium">{booking.guest_name}</p>
                          <a className="text-primary-600 hover:underline" href={`mailto:${booking.guest_email}`}>
                            {booking.guest_email}
                          </a>
                          {booking.guest_phone && (
                            <a className="text-primary-600 hover:underline block" href={`tel:${booking.guest_phone}`}>
                              {booking.guest_phone}
                            </a>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {tBooking('paymentDetails')}
                        </h3>
                        <dl className="mt-3 space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('details.subtotal')}</dt>
                            <dd className="font-medium text-gray-900">{formatCurrency(booking.subtotal)}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('details.taxes')}</dt>
                            <dd className="font-medium text-gray-900">{formatCurrency(booking.tax_amount)}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tBooking('totalPrice')}</dt>
                            <dd className="font-semibold text-gray-900">{formatCurrency(booking.total_amount)}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('details.commission')}</dt>
                            <dd className="font-medium text-gray-900">
                              {formatCurrency(booking.commission_amount)} ({booking.commission_percentage}%)
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tPanel('details.payout')}</dt>
                            <dd className="font-medium text-gray-900">{formatCurrency(booking.hotel_payout)}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-gray-500">{tAdminFinances('date')}</dt>
                            <dd className="font-medium text-gray-900">
                              {dateFormatter.format(new Date(booking.created_at))}
                            </dd>
                          </div>
                        </dl>
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {tBooking('specialRequests')}
                        </h3>
                        <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-700">
                          {booking.special_requests ? (
                            <p>{booking.special_requests}</p>
                          ) : (
                            <p className="text-gray-500">{tPanel('details.noSpecialRequests')}</p>
                          )}
                        </div>
                      </section>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => onOpenStatusModal(booking)}
                        className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      >
                        {tPanel('actions.updateStatus')}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
