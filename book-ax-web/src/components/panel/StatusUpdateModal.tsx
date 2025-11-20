'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { PanelBookingStatus, statusTranslationKeyMap } from './bookingHelpers';

interface StatusUpdateModalProps {
  open: boolean;
  bookingReference?: string;
  statusOptions: PanelBookingStatus[];
  defaultStatus?: PanelBookingStatus;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (status: PanelBookingStatus, reason?: string) => Promise<void> | void;
}

export function StatusUpdateModal({
  open,
  bookingReference,
  statusOptions,
  defaultStatus,
  loading = false,
  onClose,
  onSubmit,
}: StatusUpdateModalProps) {
  const tPanel = useTranslations('panel.bookings');
  const [selectedStatus, setSelectedStatus] = useState<PanelBookingStatus | ''>('');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);

  useEffect(() => {
    if (open) {
      const initial = defaultStatus ?? statusOptions[0] ?? '';
      setSelectedStatus(initial);
      setReason('');
      setReasonError(false);
    }
  }, [open, defaultStatus, statusOptions]);

  const requiresReason = useMemo(
    () => selectedStatus === 'cancelled' || selectedStatus === 'no_show',
    [selectedStatus]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedStatus) return;

    if (requiresReason && reason.trim().length === 0) {
      setReasonError(true);
      return;
    }

    setReasonError(false);
    await onSubmit(selectedStatus, reason.trim() ? reason.trim() : undefined);
  };

  const renderStatusLabel = (status: PanelBookingStatus) => {
    const key = statusTranslationKeyMap[status];
    return key ? tPanel(`status.${key}`) : status;
  };

  const disabled = statusOptions.length === 0;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {tPanel('statusModal.title')}
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-gray-500">
                      {tPanel('statusModal.description', { reference: bookingReference || '' })}
                    </p>
                  </div>
                  <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {tPanel('statusModal.statusLabel')}
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(event) => setSelectedStatus(event.target.value as PanelBookingStatus)}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        disabled={disabled}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {renderStatusLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(requiresReason || selectedStatus === 'cancelled' || selectedStatus === 'no_show') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {tPanel('statusModal.reasonLabel')}
                        </label>
                        <textarea
                          rows={3}
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
                          className={clsx(
                            'mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
                            reasonError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          )}
                          placeholder={tPanel('statusModal.reasonPlaceholder')}
                        />
                        {reasonError && (
                          <p className="mt-1 text-sm text-red-600">
                            {tPanel('statusModal.reasonRequired')}
                          </p>
                        )}
                      </div>
                    )}

                    {disabled && (
                      <p className="text-sm text-gray-500">{tPanel('statusModal.noAvailableActions')}</p>
                    )}

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:space-x-reverse sm:space-x-3">
                      <button
                        type="submit"
                        disabled={disabled || loading || !selectedStatus}
                        className={clsx(
                          'inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold shadow-sm sm:w-auto',
                          disabled || loading || !selectedStatus
                            ? 'bg-gray-300 text-gray-600'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        )}
                      >
                        {loading ? tPanel('loading') : tPanel('statusModal.submit')}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        {tPanel('actions.cancel')}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
