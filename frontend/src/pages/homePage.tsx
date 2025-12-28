import React, { useEffect, useRef, useState } from 'react';
import OrderTracker from '../components/orderTracker';
import RouteOptimizer from '../components/routeOptimizer';
import SearchOrders from '../components/searchOrder';
import AddOrder from '../components/addOrder';
import Notifications from '../components/notifications'; // Import Notifications component
import { fetchOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [showNotificationHistory, setShowNotificationHistory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const previousOrderCountRef = useRef<number>(0);

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
      const previousOrderCount = previousOrderCountRef.current;
      setOrders(data);
      setError(null);

      // Show notification if new orders are detected (same behavior as Dashboard)
      if (data.length > previousOrderCount && previousOrderCount > 0) {
        const newOrderCount = data.length - previousOrderCount;
        showNotification(`${newOrderCount} new order${newOrderCount > 1 ? 's' : ''} detected!`, 'info');
      }

      previousOrderCountRef.current = data.length;
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders.');
      showNotification('Failed to load orders from server.', 'error');
    }
  };

  useEffect(() => {
    getOrders();
    loadNotificationHistory();

    // Set up polling to check for new orders every 10 seconds (same behavior as Dashboard)
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

  const handleOrderAdded = (newOrder: Order) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
    );
  };

  const handleOrderDeleted = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
  };

  return (
    <div className="app-page">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Home</h1>
          <p className="page-lead">Create, track, search, and optimize your delivery workflow.</p>
        </div>

        <div className="flex items-center gap-3">
          {user?.name ? (
            <div className="text-sm text-slate-600">
              <span className="text-slate-500">Signed in as</span>{' '}
              <span className="font-medium text-slate-900">{user.name}</span>
            </div>
          ) : null}

          <div className="relative" data-notification-history>
            <button onClick={handleNotificationButtonClick} className="btn btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
            </button>

            {showNotificationHistory && (
              <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[90vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Notification history</div>
                    {user?.name ? (
                      <div className="mt-0.5 truncate text-xs text-slate-500">Signed in as {user.name}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={clearNotificationHistory} className="btn btn-danger px-3 py-1.5 text-xs">
                      Clear
                    </button>
                    <button onClick={() => setShowNotificationHistory(false)} className="btn btn-outline px-3 py-1.5 text-xs">
                      Close
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationHistory.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-600">No notification history available</div>
                  ) : (
                    notificationHistory.map((notification) => (
                      <div key={notification.id} className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                        <div className="min-w-0">
                          <div className="text-sm text-slate-900 break-words">{notification.message}</div>
                          <div className="mt-0.5 text-xs text-slate-500">{new Date(notification.timestamp).toLocaleString()}</div>
                        </div>
                        <div
                          className={
                            'mt-1 h-2 w-2 shrink-0 rounded-full ' +
                            (notification.type === 'success'
                              ? 'bg-emerald-500'
                              : notification.type === 'error'
                                ? 'bg-rose-500'
                                : 'bg-sky-500')
                          }
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AddOrder onOrderAdded={handleOrderAdded} showNotification={showNotification} />
        <OrderTracker
          orders={orders}
          onOrderDeleted={handleOrderDeleted}
          onOrderUpdated={handleOrderUpdated}
          showNotification={showNotification}
        />
        <div className="lg:col-span-2">
          <SearchOrders showNotification={showNotification} />
        </div>
        <div className="lg:col-span-2">
          <RouteOptimizer showNotification={showNotification} />
        </div>
      </div>

      <Notifications notifications={notifications} onDismiss={handleDismissNotification} />
    </div>
  );
};

export default HomePage;

