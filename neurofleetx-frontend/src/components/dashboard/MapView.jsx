import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Truck, Navigation } from "lucide-react";

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapView = ({
  vehicles = [],
  routes = [],
  center = [12.9716, 77.5946],
  zoom = 13,
}) => {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-100 z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[
              vehicle.lat || vehicle.latitude || 12.9716,
              vehicle.lng || vehicle.longitude || 77.5946,
            ]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Routes */}
        {routes.map((route, idx) => (
          <Polyline
            key={idx}
            positions={route.coordinates}
            color={route.color || "blue"}
            weight={4}
            opacity={0.7}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
