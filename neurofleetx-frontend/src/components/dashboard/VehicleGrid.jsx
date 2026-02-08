

import React, { useState, useEffect } from 'react';
import VehicleCard from './VehicleCard';
import AddVehicleModal from './AddVehicleModal';
import { Filter, Search, Plus, RefreshCw } from 'lucide-react';
import { apiRequest } from "../../api/api";
import { getAuth } from "../../utils/auth";

const VehicleGrid = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const { token } = getAuth();
            const data = await apiRequest("/api/vehicles", "GET", null, token);
            setVehicles(data);
        } catch (err) {
            console.error("Failed to fetch vehicles:", err);
            // Fallback Mock Data for demo purposes if backend empty/fails
            setVehicles([
                { id: 1, name: 'V-101 (Mock)', licensePlate: 'ABC-1234', type: 'EV', status: 'AVAILABLE', battery: 85, location: 'Downtown Hub', lastUpdated: 'Just now' },
                { id: 2, name: 'V-102 (Mock)', licensePlate: 'XYZ-9876', type: 'SUV', status: 'IN_USE', fuel: 45, location: 'Route 66, Mile 12', lastUpdated: '5 min ago' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Vehicle Inventory</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            placeholder="Search fleet..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter size={20} />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Vehicle</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
            </div>

            {showAddModal && (
                <AddVehicleModal
                    onClose={() => setShowAddModal(false)}
                    onVehicleAdded={fetchVehicles}
                />
            )}
        </div>
    );
};

export default VehicleGrid;
