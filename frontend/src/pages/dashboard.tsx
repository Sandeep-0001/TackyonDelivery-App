import React, { useState, useEffect } from 'react';
import RecentOrders from '../components/RecentOrders';
import UserStatistics from '../components/UserStatistics';
import Notifications from '../components/notifications';
import { fetchOrders, deleteOrder, updateOrder } from '../services/api';

interface Order {
  _id: string;
  customerName: string;
  deliveryAddress: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [showNotificationHistory, setShowNotificationHistory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info', duration = 5000) => {
    const id = Date.now().toString();
    const timestamp = Date.now();
    const newNotification: Notification = { id, message, type, timestamp };
    
    // Add to current notifications
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

    setTimeout(() => {
      // Remove from current notifications
      setNotifications((prevNotifications) => 
        prevNotifications.filter((notification) => notification.id !== id)
      );
      
      // Add to history when notification expires
      setNotificationHistory((prevHistory) => {
        const updatedHistory = [newNotification, ...prevHistory].slice(0, 50); // Keep last 50 notifications
        localStorage.setItem('notificationHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }, duration);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prevNotifications) => {
      const notificationToDismiss = prevNotifications.find(n => n.id === id);
      if (notificationToDismiss) {
        // Add to history when manually dismissed
        setNotificationHistory((prevHistory) => {
          const updatedHistory = [notificationToDismiss, ...prevHistory].slice(0, 50);
          localStorage.setItem('notificationHistory', JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      }
      return prevNotifications.filter((notification) => notification.id !== id);
    });
  };

  const loadNotificationHistory = () => {
    const savedHistory = localStorage.getItem('notificationHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setNotificationHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading notification history:', error);
      }
    }
  };

  const handleNotificationButtonClick = () => {
    setShowNotificationHistory(!showNotificationHistory);
  };

  const clearNotificationHistory = () => {
    setNotificationHistory([]);
    localStorage.removeItem('notificationHistory');
  };

  const getOrders = async () => {
    try {
      const { data } = await fetchOrders();
      const previousOrderCount = orders.length;
      setOrders(data);
      setError(null);
      
      // Show notification if new orders are detected
      if (data.length > previousOrderCount && previousOrderCount > 0) {
        const newOrderCount = data.length - previousOrderCount;
        showNotification(`${newOrderCount} new order${newOrderCount > 1 ? 's' : ''} detected!`, 'info');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders.');
      showNotification('Failed to load orders from server.', 'error');
    }
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
    );
    showNotification(`Order for ${updatedOrder.customerName} status updated to ${updatedOrder.status}!`, 'info');
  };

  const handleOrderUpdateError = (error: string) => {
    setError('Failed to update order.');
    showNotification('Failed to update order status.', 'error');
  };

  const handleOrderDeleteError = (error: string) => {
    setError('Failed to delete order.');
    showNotification('Failed to delete order.', 'error');
  };

  const handleOrderDeleted = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
      setError(null);
      showNotification('Order deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order.');
      showNotification('Failed to delete order.', 'error');
    }
  };

  useEffect(() => {
    getOrders();
    loadNotificationHistory();
    // Set up polling to check for new orders every 10 seconds
    const interval = setInterval(getOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close notification history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotificationHistory && !target.closest('[data-notification-history]')) {
        setShowNotificationHistory(false);
      }
    };

    if (showNotificationHistory) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationHistory]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={handleNotificationButtonClick}
            style={{
              backgroundColor: 'transparent',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </button>
          
          {/* Notification History Modal */}
          {showNotificationHistory && (
            <div 
              data-notification-history
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: '350px',
                maxWidth: '500px',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 1000,
                marginTop: '8px'
              }}>
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>Notification History</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={clearNotificationHistory}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowNotificationHistory(false)}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notificationHistory.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No notification history available
                  </div>
                ) : (
                  notificationHistory.map((notification) => (
                    <div
                      key={notification.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          color: '#333',
                          marginBottom: '4px'
                        }}>
                          {notification.message}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: notification.type === 'success' ? '#28a745' : 
                                       notification.type === 'error' ? '#dc3545' : '#17a2b8',
                        marginLeft: '8px',
                        marginTop: '4px'
                      }} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <p style={{ textAlign: 'center', color: '#fff', marginBottom: '30px', fontSize: '1.2rem' }}>
        Welcome to your dashboard. Here you can find an overview of your data and recent activity.
      </p>

      <div className="grid">
        <div className="card">
          <RecentOrders 
            orders={orders} 
            onOrderUpdated={handleOrderUpdated} 
            onOrderDeleted={handleOrderDeleted}
            onOrderUpdateError={handleOrderUpdateError}
            onOrderDeleteError={handleOrderDeleteError}
          />
        </div>
        <div className="card">
          <UserStatistics orders={orders} />
        </div>
      </div>
      
      {/* Notification System */}
      <Notifications notifications={notifications} onDismiss={handleDismissNotification} />
    </div>
  );
};

export default Dashboard;
