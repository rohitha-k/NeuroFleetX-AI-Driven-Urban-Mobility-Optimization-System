import React, { useState } from 'react';
import { X, Save, Car, Hash, Activity } from 'lucide-react';
import { apiRequest } from '../../api/api';
import { getAuth } from '../../utils/auth';

const AddVehicleModal = ({ onClose, onVehicleAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        licensePlate: '',
        type: 'SEDAN',
        status: 'AVAILABLE'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { token } = getAuth();
            await apiRequest('/api/vehicles', 'POST', formData, token);
            onVehicleAdded();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to add vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Add New Vehicle</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Car size={16} /> Vehicle Name
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Tesla Model 3"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Hash size={16} /> License Plate
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. KA-01-AB-1234"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            value={formData.licensePlate}
                            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="SEDAN">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="TRUCK">Truck</option>
                                <option value="VAN">Van</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Activity size={16} /> Status
                            </label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="IN_USE">In Use</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Vehicle
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
