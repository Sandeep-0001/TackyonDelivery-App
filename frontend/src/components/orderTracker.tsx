//notification 
import React, { useEffect, useState } from 'react';
import { fetchOrders, deleteOrder, updateOrder } from '../services/api';

interface Order {
  _id: string;
  customerName: string;
  deliveryAddress: string;
  latitude?: number; // Add latitude
  longitude?: number; // Add longitude
  status: string; // Change orderStatus to status for consistency
}

interface OrderTrackerProps {
  orders: Order[];
  onOrderDeleted: (id: string) => void;
  onOrderUpdated: (updatedOrder: Order) => void;
  showNotification?: (message: string, type: 'success' | 'error' | 'info') => void; // Make showNotification optional
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ orders, onOrderDeleted, onOrderUpdated, showNotification }) => {
  const [error, setError] = useState<string | null>(null);

  // Remove useEffect for fetching orders, as orders will be passed as a prop
  // useEffect(() => {
  //   const getOrders = async () => {
  //     try {
  //       const { data } = await fetchOrders();
  //       setOrders(data);
  //     } catch (error) {
  //       console.error('Error fetching orders', error);
  //       setError('Failed to fetch orders. Please try again later.');
  //     }
  //   };
  //   getOrders();
  // }, []);

  const handleDelete = async (id: string) => {
    try {
      await onOrderDeleted(id); // Call the prop function to delete
      if (showNotification) {
        showNotification('Order deleted successfully!', 'success'); // Trigger success notification
      }
      // setOrders(orders.filter(order => order._id !== id)); // This is now handled by HomePage
    } catch (error) {
      console.error('Error deleting order', error);
      setError('Failed to delete order. Please try again later.');
      if (showNotification) {
        showNotification('Failed to delete order.', 'error'); // Trigger error notification
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrderData = { status: newStatus };
      const { data } = await updateOrder(orderId, updatedOrderData);
      onOrderUpdated(data); // Notify HomePage about the updated order
      if (showNotification) {
        showNotification(`Order for ${data.customerName} status updated to ${newStatus}!`, 'info'); // Trigger info notification
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
      if (showNotification) {
        showNotification('Failed to update order status.', 'error'); // Trigger error notification
      }
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
          📦 Order Tracker
        </h2>
        <p style={{ 
          color: '#5a6c7d', 
          fontSize: '1.1rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Monitor and manage all customer orders in real-time
        </p>
      </div>

      {/* Error Message */}
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

      {/* Orders List */}
      {orders.length === 0 && !error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '15px',
          border: '2px dashed #bdc3c7'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚚</div>
          <p style={{ 
            color: '#5a6c7d', 
            fontSize: '1.2rem',
            fontWeight: '500',
            margin: '0'
          }}>
            No orders found. Add new orders or ensure the backend server is running.
          </p>
        </div>
      ) : (
        <div style={{
          border: 'none',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          maxHeight: '500px', // Set a max height for scrolling
          overflowY: 'auto' // Enable vertical scrolling
        }}>
          {orders.map((order, index) => (
            <div 
              key={order._id} 
              style={{
                padding: '20px',
                borderBottom: index < orders.length - 1 ? '1px solid #f1f2f6' : 'none',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <strong style={{ fontSize: '16px', color: '#2c3e50' }}>
                      {order.customerName}
                    </strong>
                  </div>
                </div>
                {/* Replaced span with select for status change */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: order.status === 'pending' ? '#ffeaa7' :
                                   order.status === 'completed' ? '#d1f2eb' :
                                   order.status === 'in_progress' ? '#e3f2fd' : '#f8f9fa',
                    color: order.status === 'pending' ? '#d63031' :
                           order.status === 'completed' ? '#00b894' :
                           order.status === 'in_progress' ? '#1976d2' : '#6c757d',
                    border: `1px solid ${order.status === 'pending' ? '#fdcb6e' :
                                        order.status === 'completed' ? '#00b894' :
                                        order.status === 'in_progress' ? '#1976d2' : '#dee2e6'}`,
                    appearance: 'none', // Hide default arrow
                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23667eea%22%20d%3D%22M287%2C197.9L159.2%2C63.2c-4.9-5.1-13.1-5.1-18.1%2C0L5.4%2C197.9c-5.1%2C5.1-5.1%2C13.4%2C0%2C18.4l1.2%2C1.2c5.1%2C5.1%2C13.4%2C5.1%2C18.4%2C0L149.9%2C94.2l124.9%2C123.3c5.1%2C5.1%2C13.4%2C5.1%2C18.4%2C0l1.2-1.2C292.1%2C211.3%2C292.1%2C203%2C287%2C197.9z%22%2F%3E%3C%2Fsvg%3E")', // Custom arrow
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">🚚 In Progress</option>
                  <option value="shipped">📦 Shipped</option>
                  <option value="delivered">✅ Delivered</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
              <div style={{ 
                color: '#5a6c7d', 
                marginLeft: '45px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📍</span>
                <span>{order.deliveryAddress}</span>
              </div>
              {order.latitude && order.longitude && (
                <div style={{ 
                  color: '#95a5a6', 
                  fontSize: '12px', 
                  marginLeft: '45px',
                  marginTop: '5px',
                  fontFamily: 'monospace'
                }}>
                  📊 Coordinates: {order.latitude.toFixed(4)}, {order.longitude.toFixed(4)}
                </div>
              )}
              <button 
                onClick={() => handleDelete(order._id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  marginTop: '10px',
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c82333';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
