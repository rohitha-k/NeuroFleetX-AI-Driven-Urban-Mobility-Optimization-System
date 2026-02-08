
import React from 'react';
import { AlertTriangle, Wrench, Battery, CheckCircle, Clock, LayoutDashboard, Activity } from 'lucide-react';
import VehicleGrid from './VehicleGrid';
import MaintenanceAnalytics from './MaintenanceAnalytics';
import { useState } from 'react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
        </div>
        <div className="mt-4">
            <span className="text-xs text-gray-400">{subtext}</span>
        </div>
    </div>
);



const ManagerDashboard = () => {
    const [view, setView] = useState('overview'); // 'overview' or 'analytics'

    return (
        <div className="space-y-8">
            {/* Header with Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {view === 'overview' ? 'Fleet Manager Overview' : 'Maintenance & Analytics'}
                    </h1>
                    <p className="text-gray-500">
                        {view === 'overview' ? 'Monitor vehicle health and operational status.' : 'Predictive insights and fleet diagnostics.'}
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setView('overview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'overview'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <LayoutDashboard size={18} /> Overview
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'analytics'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Activity size={18} /> Analytics
                    </button>
                </div>
            </div>

            {view === 'overview' ? (
                <>
                    {/* Operational Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Fleet Health"
                            value="98%"
                            icon={CheckCircle}
                            color="bg-emerald-500"
                            subtext="Operational Capacity"
                        />
                        <StatCard
                            title="Maintenance Due"
                            value="4"
                            icon={Wrench}
                            color="bg-orange-500"
                            subtext="Vehicles requiring service"
                        />
                        <StatCard
                            title="Avg Battery Level"
                            value="76%"
                            icon={Battery}
                            color="bg-blue-500"
                            subtext="Across 42 EVs"
                        />
                        <StatCard
                            title="Active Issues"
                            value="2"
                            icon={AlertTriangle}
                            color="bg-red-500"
                            subtext="Requires immediate attention"
                        />
                    </div>

                    {/* Quick Action / Alerts */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => setView('analytics')}>
                        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-semibold text-yellow-800">Maintenance Alert</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Vehicle <strong>V-304</strong> reported engine anomaly. <span className="underline font-medium">View Analysis</span>
                            </p>
                        </div>
                    </div>

                    {/* Fleet View */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Vehicle Inventory</h2>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <VehicleGrid />
                        </div>
                    </div>
                </>
            ) : (
                <MaintenanceAnalytics />
            )}
        </div>
    );
};

export default ManagerDashboard;
