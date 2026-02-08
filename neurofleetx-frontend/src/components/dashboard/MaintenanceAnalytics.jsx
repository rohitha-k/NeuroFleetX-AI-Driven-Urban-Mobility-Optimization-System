import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle, Wrench, RefreshCw, ChevronDown } from 'lucide-react';
import { apiRequest } from '../../api/api';
import { getAuth } from '../../utils/auth';

const MaintenanceAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6']; // Green, Orange, Red, Blue

    const fetchAnalytics = async () => {
        try {
            const { token } = getAuth();
            const data = await apiRequest("/api/maintenance/analytics", "GET", null, token);
            setAnalytics(data);

            // Auto-select first alerted vehicle if available
            if (data.alerts && data.alerts.length > 0) {
                handleSelectVehicle(data.alerts[0].id, data.alerts[0].name);
            }
        } catch (e) {
            console.error("Analytics fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (id) => {
        try {
            const { token } = getAuth();
            const data = await apiRequest(`/api/maintenance/history/${id}`, "GET", null, token);
            // Reverse to show oldest first on graph
            setHistory(data.reverse());
        } catch (e) {
            console.error("History fetch failed", e);
        }
    };

    const handleSelectVehicle = (id, name) => {
        setSelectedVehicle({ id, name });
        fetchHistory(id);
    };

    const triggerSimulation = async () => {
        const { token } = getAuth();
        await apiRequest("/api/maintenance/simulate", "POST", null, token);
        fetchAnalytics(); // Refresh
        if (selectedVehicle) fetchHistory(selectedVehicle.id);
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

    const pieData = analytics ? [
        { name: 'Healthy', value: analytics.statusDistribution.AVAILABLE || 0 },
        { name: 'Maintenance Due', value: analytics.statusDistribution.MAINTENANCE || 0 },
        { name: 'Critical', value: analytics.statusDistribution.CRITICAL || 0 },
        { name: 'In Use', value: analytics.statusDistribution.IN_USE || 0 },
    ] : [];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Predictive Maintenance & Health</h2>
                    <p className="text-sm text-gray-500">Real-time health monitoring and predictive analytics</p>
                </div>
                <button
                    onClick={triggerSimulation}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                    <RefreshCw size={18} /> Simulate Sensor Update
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fleet Health Overview (Pie Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Fleet Health Status</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 flex-wrap">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                <span className="text-sm font-medium text-gray-600">{entry.name}: {entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critical Alerts Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} /> Action Required
                    </h3>

                    <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {analytics && analytics.alerts.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                    <tr>
                                        <th className="p-3 font-medium">Vehicle</th>
                                        <th className="p-3 font-medium">Issue</th>
                                        <th className="p-3 font-medium">Action</th>
                                        <th className="p-3 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {analytics.alerts.map((alert) => (
                                        <tr key={alert.id} className="hover:bg-gray-50 group transition-colors">
                                            <td className="p-3 font-medium text-gray-900">{alert.name}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${alert.status === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {alert.issue}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">{alert.action}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => handleSelectVehicle(alert.id, alert.name)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                                                >
                                                    Analyze
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                <CheckCircle size={48} className="text-emerald-200 mb-2" />
                                <p>All systems normal. No critical alerts.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Historical Analysis (Line Chart) */}
            {selectedVehicle && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Vehicle Diagnostic History</h3>
                            <p className="text-sm text-gray-500">Analyzing: <span className="font-bold text-blue-600">{selectedVehicle.name}</span></p>
                        </div>
                        <div className="flex gap-4">
                            {/* Could add metric selector here (Engine vs Battery) */}
                        </div>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    stroke="#94a3b8"
                                    fontSize={12}
                                />
                                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleString()}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="engineHealth"
                                    name="Engine Health"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="tirePressure"
                                    name="Tire Pressure (PSI)"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceAnalytics;
