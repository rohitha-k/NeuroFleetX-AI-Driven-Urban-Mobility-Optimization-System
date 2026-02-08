
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, Star, ChevronRight, Navigation, Search, Zap, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { apiRequest } from '../../api/api'; // Import apiRequest
import { getAuth } from '../../utils/auth';
import RideHistory from './RideHistory';


// Fix Leaflet Default Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Car Icon (Same as DriverDashboard)
const carIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTYzRUIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkgMTdoMmMuNiAwIDEtLjQgMS0xdi0zYzAtLjktLjctMS43LTEuNS0xLjljLS44LS4zLTEuNy0uNS0yLjUtLjVDMTguNyAxMC42IDE2IDEwIDE2IDEwcy0xLjMtMS40LTIuMi0yLjNjLS41LS40LTEuMS0uNy0xLjgtLjdINWMtLjYgMC0xLjEuNC0xLjQuOWwtMS40IDIuOUEzLjcgMy43IDAgMCAwIDIgMTJ2NGMwIC42LjQgMSAxIDFoMiIvPjxjaXJjbGUgY3g9IjciIGN5PSIxNyIgcj0iMiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTciIHI9IjIiLz48L3N2Zz4=', // Blue Car SVG
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    className: 'booking-car-icon'
});

const RouteCard = ({ type, time, distance, traffic, active, onClick, color, price }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${active
            ? `border-${color}-500 bg-${color}-50 shadow-sm ring-1 ring-${color}-200`
            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
            }`}
    >
        <div className="flex justify-between items-start mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${type === 'fastest' ? 'bg-blue-100 text-blue-700' :
                type === 'eco-friendly' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                }`}>
                {type}
            </span>
            {active && <div className={`w-3 h-3 rounded-full bg-${color}-500`} />}
        </div>
        <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-1">
                <h3 className="text-xl font-bold text-gray-900">{time}</h3>
                <span className="text-sm text-gray-500">min</span>
            </div>
            <div className="text-right">
                <span className="text-lg font-bold text-gray-900">₹{price}</span>
            </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
            <span>{distance}</span>
            <span className={traffic === 'Heavy' ? 'text-red-500 font-medium' : 'text-green-600'}>
                {traffic} Traffic
            </span>
        </div>
    </div>
);

const FeedbackModal = ({ onClose, onSubmit }) => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in fade-in duration-200">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ride Completed!</h3>
                <p className="text-gray-500 text-sm">How was your experience?</p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-yellow-400 hover:scale-110 transition-transform">
                        <Star size={32} fill="currentColor" />
                    </button>
                ))}
            </div>

            <textarea
                placeholder="Leave a comment (optional)..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
                rows="3"
            ></textarea>

            <button onClick={onSubmit} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Submit Feedback
            </button>
        </div>
    </div>
);

const CustomerDashboard = () => {
    const [origin, setOrigin] = useState("MG Road, Bangalore");
    const [destination, setDestination] = useState("Indiranagar, Bangalore");
    const [routes, setRoutes] = useState([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rideStatus, setRideStatus] = useState('IDLE'); // IDLE, BOOKED, ARRIVING, IN_TRIP
    const [vehicleType, setVehicleType] = useState('Standard');
    const [bookingId, setBookingId] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);

    // New State for persistence and feedback
    const [activeRoute, setActiveRoute] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // WebSocket & Status Sync
    useEffect(() => {
        const savedBookingId = localStorage.getItem('activeBookingId');
        const savedRoute = localStorage.getItem('activeRoute');

        if (savedBookingId && !bookingId) {
            setBookingId(savedBookingId);
            setRideStatus('BOOKED'); // Assume booked, will update via API
        }
        if (savedRoute && !activeRoute) {
            try {
                setActiveRoute(JSON.parse(savedRoute));
            } catch (e) {
                console.error("Failed to parse saved route", e);
            }
        }

        let stompClient = null;

        if (bookingId) {
            // Initial Sync
            const fetchStatus = async () => {
                const { token } = getAuth();
                try {
                    const booking = await apiRequest(`/api/bookings/${bookingId}`, "GET", null, token);
                    if (booking) updateBookingState(booking);
                } catch (e) {
                    console.error("Fetch error", e);
                }
            };
            fetchStatus();

            // WebSocket Connection
            const socket = new SockJS('http://localhost:8080/ws');
            stompClient = Stomp.over(socket);
            stompClient.debug = (str) => console.log("STOMP: " + str); // Enable debug

            stompClient.connect({}, () => {
                console.log(`Connected to WebSocket for Booking ${bookingId}`);
                stompClient.subscribe(`/topic/bookings/${bookingId}`, (message) => {
                    console.log("Received WebSocket update:", message.body);
                    const booking = JSON.parse(message.body);
                    updateBookingState(booking);
                });
            }, (error) => {
                console.error("STOMP Connection Error:", error);
            });
        }

        return () => {
            if (stompClient) stompClient.disconnect();
        };
    }, [bookingId]); // Removed rideStatus dependency to avoid re-subscription loops

    const updateBookingState = (booking) => {
        if (booking.status === 'ACCEPTED' && rideStatus !== 'ARRIVING') {
            setRideStatus('ARRIVING');
        } else if (booking.status === 'STARTED' && rideStatus !== 'IN_TRIP') {
            setRideStatus('IN_TRIP');
        } else if (booking.status === 'COMPLETED') {
            // Instead of clearing immediately, show feedback
            if (rideStatus !== 'IDLE') {
                setRideStatus('IDLE');
                setShowFeedback(true);
            }
        }

        if (booking.driverLat && booking.driverLng) {
            setDriverLocation([booking.driverLat, booking.driverLng]);
        }
    };

    const handleRouteCalculation = async () => {
        setLoading(true);
        try {
            const { token } = getAuth();
            const response = await apiRequest("/api/routes/optimize", "POST", { origin, destination, vehicleType }, token);
            if (response.status === "success" && response.routes) {
                // Pricing Rates per KM
                const rates = {
                    'Standard': 14,
                    'EV': 15,
                    'Luxury': 25
                };
                const ratePerKm = rates[vehicleType] || 14;

                const enrichedRoutes = response.routes.map(r => {
                    // Parse distance string "12.5 km" -> 12.5
                    const distanceValue = parseFloat(r.distance.replace(/[^0-9.]/g, '')) || 0;
                    return {
                        ...r,
                        time: r.estimatedTime.replace(/[^0-9]/g, ''), // Extract only the number part
                        price: (distanceValue * ratePerKm).toFixed(2)
                    };
                });
                setRoutes(enrichedRoutes);
                setSelectedRouteIndex(0);
                // Temporarily set active route for preview
                setActiveRoute(enrichedRoutes[0]);
            }
        } catch (error) {
            console.error("Failed to fetch routes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        const selectedRoute = routes[selectedRouteIndex];
        if (!selectedRoute) return;

        setLoading(true);
        try {
            const { token, user } = getAuth();
            const payload = {
                customerId: user ? user.id : 1,
                origin: origin,
                destination: destination,
                vehicleType: selectedRoute.type,
                price: parseFloat(selectedRoute.price),
                distance: selectedRoute.distance
            };

            const booking = await apiRequest("/api/bookings/create", "POST", payload, token);
            if (booking && booking.id) {
                setBookingId(booking.id);
                setActiveRoute(selectedRoute); // Set active route logic
                localStorage.setItem('activeBookingId', booking.id);
                localStorage.setItem('activeRoute', JSON.stringify(selectedRoute)); // Persist route
                setRideStatus('BOOKED');
            }
        } catch (e) {
            alert("Booking failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = () => {
        setShowFeedback(false);
        setBookingId(null);
        setDriverLocation(null);
        setActiveRoute(null);
        localStorage.removeItem('activeBookingId');
        localStorage.removeItem('activeRoute');
        alert("Thank you for your feedback!");
        // Refresh or reset state as needed
        // window.location.reload(); // Consider if a full reload is necessary or just state reset
    };

    const getColor = (type) => {
        switch (type) {
            case 'fastest': return 'blue';
            case 'eco-friendly': return 'green';
            case 'shortest': return 'orange';
            default: return 'gray';
        }
    };

    // ... (rest of the code)
    const [view, setView] = useState('dashboard');

    // Import RideHistory dynamically or if imported at top
    // Since I cannot import at top easily with partial replace, I will assume it is imported or I'll add import

    // Actually, I should check if I imported RideHistory. I haven't.
    // I will do a multi-replace to add import and logic.

    if (view === 'history') {
        return (
            <div className="flex flex-col h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Activity</h2>
                    <button
                        onClick={() => setView('dashboard')}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold shadow-sm"
                    >
                        Back to Map
                    </button>
                </div>
                <RideHistory />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] relative">
            {/* Interaction Panel */}
            <div className="w-full lg:w-[400px] bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Plan Your Ride</h2>
                    <button
                        onClick={() => setView('history')}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Ride History"
                    >
                        <Clock size={20} />
                    </button>
                </div>

                {rideStatus === 'IDLE' && !showFeedback ? (
                    <>
                        {/* Inputs... */}

                        <div className="space-y-4 mb-6">
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 w-2 h-2 rounded-full border-2 border-slate-400"></div>
                                <div className="absolute left-4 top-5 w-0.5 h-10 bg-gray-200"></div>
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-3 text-blue-600" size={18} />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Where to?"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {['Standard', 'EV', 'Luxury'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setVehicleType(type)}
                                        className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg border ${vehicleType === type
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleRouteCalculation}
                                disabled={loading}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Analyzing Routes...' : <><Search size={16} /> Update Route</>}
                            </button>
                        </div>

                        {/* Route Options */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Zap size={16} className="text-yellow-500" />
                                Recommended Paths
                            </h3>

                            {loading ? (
                                <div className="space-y-3 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-50 rounded-xl" />)}
                                </div>
                            ) : (
                                routes.map((route, idx) => (
                                    <RouteCard
                                        key={idx}
                                        {...route}
                                        color={getColor(route.type)}
                                        active={selectedRouteIndex === idx}
                                        onClick={() => {
                                            setSelectedRouteIndex(idx);
                                            setActiveRoute(route);
                                        }}
                                    />
                                ))
                            )}
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={loading || routes.length === 0}
                            className="mt-auto w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : 'Confirm Booking'}
                        </button>
                    </>
                ) : (
                    // Booking Status View
                    <div className="h-full flex flex-col">
                        <div className="text-center mb-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse ${rideStatus === 'IN_TRIP' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                <Car size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {rideStatus === 'BOOKED' ? 'Finding Driver...' :
                                    rideStatus === 'ARRIVING' ? 'Driver Arriving' :
                                        'Heading onto destination'}
                            </h2>
                            <p className="text-gray-500">
                                {rideStatus === 'BOOKED' ? 'Connecting to nearby fleet...' :
                                    rideStatus === 'IN_TRIP' ? `Approaching destination (${activeRoute?.time || '15'} min)` : `Expected in ${activeRoute?.time || '4'} mins`}
                            </p>
                        </div>

                        {/* Driver Details Card - Corrected Vehicle Info */}
                        {rideStatus !== 'BOOKED' && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Driver #42</h4>
                                        <p className="text-sm text-gray-500">Tesla Model 3 • XYZ-9988</p>
                                    </div>
                                    <div className="ml-auto flex gap-1 text-orange-500 font-bold">
                                        <Star size={16} fill="currentColor" /> 4.9
                                    </div>
                                </div>
                            </div>
                        )}

                        {rideStatus !== 'IDLE' && (
                            <button
                                onClick={() => {
                                    setRideStatus('IDLE');
                                    setBookingId(null);
                                    setDriverLocation(null);
                                    setActiveRoute(null);
                                    localStorage.removeItem('activeBookingId');
                                    localStorage.removeItem('activeRoute');
                                }}
                                className="mt-auto w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 transition-colors"
                            >
                                Cancel Ride
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                    {/* Render Active Route Polyline from State (persisted) */}
                    {activeRoute && activeRoute.coordinates && (
                        <>
                            <Marker position={[activeRoute.coordinates[0].lat, activeRoute.coordinates[0].lng]}>
                                <Popup>Origin</Popup>
                            </Marker>
                            <Marker position={[activeRoute.coordinates[activeRoute.coordinates.length - 1].lat, activeRoute.coordinates[activeRoute.coordinates.length - 1].lng]}>
                                <Popup>Destination</Popup>
                            </Marker>
                            <Polyline
                                positions={activeRoute.coordinates.map(c => [c.lat, c.lng])}
                                color={getColor(activeRoute.type)}
                                weight={5}
                                opacity={0.8}
                            />
                        </>
                    )}

                    {/* Live Driver Marker */}
                    {driverLocation && (
                        <Marker position={driverLocation} zIndexOffset={100} icon={carIcon}>
                            <Popup>Your Ride</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            {/* Feedback Modal */}
            {showFeedback && <FeedbackModal onSubmit={handleFeedbackSubmit} />}
        </div>
    );
};

export default CustomerDashboard;
