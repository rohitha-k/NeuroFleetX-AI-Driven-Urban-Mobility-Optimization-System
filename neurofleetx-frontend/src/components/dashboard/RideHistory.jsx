import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, ArrowRight, Car } from 'lucide-react';
import { apiRequest } from '../../api/api';
import { getAuth } from '../../utils/auth';

const RideHistory = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { user, token } = getAuth();
                if (!user || (!user.id && !user.userId)) {
                    console.error("No user found in auth context");
                    setLoading(false);
                    return;
                }

                const userId = user.id || user.userId;
                const role = user.role || localStorage.getItem('user_role');

                const data = await apiRequest(`/api/bookings/history?userId=${userId}&role=${role}`, "GET", null, token);

                // Sort by createdAt desc (newest first)
                const sorted = (data || []).sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return b.id - a.id;
                });
                setRides(sorted);
            } catch (err) {
                console.error("Failed to fetch ride history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (rides.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Car className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No rides yet</h3>
                <p className="text-gray-500">Your completed trips will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Trips</h1>

            <div className="space-y-4">
                {rides.map((ride) => (
                    <div key={ride.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            {/* Trip Details */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={16} />
                                    <span>{ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <Clock size={16} />
                                    <span>#{ride.id}</span>
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    {/* Connecting Line */}
                                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100" />

                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-5 h-5 rounded-full border-4 border-white bg-green-500 shadow-sm shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{ride.origin}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-5 h-5 rounded-full border-4 border-white bg-red-500 shadow-sm shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{ride.destination}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status and Price */}
                            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ride.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    ride.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                        ride.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {ride.status}
                                </span>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">{ride.vehicleType || 'Standard'}</p>
                                    <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                        ₹{ride.price ? ride.price.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RideHistory;
