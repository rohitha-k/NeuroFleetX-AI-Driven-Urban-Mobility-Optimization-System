
import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, User, Truck, Clock, Paperclip } from 'lucide-react';

const VerificationItem = ({ item, onAction }) => {
    const { id, type, title, requester, time, status, image } = item;

    if (status !== 'PENDING') return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Image/Preview */}
            <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                {image ? (
                    <div className="text-xs text-center text-gray-500">
                        [Mock Image]<br />{image}
                    </div>
                ) : (
                    <FileText className="text-gray-400" size={32} />
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-1 inline-block ${type === 'POD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                            {type === 'POD' ? 'Proof of Delivery' : 'Document Review'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {time}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                        <User size={16} /> {requester}
                    </span>
                    {item.vehicle && (
                        <span className="flex items-center gap-1">
                            <Truck size={16} /> {item.vehicle}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onAction(id, 'APPROVED')}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                    <button
                        onClick={() => onAction(id, 'REJECTED')}
                        className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                        <XCircle size={16} /> Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

const VerificationPortal = () => {
    const [items, setItems] = useState([
        { id: 1, type: 'POD', title: 'Delivery #4992 - Zone A', requester: 'John Driver', vehicle: 'V-102', time: '10 mins ago', status: 'PENDING', image: 'package_front_door.jpg' },
        { id: 2, type: 'DOC', title: 'License Renewal', requester: 'Sarah Smith', time: '2 hours ago', status: 'PENDING', image: 'license_scan.pdf' },
        { id: 3, type: 'POD', title: 'Delivery #5001 - Urgent', requester: 'Mike Ross', vehicle: 'V-304', time: '4 hours ago', status: 'PENDING', image: 'signature.png' },
    ]);

    const handleAction = (id, action) => {
        // Optimistic UI update
        setItems(items.filter(i => i.id !== id));
        // In real app: await apiRequest(`/verification/${id}`, "POST", { status: action });
    };

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Verification Portal</h1>
                    <p className="text-gray-500">Review pending items from fleet drivers.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
                    {items.length} Pending
                </div>
            </div>

            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
                        <p className="text-gray-500">No pending items to review.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <VerificationItem key={item.id} item={item} onAction={handleAction} />
                    ))
                )}
            </div>
        </div>
    );
};

export default VerificationPortal;
