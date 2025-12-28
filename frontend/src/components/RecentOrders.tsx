import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrder, deleteOrder } from '../services/api';

interface Order {
  _id: string;
  customerName: string;
  deliveryAddress: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

interface RecentOrdersProps {
  orders?: Order[];
  onOrderUpdated?: (updatedOrder: Order) => void;
  onOrderDeleted?: (id: string) => void;
  onOrderUpdateError?: (error: string) => void;
  onOrderDeleteError?: (error: string) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ 
  orders: propOrders, 
  onOrderUpdated, 
  onOrderDeleted,
  onOrderUpdateError,
  onOrderDeleteError
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (propOrders) {
      // Use orders from props (Dashboard)
      setOrders(propOrders.slice(0, 5));
      setLoading(false);
    } else {
      // Fetch orders independently (standalone mode)
      const getRecentOrders = async () => {
        try {
          const { data } = await fetchOrders();
          setOrders(data.slice(0, 5)); 
          setError(null);
        } catch (err) {
          console.error('Error fetching recent orders:', err);
          setError('Failed to load recent orders.');
        } finally {
          setLoading(false);
        }
      };
      getRecentOrders();
    }
  }, [propOrders]);

  const statusBadgeClass = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'badge badge-warning';
    if (s === 'in_progress' || s === 'processing') return 'badge badge-info';
    if (s === 'delivered' || s === 'completed') return 'badge badge-success';
    if (s === 'cancelled') return 'badge badge-danger';
    if (s === 'shipped') return 'badge border-indigo-200 bg-indigo-50 text-indigo-700';
    return 'badge border-slate-200 bg-slate-50 text-slate-700';
  };

  const statusLabel = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'in_progress') return 'In progress';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrderData = { status: newStatus };
      const { data } = await updateOrder(orderId, updatedOrderData);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => (order._id === orderId ? data : order))
      );
      
      // Notify parent component
      if (onOrderUpdated) {
        onOrderUpdated(data);
      }
      
      // Notification will be handled by parent component
    } catch (error) {
      console.error('Error updating order status:', error);
      if (onOrderUpdateError) {
        onOrderUpdateError('Failed to update order status');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      
      // Update local state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
      
      // Notify parent component
      if (onOrderDeleted) {
        onOrderDeleted(id);
      }
      
      // Notification will be handled by parent component
    } catch (error) {
      console.error('Error deleting order:', error);
      if (onOrderDeleteError) {
        onOrderDeleteError('Failed to delete order');
      }
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
            <p className="mt-1 text-sm text-slate-600">Quick view of the latest customer orders.</p>
          </div>
          <div className="badge border-slate-200 bg-slate-50 text-slate-700">Last 5</div>
        </div>

        {loading && <div className="mt-4 text-sm text-slate-600">Loading recent orders…</div>}

        {error && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="text-sm font-semibold text-slate-900">No recent orders</div>
            <div className="mt-1 text-sm text-slate-600">Add a new order to get started.</div>
          </div>
        ) : null}

        {!loading && !error && orders.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {orders.map((order, index) => (
                <div key={order._id} className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary-600 text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{order.customerName}</div>
                        <div className="mt-0.5 text-sm text-slate-600 break-words">{order.deliveryAddress}</div>
                        {order.latitude && order.longitude && (
                          <div className="mt-1 text-xs text-slate-500">
                            Coordinates: {order.latitude.toFixed(4)}, {order.longitude.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={statusBadgeClass(order.status)}>{statusLabel(order.status)}</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="select w-44"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In progress</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => handleDelete(order._id)} className="btn btn-danger px-3 py-2">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RecentOrders;
