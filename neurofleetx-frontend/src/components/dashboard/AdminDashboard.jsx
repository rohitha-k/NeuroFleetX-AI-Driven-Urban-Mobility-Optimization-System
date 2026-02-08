import React from 'react';
import { TrendingUp, Truck, AlertTriangle, Battery, Clock, MapPin } from 'lucide-react';
import MapView from './MapView'; // Import MapView component
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {trend > 0 ? '+' : ''}{trend}%
        <TrendingUp size={14} className="ml-1" />
      </span>
      <span className="text-sm text-gray-400">vs last month</span>
    </div>
  </div>
);

const ActivityItem = ({ title, time, type }) => {
  let icon, color;
  switch (type) {
    case 'alert': icon = AlertTriangle; color = 'bg-red-100 text-red-600'; break;
    case 'success': icon = Truck; color = 'bg-green-100 text-green-600'; break;
    default: icon = Clock; color = 'bg-blue-100 text-blue-600';
  }
  const Icon = icon;

  return (
    <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className={`p-2 rounded-full ${color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // Mock Data for South India
  const southIndiaVehicles = [
    { id: 1, name: "V-101 (Bangalore)", lat: 12.9716, lng: 77.5946, status: "Active" },
    { id: 2, name: "V-102 (Hyderabad)", lat: 17.3850, lng: 78.4867, status: "In Transit" },
    { id: 3, name: "V-103 (Chennai)", lat: 13.0827, lng: 80.2707, status: "Active" },
    { id: 4, name: "V-104 (Visakhapatnam)", lat: 17.6868, lng: 83.2185, status: "Maintenance" },
    { id: 5, name: "V-105 (Vijayawada)", lat: 16.5062, lng: 80.6480, status: "Active" },
    { id: 6, name: "V-106 (Coimbatore)", lat: 11.0168, lng: 76.9558, status: "In Transit" },
    { id: 7, name: "V-107 (Madurai)", lat: 9.9252, lng: 78.1198, status: "Active" },
    { id: 8, name: "V-108 (Mysore)", lat: 12.2958, lng: 76.6394, status: "Idle" }
  ];

  // Mock Routes for South India
  const southIndiaRoutes = [
    { coordinates: [[12.9716, 77.5946], [12.2958, 76.6394]], color: "blue" }, // Bangalore -> Mysore
    { coordinates: [[17.3850, 78.4867], [16.5062, 80.6480]], color: "green" }, // Hyderabad -> Vijayawada
    { coordinates: [[13.0827, 80.2707], [12.9716, 77.5946]], color: "purple" }, // Chennai -> Bangalore
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fleet"
          value="124"
          change="+12"
          icon={Truck}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Active Vehicles"
          value="86"
          change="+5"
          icon={MapPin}
          color="bg-green-500"
          trend={5}
        />
        <StatCard
          title="Maintenance Alert"
          value="3"
          change="-2"
          icon={AlertTriangle}
          color="bg-orange-500"
          trend={-25}
        />
        <StatCard
          title="Avg Efficiency"
          value="94%"
          change="+1.2"
          icon={Battery}
          color="bg-purple-500"
          trend={2.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Main Map View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Live Fleet Tracking</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            </div>
          </div>
          <div className="flex-1 bg-gray-100 relative">
            <MapView vehicles={southIndiaVehicles} routes={southIndiaRoutes} zoom={6} center={[14.5, 78.5]} />
          </div>
        </div>

        {/* Recent Activity & Analytics Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Fleet Analytics</h3>
          </div>
          <div className="flex-1 p-4">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', dist: 4000 },
                  { name: 'Tue', dist: 3000 },
                  { name: 'Wed', dist: 2000 },
                  { name: 'Thu', dist: 2780 },
                  { name: 'Fri', dist: 1890 },
                  { name: 'Sat', dist: 2390 },
                  { name: 'Sun', dist: 3490 },
                ]}>
                  <defs>
                    <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="dist" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDist)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-1 overflow-y-auto h-[300px]">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Recent Logs</h4>
              <ActivityItem title="Vehicle V-102 started route 'Downtown Express'" time="2 mins ago" type="success" />
              <ActivityItem title="Speed Alert: V-405 exceeded 80km/h" time="15 mins ago" type="alert" />
              <ActivityItem title="Geofence Entry: V-203 at Logistics Hub" time="24 mins ago" type="info" />
              <ActivityItem title="Maintenance Request: V-108 Check Engine" time="1 hour ago" type="alert" />
              <ActivityItem title="Vehicle V-304 completed route" time="1 hour ago" type="success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
