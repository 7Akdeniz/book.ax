'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface HotelImagesFormProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function HotelImagesForm({ data, onNext, onBack }: HotelImagesFormProps) {
  const t = useTranslations('panel.hotels.new.images');

  const [images, setImages] = useState<any[]>(data.images || []);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(t('errors.invalidFileType'));
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(t('errors.fileTooLarge'));
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();

        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            fileName: data.fileName,
            isPrimary: prev.length === 0, // First image is primary
            altText: file.name.replace(/\.[^/.]+$/, ''),
          },
        ]);
      } catch (error) {
        console.error('Upload error:', error);
        alert(t('errors.uploadFailed'));
      }
    }

    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // If removed image was primary, make first image primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert(t('errors.noImages'));
      return;
    }

    onNext({ images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center">
          <span className="text-6xl mb-4">📸</span>
          <label
            htmlFor="imageUpload"
            className="cursor-pointer inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors mb-2"
          >
            {uploading ? t('uploading') : t('selectFiles')}
          </label>
          <p className="text-sm text-gray-600">
            {t('dragDropHint')}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t('maxSize')}
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('uploadedImages')} ({images.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group border-2 rounded-lg overflow-hidden"
                style={{
                  borderColor: image.isPrimary ? '#0066cc' : '#e5e7eb',
                }}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.altText || `Hotel image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                    ⭐ {t('primary')}
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded hover:bg-gray-100"
                    >
                      ⭐ {t('makePrimary')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                  >
                    🗑️ {t('remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 {t('info')}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← {t('backButton')}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          disabled={images.length === 0}
        >
          {t('nextButton')} →
        </button>
      </div>
    </form>
  );
}
