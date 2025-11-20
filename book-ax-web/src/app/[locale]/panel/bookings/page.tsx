"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { authenticatedFetch } from "@/lib/auth/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  PanelBookingWithDetails,
  PanelBookingStatus,
  statusBadgeClassMap,
  statusTranslationKeyMap,
  sourceBadgeClassMap,
  sourceTranslationKeyMap,
} from "@/components/panel/bookingHelpers";
import { BookingDetailsDrawer } from "@/components/panel/BookingDetailsDrawer";
import { StatusUpdateModal } from "@/components/panel/StatusUpdateModal";

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalRevenue: number;
  currency?: string;
}

const defaultStats: Stats = {
  totalBookings: 0,
  confirmedBookings: 0,
  todayCheckIns: 0,
  todayCheckOuts: 0,
  totalRevenue: 0,
  currency: "EUR",
};

type StatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";
type DateFilter = "all" | "today" | "upcoming" | "past";

export default function HotelierBookingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("panel.bookings");
  const { user } = useAuth();
  const [bookings, setBookings] = useState<PanelBookingWithDetails[]>([]);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<PanelBookingWithDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusModalState, setStatusModalState] = useState<{
    open: boolean;
    booking: PanelBookingWithDetails | null;
    presetStatus?: PanelBookingStatus | null;
  }>({ open: false, booking: null, presetStatus: null });
  const [statusModalLoading, setStatusModalLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const hasVerifiedRef = useRef(false);

  const statusTransitions: Record<PanelBookingStatus, PanelBookingStatus[]> = useMemo(
    () => ({
      pending: ["confirmed", "cancelled"],
      confirmed: ["checked_in", "cancelled", "no_show"],
      checked_in: ["checked_out"],
      checked_out: [],
      cancelled: [],
      no_show: [],
    }),
    []
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || "en", {
        style: "currency",
        currency: stats.currency || "EUR",
      }),
    [locale, stats.currency]
  );

  const formatCurrency = useCallback(
    (value: string | number) => {
      const numeric = typeof value === "string" ? parseFloat(value) : value;
      return currencyFormatter.format(isNaN(numeric) ? 0 : numeric);
    },
    [currencyFormatter]
  );

  const verifyHotelierAccess = useCallback(async () => {
    if (!user) {
      router.push(`/${locale}/login`);
      return false;
    }

    if (user.role !== "hotelier" && user.role !== "admin") {
      toast.error(t("accessDenied"));
      router.push(`/${locale}`);
      return false;
    }

    try {
      const response = await authenticatedFetch("/api/panel/verify");

      if (response.status === 401) {
        router.push(`/${locale}/login`);
        return false;
      }

      if (response.status === 403) {
        toast.error(t("accessDenied"));
        router.push(`/${locale}`);
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error("Verification error:", error);
      router.push(`/${locale}/login`);
      return false;
    }
  }, [locale, router, t, user]);

  const fetchBookings = useCallback(
    async ({ status, date }: { status: StatusFilter; date: DateFilter }) => {
      if (!user) return;

      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (status !== "all") query.append("status", status);
        if (date !== "all") query.append("dateFilter", date);
        query.append("locale", locale);

        const response = await authenticatedFetch(`/api/panel/bookings?${query.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings || []);
        setStats({ ...defaultStats, ...(data.stats || {}) });
        setInitialLoad(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error(t("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [locale, t, user]
  );

  useEffect(() => {
    const init = async () => {
      if (hasVerifiedRef.current) return;
      const hasAccess = await verifyHotelierAccess();
      if (hasAccess) {
        hasVerifiedRef.current = true;
        await fetchBookings({ status: statusFilter, date: dateFilter });
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyHotelierAccess, fetchBookings]);

  useEffect(() => {
    if (!hasVerifiedRef.current) return;
    fetchBookings({ status: statusFilter, date: dateFilter });
  }, [statusFilter, dateFilter, fetchBookings]);

  const tableDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale || "en", {
        dateStyle: "medium",
      }),
    [locale]
  );

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.booking_reference.toLowerCase().includes(query) ||
        booking.guest_name.toLowerCase().includes(query) ||
        booking.guest_email.toLowerCase().includes(query) ||
        booking.room_category_name.toLowerCase().includes(query)
      );
    });
  }, [bookings, searchQuery]);

  const openDetails = (booking: PanelBookingWithDetails) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedBooking(null);
  };

  const openStatusModal = (booking: PanelBookingWithDetails, preset?: PanelBookingStatus) => {
    setStatusModalState({ open: true, booking, presetStatus: preset ?? null });
  };

  const closeStatusModal = () => {
    setStatusModalState({ open: false, booking: null, presetStatus: null });
  };

  const submitStatusChange = useCallback(
    async (bookingId: string, nextStatus: PanelBookingStatus, reason?: string) => {
      try {
        setUpdatingBookingId(bookingId);
        const response = await authenticatedFetch(`/api/panel/bookings/${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus, reason }),
        });

        if (!response.ok) {
          throw new Error("Failed to update booking status");
        }

        toast.success(t("statusModal.success"));
        await fetchBookings({ status: statusFilter, date: dateFilter });
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(t("statusModal.error"));
        throw error;
      } finally {
        setUpdatingBookingId(null);
      }
    },
    [dateFilter, fetchBookings, statusFilter, t]
  );

  const handleQuickStatusChange = async (
    booking: PanelBookingWithDetails,
    nextStatus: PanelBookingStatus,
    options?: { confirmMessage?: string }
  ) => {
    if (options?.confirmMessage && !confirm(options.confirmMessage)) {
      return;
    }

    try {
      await submitStatusChange(booking.id, nextStatus);
    } catch (error) {
      // submitStatusChange already logs and toasts
    }
  };

  const handleStatusModalSubmit = async (status: PanelBookingStatus, reason?: string) => {
    if (!statusModalState.booking) return;
    try {
      setStatusModalLoading(true);
      await submitStatusChange(statusModalState.booking.id, status, reason);
      closeStatusModal();
    } catch (error) {
      // Errors handled in submitStatusChange
    } finally {
      setStatusModalLoading(false);
    }
  };

  const statusModalOptions = statusModalState.booking
    ? statusTransitions[statusModalState.booking.status] || []
    : [];

  if (initialLoad && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="mt-2 text-gray-600">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">{t('stats.total')}</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">{t('stats.confirmed')}</div>
              <div className="mt-2 text-3xl font-bold text-green-600">{stats.confirmedBookings}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">{t('stats.todayCheckIns')}</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{stats.todayCheckIns}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">{t('stats.todayCheckOuts')}</div>
              <div className="mt-2 text-3xl font-bold text-purple-600">{stats.todayCheckOuts}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">{t('stats.revenue')}</div>
              <div className="mt-2 text-3xl font-bold text-primary-600">
                {formatCurrency(stats.totalRevenue || 0)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filters.search')}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('filters.searchPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filters.status')}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{t('filters.allStatuses')}</option>
                  <option value="pending">{t('status.pending')}</option>
                  <option value="confirmed">{t('status.confirmed')}</option>
                  <option value="checked_in">{t('status.checkedIn')}</option>
                  <option value="checked_out">{t('status.checkedOut')}</option>
                  <option value="cancelled">{t('status.cancelled')}</option>
                  <option value="no_show">{t('status.noShow')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filters.date')}
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{t('filters.allDates')}</option>
                  <option value="today">{t('filters.today')}</option>
                  <option value="upcoming">{t('filters.upcoming')}</option>
                  <option value="past">{t('filters.past')}</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => fetchBookings({ status: statusFilter, date: dateFilter })}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {loading ? t('loading') : t('refresh')}
              </button>
            </div>
          </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.reference')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.room')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.guest')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.dates')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.guests')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.source')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      {t('noBookings')}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const statusKey = statusTranslationKeyMap[booking.status];
                    const statusLabel = statusKey ? t(`status.${statusKey}`) : booking.status;
                    const sourceKey = sourceTranslationKeyMap[booking.source];
                    const sourceLabel = sourceKey ? t(`source.${sourceKey}`) : booking.source;
                    const isUpdating = updatingBookingId === booking.id;

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.booking_reference.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.room_category_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.guest_name}</div>
                          <div className="text-sm text-gray-500">{booking.guest_email}</div>
                          {booking.guest_phone && (
                            <div className="text-sm text-gray-500">{booking.guest_phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {tableDateFormatter.format(new Date(booking.check_in_date))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tableDateFormatter.format(new Date(booking.check_out_date))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.num_guests} / {booking.num_rooms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(booking.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClassMap[booking.status]}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sourceBadgeClassMap[booking.source]}`}>
                            {sourceLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-wrap gap-3">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => openStatusModal(booking, 'confirmed')}
                                className="text-primary-600 hover:text-primary-800 font-medium"
                                disabled={isUpdating}
                              >
                                {t('actions.confirm')}
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange(booking, 'checked_in', {
                                    confirmMessage: t('confirmCheckIn'),
                                  })
                                }
                                className="text-blue-600 hover:text-blue-800 font-medium"
                                disabled={isUpdating}
                              >
                                {t('actions.checkIn')}
                              </button>
                            )}
                            {booking.status === 'checked_in' && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange(booking, 'checked_out', {
                                    confirmMessage: t('confirmCheckOut'),
                                  })
                                }
                                className="text-green-600 hover:text-green-800 font-medium"
                                disabled={isUpdating}
                              >
                                {t('actions.checkOut')}
                              </button>
                            )}
                            {['pending', 'confirmed'].includes(booking.status) && (
                              <button
                                onClick={() => openStatusModal(booking, 'cancelled')}
                                className="text-red-600 hover:text-red-800 font-medium"
                                disabled={isUpdating}
                              >
                                {t('actions.cancel')}
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => openStatusModal(booking, 'no_show')}
                                className="text-purple-600 hover:text-purple-800 font-medium"
                                disabled={isUpdating}
                              >
                                {t('actions.markNoShow')}
                              </button>
                            )}
                            <button
                              onClick={() => openDetails(booking)}
                              className="text-gray-700 hover:text-gray-900 font-medium"
                            >
                              {t('actions.viewDetails')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BookingDetailsDrawer
        booking={selectedBooking}
        open={detailsOpen && !!selectedBooking}
        onClose={closeDetails}
        onOpenStatusModal={openStatusModal}
        locale={locale}
        currency={stats.currency}
      />
      <StatusUpdateModal
        open={statusModalState.open}
        bookingReference={statusModalState.booking?.booking_reference}
        statusOptions={statusModalOptions}
        defaultStatus={statusModalState.presetStatus ?? undefined}
        loading={statusModalLoading}
        onClose={closeStatusModal}
        onSubmit={handleStatusModalSubmit}
      />
    </div>
  );
}
