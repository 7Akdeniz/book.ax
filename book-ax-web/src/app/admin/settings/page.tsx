'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Settings {
  // Commission Settings
  defaultCommissionPercentage: number;
  minCommissionPercentage: number;
  maxCommissionPercentage: number;
  
  // Tax Settings
  taxRate: number;
  taxIncluded: boolean;
  
  // Currency Settings
  defaultCurrency: string;
  supportedCurrencies: string[];
  
  // Email Settings
  emailFrom: string;
  emailReplyTo: string;
  sendBookingConfirmations: boolean;
  sendStatusUpdates: boolean;
  
  // System Settings
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  minPasswordLength: number;
}

export default function AdminSettingsPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
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
  });

  // Admin verification on mount
  useEffect(() => {
    verifyAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAdminAccess = async () => {
    try {
      if (!isAuthenticated()) {
        toast.error('Session expired. Please login again.');
        router.push('/de/login');
        return;
      }

      const user = getUser();
      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      const response = await authenticatedFetch('/api/admin/verify');
      if (!response.ok) {
        toast.error('Authentication failed');
        router.push('/de/login');
        return;
      }

      setIsAdmin(true);
      fetchSettings();
    } catch (error) {
      console.error('Admin verification failed:', error);
      toast.error('Authentication failed');
      router.push('/de/login');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/admin/settings');

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!confirm('Are you sure you want to save these settings? This will affect the entire platform.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await authenticatedFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset to default settings?')) {
      return;
    }
    fetchSettings(); // Reload from server
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-600 mt-1">Configure platform settings</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleReset}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            🔄 Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Commission Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              💰 {t('settings.commission.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.commission.default')}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={settings.minCommissionPercentage}
                    max={settings.maxCommissionPercentage}
                    value={settings.defaultCommissionPercentage}
                    onChange={(e) => setSettings({...settings, defaultCommissionPercentage: Number(e.target.value)})}
                    className="border-gray-300 rounded-md shadow-sm flex-1"
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Default for new hotels</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.commission.min')}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settings.minCommissionPercentage}
                    onChange={(e) => setSettings({...settings, minCommissionPercentage: Number(e.target.value)})}
                    className="border-gray-300 rounded-md shadow-sm flex-1"
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimum allowed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.commission.max')}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settings.maxCommissionPercentage}
                    onChange={(e) => setSettings({...settings, maxCommissionPercentage: Number(e.target.value)})}
                    className="border-gray-300 rounded-md shadow-sm flex-1"
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Maximum allowed</p>
              </div>
            </div>
              </div>

          {/* Tax Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              🧾 {t('settings.tax.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.tax.rate')}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: Number(e.target.value)})}
                    className="border-gray-300 rounded-md shadow-sm flex-1"
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">VAT/Sales Tax Rate</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.tax.included')}
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.taxIncluded}
                    onChange={(e) => setSettings({...settings, taxIncluded: e.target.checked})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tax included in prices</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">If unchecked, tax will be added at checkout</p>
              </div>
            </div>
              </div>

          {/* Currency Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              💱 {t('settings.currency.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.currency.default')}
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                  className="border-gray-300 rounded-md shadow-sm w-full"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CHF">CHF (Fr)</option>
                  <option value="TRY">TRY (₺)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Platform default currency</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multi-Currency Support
                </label>
                <p className="text-sm text-gray-600">Supported: EUR, USD, GBP</p>
                <p className="mt-1 text-xs text-gray-500">⚠️ Coming soon: Dynamic currency conversion</p>
              </div>
            </div>
              </div>

          {/* Email Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              📧 {t('settings.email.title')}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('settings.email.from')}
                  </label>
                  <input
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                    className="border-gray-300 rounded-md shadow-sm w-full"
                    placeholder="noreply@book.ax"
                  />
                  <p className="mt-1 text-xs text-gray-500">From address for system emails</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('settings.email.replyTo')}
                  </label>
                  <input
                    type="email"
                    value={settings.emailReplyTo}
                    onChange={(e) => setSettings({...settings, emailReplyTo: e.target.value})}
                    className="border-gray-300 rounded-md shadow-sm w-full"
                    placeholder="support@book.ax"
                  />
                  <p className="mt-1 text-xs text-gray-500">Reply-to address</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Email Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.sendBookingConfirmations}
                      onChange={(e) => setSettings({...settings, sendBookingConfirmations: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Send booking confirmations</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.sendStatusUpdates}
                      onChange={(e) => setSettings({...settings, sendStatusUpdates: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Send booking status updates</span>
                  </label>
                </div>
              </div>
            </div>
              </div>

          {/* System Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              ⚙️ {t('settings.system.title')}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Maintenance Mode</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">⚠️ Disables public access to the platform</p>
                </div>
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.registrationEnabled}
                      onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">User Registration Enabled</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">Allow new user signups</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min={6}
                  max={32}
                  value={settings.minPasswordLength}
                  onChange={(e) => setSettings({...settings, minPasswordLength: Number(e.target.value)})}
                  className="border-gray-300 rounded-md shadow-sm w-32"
                />
                <p className="mt-1 text-xs text-gray-500">Security: Minimum 6 characters recommended</p>
              </div>
            </div>
              </div>

          {/* Danger Zone */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center">
              ⚠️ Danger Zone
            </h2>
            <p className="text-sm text-red-700 mb-4">
              These actions are irreversible and can affect the entire platform. Use with extreme caution.
            </p>
            <div className="flex space-x-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Clear All Cache
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}