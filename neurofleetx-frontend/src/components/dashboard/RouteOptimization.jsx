
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, Leaf, Zap, Navigation, MapPin, Search } from "lucide-react";
import L from "leaflet";
import { apiRequest } from "../../api/api";
import { getAuth } from "../../utils/auth";

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

const RouteCard = ({ type, time, distance, traffic, active, onClick, color }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${active
            ? `border-${color}-500 bg-${color}-50 shadow-sm ring-1 ring-${color}-200`
            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
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
        <div className="flex items-baseline gap-1 mb-1">
            <h3 className="text-xl font-bold text-gray-900">{time}</h3>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
            <span>{distance}</span>
            <span className={traffic === 'Heavy' ? 'text-red-500 font-medium' : 'text-green-600'}>
                {traffic} Traffic
            </span>
        </div>
    </div>
);

const RouteOptimization = () => {
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [origin, setOrigin] = useState("Bangalore");
    const [destination, setDestination] = useState("Indiranagar");
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const { token } = getAuth();
            const response = await apiRequest("/api/routes/optimize", "POST", {
                origin,
                destination
            }, token);

            if (response.status === "success") {
                setRoutes(response.routes);
                setSelectedRouteIndex(0); // Select first by default
            } else {
                setError("Failed to calculate routes");
            }
        } catch (err) {
            console.error("Route calculation error:", err);
            setError("Failed to connect to route engine");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const getColor = (type) => {
        switch (type) {
            case 'fastest': return 'blue';
            case 'eco-friendly': return 'green';
            case 'shortest': return 'orange';
            default: return 'gray';
        }
    };

    const activeRoute = routes[selectedRouteIndex];

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">
            {/* Sidebar Controls */}
            <div className="w-96 flex flex-col gap-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-y-auto">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Route Optimization</h2>
                    <p className="text-sm text-gray-500">AI-suggested paths (Backend Powered).</p>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute left-3 top-3 w-2 h-2 rounded-full border-2 border-slate-400"></div>
                        <div className="absolute left-4 top-5 w-0.5 h-8 bg-gray-200"></div>
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Origin City"
                            className="w-full pl-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 text-blue-500" size={16} />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Destination City"
                            className="w-full pl-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <button
                        onClick={fetchRoutes}
                        disabled={loading}
                        className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Calculating AI Routes...' : <><Search size={16} /> Recalculate</>}
                    </button>
                </div>

                {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

                {/* AI Suggestions */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Zap size={16} className="text-yellow-500" />
                        AI Recommendations
                    </h3>

                    {loading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-24 bg-gray-100 rounded-xl"></div>
                            <div className="h-24 bg-gray-100 rounded-xl"></div>
                            <div className="h-24 bg-gray-100 rounded-xl"></div>
                        </div>
                    ) : (
                        routes.map((route, idx) => (
                            <RouteCard
                                key={idx}
                                type={route.type}
                                time={route.estimatedTime}
                                distance={route.distance}
                                traffic={route.trafficLevel}
                                color={getColor(route.type)}
                                active={selectedRouteIndex === idx}
                                onClick={() => setSelectedRouteIndex(idx)}
                            />
                        ))
                    )}
                </div>

                <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Navigation size={18} />
                    Start Navigation
                </button>
            </div>

            {/* Map View */}
            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                <MapContainer center={[12.9716, 77.5946]} zoom={11} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Start/End Markers could be dynamic based on first/last coordinate of active route, 
                        but for now keeping static Bangalore center or basic logic */}
                    {activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 0 && (
                        <>
                            <Marker position={[activeRoute.coordinates[0].lat, activeRoute.coordinates[0].lng]}>
                                <Popup>Origin: {origin}</Popup>
                            </Marker>
                            <Marker position={[activeRoute.coordinates[activeRoute.coordinates.length - 1].lat, activeRoute.coordinates[activeRoute.coordinates.length - 1].lng]}>
                                <Popup>Destination: {destination}</Popup>
                            </Marker>

                            <Polyline
                                positions={activeRoute.coordinates.map(c => [c.lat, c.lng])}
                                color={getColor(activeRoute.type)}
                                weight={5}
                                opacity={0.8}
                            />
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default RouteOptimization;
