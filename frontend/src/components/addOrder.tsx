import React, { useState } from 'react';
import { createOrder } from '../services/api';

interface OrderFormData {
  customerName: string;
  deliveryAddress: string;
  status: string;
}

interface AddOrderProps {
  onOrderAdded: (newOrder: any) => void;
  showNotification?: (message: string, type: 'success' | 'error' | 'info') => void; // Make showNotification optional
}

const AddOrder: React.FC<AddOrderProps> = ({ onOrderAdded, showNotification }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    deliveryAddress: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.deliveryAddress)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const orderData = {
          ...formData,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
        console.log("Order data being sent to backend:", orderData);
        const response = await createOrder(orderData);
        setSuccess('Order added successfully!');
        onOrderAdded(response.data); 
        if (showNotification) {
          showNotification('Order added successfully!', 'success'); // Trigger success notification
        }
        setFormData({
          customerName: '',
          deliveryAddress: '',
          status: 'Pending'
        });
      } else {
        setError('Could not find coordinates for the provided address. Please try a more specific address.');
        if (showNotification) {
          showNotification('Failed to add order: Invalid address.', 'error'); // Trigger error notification
        }
      }
    } catch (error) {
      console.error('Error creating order', error);
      setError(error instanceof Error ? error.message : 'Failed to create order. Please try again.');
      if (showNotification) {
        showNotification('Failed to add order.', 'error'); // Trigger error notification
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add order</h2>
            <p className="mt-1 text-sm text-slate-600">Create a new order by customer and address.</p>
          </div>
          <div className="badge badge-info">New</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="customerName" className="label">Customer name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              placeholder="Enter customer name"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="deliveryAddress" className="label">Delivery address</label>
            <input
              type="text"
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              required
              placeholder="Enter full delivery address"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="status" className="label">Order status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="select"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <span className="font-semibold">Success:</span> {success}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Adding order…' : 'Add order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
