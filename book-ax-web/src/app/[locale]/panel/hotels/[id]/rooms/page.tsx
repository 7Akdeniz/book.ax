'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { RoomCategoryModal } from '@/components/panel/RoomCategoryModal';

interface RoomCategory {
  id: string;
  name: string;
  translations: Array<{
    language: string;
    name: string;
    description?: string;
  }>;
  basePrice: number;
  maxOccupancy: number;
  totalRooms: number;
  size?: number;
  bedType?: string;
  amenities: Array<{
    code: string;
    icon: string;
  }>;
}

export default function HotelRoomsPage() {
  const t = useTranslations('panel.hotels.rooms');
  const params = useParams();
  const hotelId = params.id as string;

  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomCategory | null>(null);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      setRooms(data.roomCategories || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const handleEdit = (room: RoomCategory) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/hotels/${hotelId}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete room');
      }

      toast.success(t('deleteSuccess'));
      fetchRooms();
    } catch (error: any) {
      console.error('Error deleting room:', error);
      toast.error(error.message || t('errors.deleteFailed'));
    }
  };

  const handleSave = async (roomData: any) => {
    try {
      const url = editingRoom
        ? `/api/hotels/${hotelId}/rooms/${editingRoom.id}`
        : `/api/hotels/${hotelId}/rooms`;

      const method = editingRoom ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save room');
      }

      toast.success(editingRoom ? t('updateSuccess') : t('createSuccess'));
      setModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      console.error('Error saving room:', error);
      toast.error(error.message || t('errors.saveFailed'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {rooms.length} {rooms.length === 1 ? t('roomCategory') : t('roomCategories')}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>+</span>
            {t('addRoom')}
          </button>
        </div>

        {/* Room Categories Table/Grid */}
        {rooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('noRooms.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('noRooms.subtitle')}
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('addFirstRoom')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const englishTranslation = room.translations.find((t) => t.language === 'en');
              const roomName = englishTranslation?.name || room.name;
              const roomDescription = englishTranslation?.description;

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {roomName}
                        </h3>
                        {roomDescription && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {roomDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Room Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">💰</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            €{room.basePrice}
                          </div>
                          <div className="text-xs text-gray-500">{t('perNight')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">👥</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {room.maxOccupancy}
                          </div>
                          <div className="text-xs text-gray-500">{t('guests')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">🚪</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {room.totalRooms}
                          </div>
                          <div className="text-xs text-gray-500">{t('rooms')}</div>
                        </div>
                      </div>

                      {room.size && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">📏</span>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {room.size}m²
                            </div>
                            <div className="text-xs text-gray-500">{t('size')}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 6).map((amenity, index) => (
                            <span
                              key={index}
                              className="text-lg"
                              title={amenity.code}
                            >
                              {amenity.icon}
                            </span>
                          ))}
                          {room.amenities.length > 6 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{room.amenities.length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => handleEdit(room)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        ✏️ {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <RoomCategoryModal
            hotelId={hotelId}
            room={editingRoom}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
