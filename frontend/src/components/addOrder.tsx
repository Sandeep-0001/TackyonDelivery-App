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
    <div style={{ 
      width: '100%', 
      padding: '30px', 
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '2.2rem', 
          color: '#2c3e50', 
          marginBottom: '10px',
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          ➕ Add New Order
        </h2>
        <p style={{ 
          color: '#5a6c7d', 
          fontSize: '1.1rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Effortlessly add new customer orders to the system
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="customerName" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '1.1rem' }}>
            Customer Name:
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            placeholder="Enter customer name"
            style={{ 
              width: '100%', 
              padding: '15px 20px', 
              borderRadius: '25px', 
              border: '2px solid #e1e5e9',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e1e5e9';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="deliveryAddress" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '1.1rem' }}>
            Delivery Address:
          </label>
          <input
            type="text"
            id="deliveryAddress"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleInputChange}
            required
            placeholder="Enter full delivery address"
            style={{ 
              width: '100%', 
              padding: '15px 20px', 
              borderRadius: '25px', 
              border: '2px solid #e1e5e9',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e1e5e9';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="status" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '1.1rem' }}>
            Order Status:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '15px 20px', 
              borderRadius: '25px', 
              border: '2px solid #e1e5e9',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              outline: 'none',
              backgroundColor: 'white',
              appearance: 'none', // Remove default arrow
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23667eea%22%20d%3D%22M287%2C197.9L159.2%2C63.2c-4.9-5.1-13.1-5.1-18.1%2C0L5.4%2C197.9c-5.1%2C5.1-5.1%2C13.4%2C0%2C18.4l1.2%2C1.2c5.1%2C5.1%2C13.4%2C5.1%2C18.4%2C0L149.9%2C94.2l124.9%2C123.3c5.1%2C5.1%2C13.4%2C5.1%2C18.4%2C0l1.2-1.2C292.1%2C211.3%2C292.1%2C203%2C287%2C197.9z%22%2F%3E%3C%2Fsvg%3E")', // Custom arrow
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 15px center',
              backgroundSize: '12px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e1e5e9';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <option value="Pending">⏳ Pending</option>
            <option value="Processing">⚙️ Processing</option>
            <option value="Shipped">📦 Shipped</option>
            <option value="Delivered">✅ Delivered</option>
            <option value="Cancelled">❌ Cancelled</option>
          </select>
        </div>

        {/* Status Messages */}
        {error && (
          <div style={{ 
            color: '#d63031', 
            backgroundColor: '#ffeaa7', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '25px',
            border: '2px solid #fdcb6e',
            boxShadow: '0 4px 12px rgba(214, 48, 49, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <strong style={{ fontSize: '16px' }}>Error:</strong> {error}
            </div>
          </div>
        )}
        {success && (
          <div style={{ 
            color: '#00b894', 
            backgroundColor: '#d1f2eb', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '25px',
            border: '2px solid #00b894',
            boxShadow: '0 4px 12px rgba(0, 184, 148, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div>
              <strong style={{ fontSize: '16px' }}>Success:</strong> {success}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '15px 30px', 
            backgroundColor: loading ? '#ccc' : '', 
            background: loading 
              ? 'linear-gradient(45deg, #bdc3c7, #95a5a6)' 
              : 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white', 
            border: 'none', 
            borderRadius: '25px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }
          }}
        >
          {loading ? 'Adding Order...' : '➕ Add Order'}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
