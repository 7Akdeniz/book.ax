'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Platform performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">€12,458</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>12.5% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">New Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>8.2% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Active Hotels</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">89</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>15.3% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">1,234</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-red-600">
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            <span>3.1% vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart will be displayed here</p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart will be displayed here</p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Hotels by Revenue</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Hotel {i}</p>
                    <p className="text-xs text-gray-500">City, Country</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">€{(5000 - i * 500).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{150 - i * 20} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New booking', hotel: 'Hotel Paradise', time: '5 min ago', color: 'green' },
              { action: 'Hotel approved', hotel: 'Grand Hotel', time: '12 min ago', color: 'blue' },
              { action: 'Payment received', hotel: 'Beach Resort', time: '23 min ago', color: 'green' },
              { action: 'New user registered', hotel: 'John Doe', time: '1 hour ago', color: 'purple' },
              { action: 'Booking cancelled', hotel: 'City Hotel', time: '2 hours ago', color: 'red' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full bg-${activity.color}-500 mt-2 mr-3`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.hotel}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
