
import React from 'react';
import { Battery, Fuel, MapPin, MoreVertical, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
    const { name, licensePlate, status, type, battery, fuel, location, lastUpdated } = vehicle;

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-green-100 text-green-700 border-green-200';
            case 'IN_USE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'MAINTENANCE': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'AVAILABLE': return <CheckCircle size={14} className="mr-1" />;
            case 'IN_USE': return <Clock size={14} className="mr-1" />;
            case 'MAINTENANCE':
            case 'CRITICAL': return <AlertTriangle size={14} className="mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-lg">{name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            {status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-mono">{licensePlate}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin size={16} />
                    </div>
                    <p className="text-sm truncate">{location}</p>
                </div>

                {/* Telemetry */}
                <div className="grid grid-cols-2 gap-3">
                    {type === 'EV' ? (
                        <div className="border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center bg-gray-50/50">
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                                <Battery size={14} />
                                <span>Battery</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                                <div className={`h-full rounded-full ${battery > 20 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${battery}%` }}></div>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{battery}%</span>
                        </div>
                    ) : (
                        <div className="border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center bg-gray-50/50">
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                                <Fuel size={14} />
                                <span>Fuel</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                                <div className={`h-full rounded-full ${fuel > 20 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${fuel}%` }}></div>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{fuel}%</span>
                        </div>
                    )}

                    <div className="border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center bg-gray-50/50">
                        <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                        <p className="text-xs font-medium text-slate-700">{lastUpdated}</p>
                    </div>
                </div>
            </div>

            {/* Visual Indicator for map link (optional interaction hint) */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform rounded-b-xl" />
        </div>
    );
};

export default VehicleCard;
