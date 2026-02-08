
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Navigation, Calendar, Shield, Upload, CheckCircle, Camera, X, MapPin } from 'lucide-react';
import L from 'leaflet';
import { apiRequest } from '../../api/api';
import { getAuth } from '../../utils/auth';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import RideHistory from './RideHistory';

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Car Icon for Driver
const carIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTYzRUIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkgMTdoMmMuNiAwIDEtLjQgMS0xdi0zYzAtLjktLjctMS43LTEuNS0xLjlDMTguNyAxMC42IDE2IDEwIDE2IDEwcy0xLjMtMS40LTIuMi0yLjNjLS41LS40LTEuMS0uNy0xLjgtLjdINWMtLjYgMC0xLjEuNC0xLjQuOWwtMS40IDIuOUEzLjcgMy43IDAgMCAwIDIgMTJ2NGMwIC42LjQgMSAxIDFoMiIvPjxjaXJjbGUgY3g9IjciIGN5PSIxNyIgcj0iMiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTciIHI9IjIiLz48L3N2Zz4=', // Blue Car SVG
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    className: 'booking-car-icon'
});

const DriverDashboard = () => {
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'history'
    const [activeJob, setActiveJob] = useState(null); // 'started', 'completed'
    const [booking, setBooking] = useState(null);
    const [showPODModal, setShowPODModal] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    // Initial mock location (Depot)
    const [currentPosition, setCurrentPosition] = useState([12.9716, 77.5946]);
    const [routePath, setRoutePath] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);

    // WebSocket for New Bookings
    useEffect(() => {
        let stompClient = null;

        if (!booking) {
            const socket = new SockJS('http://localhost:8080/ws');
            stompClient = Stomp.over(socket);
            stompClient.debug = () => { }; // Disable debug logs

            stompClient.connect({}, () => {
                console.log('Driver connected to WebSocket');
                stompClient.subscribe('/topic/bookings/available', (message) => {
                    if (message.body) {
                        const newBooking = JSON.parse(message.body);
                        console.log("New booking received:", newBooking);
                        setBooking(newBooking);
                    }
                });
            }, (error) => {
                console.error("WebSocket connection error:", error);
            });
        }

        return () => {
            if (stompClient && stompClient.ws && stompClient.ws.readyState === 1) {
                stompClient.disconnect();
            }
        };
    }, [booking]);

    // Simulate Navigation Movement & Sync to Backend
    useEffect(() => {
        let navInterval;
        if (isNavigating && activeJob === 'started' && routePath.length > 0 && routeIndex < routePath.length - 1) {
            navInterval = setInterval(async () => {
                setRouteIndex(prev => {
                    const next = prev + 1;
                    if (next < routePath.length) {
                        const newPos = routePath[next];
                        setCurrentPosition(newPos);

                        // Sync to Real Backend
                        if (booking) {
                            const { token } = getAuth();
                            apiRequest(`/api/bookings/${booking.id}/location`, "POST", { lat: newPos[0], lng: newPos[1] }, token);
                        }
                        return next;
                    }
                    setIsNavigating(false); // Arrived
                    return prev;
                });
            }, 1000); // Move every second
        }
        return () => clearInterval(navInterval);
    }, [isNavigating, activeJob, routeIndex, routePath, booking]);

    const handleAcceptJob = async () => {
        if (!booking) return;
        const { token, user } = getAuth();
        try {
            await apiRequest(`/api/bookings/${booking.id}/accept`, "POST", { driverId: user.id }, token);

            // Fetch Optimized Route from Backend to ensure consistency with Customer Map
            try {
                const routeData = await apiRequest("/api/routes/optimize", "POST", {
                    origin: booking.origin,
                    destination: booking.destination,
                    vehicleType: booking.vehicleType || 'Standard'
                }, token);

                if (routeData && routeData.routes && routeData.routes.length > 0) {
                    // Use the first recommended route
                    const bestRoute = routeData.routes[0];
                    if (bestRoute.coordinates) {
                        setRoutePath(bestRoute.coordinates.map(c => [c.lat, c.lng]));
                    } else {
                        generateMockRoute(); // Fallback
                    }
                } else {
                    generateMockRoute();
                }
            } catch (routeError) {
                console.error("Route fetch failed, using fallback", routeError);
                generateMockRoute();
            }

            setActiveJob('accepted');
        } catch (e) {
            alert("Failed to accept: " + e.message);
        }
    };

    const handleStartJob = async () => {
        if (!booking) return;
        const { token } = getAuth();
        await apiRequest(`/api/bookings/${booking.id}/status`, "POST", { status: 'STARTED' }, token);
        setActiveJob('started');
        setIsNavigating(true);
    };

    const generateMockRoute = () => {
        // Just a simple diagonal path for demo
        const path = [];
        const steps = 20;
        const dest = [12.9783, 77.6408]; // Indiranagar mock
        for (let i = 0; i <= steps; i++) {
            const lat = currentPosition[0] + (dest[0] - currentPosition[0]) * (i / steps);
            const lng = currentPosition[1] + (dest[1] - currentPosition[1]) * (i / steps);
            path.push([lat, lng]);
        }
        setRoutePath(path);
    };

    const toggleNavigation = () => {
        if (activeJob !== 'started') {
            alert("Please start the job first!");
            return;
        }
        setIsNavigating(!isNavigating);
    };

    const handleCompleteJob = () => {
        setIsNavigating(false);
        setShowPODModal(true);
    };

    const submitPOD = async () => {
        if (booking) {
            const { token } = getAuth();
            await apiRequest(`/api/bookings/${booking.id}/status`, "POST", { status: 'COMPLETED' }, token);
        }
        setShowPODModal(false);
        setActiveJob(null);
        setBooking(null);
        setRouteIndex(0);
        setRoutePath([]);
        alert("Ride Completed Successfully!");
    };

    if (view === 'history') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Ride History</h2>
                    <button
                        onClick={() => setView('dashboard')}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                        Back to Dashboard
                    </button>
                </div>
                <RideHistory />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Left Column: Job Info */}
            <div className="space-y-6">
                {/* Current Vehicle Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold mb-1">My Vehicle</h2>
                            <p className="text-slate-400 text-sm">Assigned for today</p>
                        </div>
                        <button
                            onClick={() => setView('history')}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                            title="View History"
                        >
                            <Calendar size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Tesla Model 3</h3>
                                <p className="text-gray-500 font-mono">XYZ-9988</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Shield size={24} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Battery Level</span>
                                <span className="font-bold text-green-600">82%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule / Requests */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar size={18} /> {booking ? "Current Job" : "Waiting for Requests..."}
                    </h3>

                    {!booking && (
                        <div className="text-center p-8 text-gray-400 animate-pulse">
                            Searching for nearby rides...
                        </div>
                    )}

                    {booking && (
                        <div className={`relative p-4 rounded-xl border ${activeJob === 'started' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">NEW REQUEST</span>
                                    <h4 className="text-lg font-bold text-gray-900">{booking.destination}</h4>
                                    <p className="text-sm text-gray-600">From: {booking.origin}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">₹{booking.price}</div>
                                    <div className="text-xs text-gray-500">{booking.distance}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                {!activeJob ? (
                                    <button onClick={handleAcceptJob} className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800">
                                        Accept Ride
                                    </button>
                                ) : activeJob === 'accepted' ? (
                                    <button onClick={handleStartJob} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                                        Start Trip
                                    </button>
                                ) : (
                                    <button onClick={handleCompleteJob} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">
                                        Complete Trip
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Map & Navigation */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 relative">
                    <div className="h-[500px] rounded-lg overflow-hidden relative z-0">
                        <MapContainer center={currentPosition} zoom={14} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                            {/* Route Line */}
                            {routePath.length > 0 && <Polyline positions={routePath} color="blue" weight={5} opacity={0.7} />}

                            {/* Driver Location */}
                            <Marker position={currentPosition} icon={carIcon} zIndexOffset={100}>
                                <Popup>You are here</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Navigation HUD Overlay */}
                    {isNavigating && (
                        <div className="absolute top-4 left-4 right-4 bg-slate-900/90 text-white p-4 rounded-xl shadow-lg backdrop-blur-md z-[400] flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <Navigation size={32} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Navigating</p>
                                    <h2 className="text-xl font-bold">To Destination</h2>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* POD Modal */}
            {showPODModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Proof of Delivery</h3>
                            <button onClick={() => setShowPODModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 font-medium">Please confirm delivery completion.</p>

                            <textarea placeholder="Add delivery notes..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none h-24"></textarea>

                            <button onClick={submitPOD} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                <Upload size={18} />
                                Submit Delivery
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DriverDashboard;
