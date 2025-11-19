'use client';

import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatting';

interface Room {
  id: string;
  name: string;
  base_price: number;
  max_occupancy: number;
  size_sqm?: number;
  bed_type?: string;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: string;
  onRoomChange: (roomId: string) => void;
  locale: string;
}

export default function RoomSelector({
  rooms,
  selectedRoomId,
  onRoomChange,
  locale,
}: RoomSelectorProps) {
  const t = useTranslations('booking');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('roomType')}
      </label>
      <div className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomChange(room.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedRoomId === room.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">{room.name}</h4>
              <div className="text-right">
                <p className="font-bold text-primary-600">
                  {formatCurrency(room.base_price, 'EUR', locale)}
                </p>
                <p className="text-xs text-gray-500">{t('perNight')}</p>
              </div>
            </div>
            <div className="flex gap-3 text-xs text-gray-600">
              <span>👥 {room.max_occupancy} {t('guests')}</span>
              {room.size_sqm && <span>📏 {room.size_sqm}m²</span>}
              {room.bed_type && <span>🛏️ {room.bed_type}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
