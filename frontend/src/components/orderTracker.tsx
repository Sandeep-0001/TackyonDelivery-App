import React, { useState } from 'react';
import { deleteOrder, updateOrder } from '../services/api';

interface Order {
  _id: string;
  customerName: string;
  deliveryAddress: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

interface OrderTrackerProps {
  orders: Order[];
  onOrderDeleted: (id: string) => void;
  onOrderUpdated: (updatedOrder: Order) => void;
  showNotification?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  onOrderDeleted,
  onOrderUpdated,
  showNotification,
}) => {
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteOrder(id);
      onOrderDeleted(id);
      showNotification?.('Order deleted successfully.', 'success');
    } catch (err) {
      console.error('Error deleting order', err);
      setError('Failed to delete order. Please try again later.');
      showNotification?.('Failed to delete order.', 'error');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setError(null);
    try {
      const res = await updateOrder(id, { status });
      const updatedOrder: Order = res?.data ?? { ...orders.find((o) => o._id === id)!, status };
      onOrderUpdated(updatedOrder);
      showNotification?.(
        `Order for ${updatedOrder.customerName} status updated to ${updatedOrder.status}!`,
        'info'
      );
    } catch (err) {
      console.error('Error updating order status', err);
      setError('Failed to update order status. Please try again later.');
      showNotification?.('Failed to update order status.', 'error');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Order tracker</h2>
            <p className="mt-1 text-sm text-slate-600">Monitor and manage customer orders.</p>
          </div>
          <div className="badge border-slate-200 bg-slate-50 text-slate-700">Live</div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold">Error:</span> {error}
          </div>
        ) : null}

        {orders.length === 0 && !error ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="text-sm font-semibold text-slate-900">No orders found</div>
            <div className="mt-1 text-sm text-slate-600">
              Add new orders or ensure the backend server is running.
            </div>
          </div>
        ) : null}

        {orders.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
              {orders.map((order, index) => (
                <div key={order._id} className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary-600 text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{order.customerName}</div>
                        <div className="mt-0.5 break-words text-sm text-slate-600">{order.deliveryAddress}</div>
                        {order.latitude != null && order.longitude != null ? (
                          <div className="mt-1 text-xs text-slate-500">
                            Coordinates: {order.latitude.toFixed(4)}, {order.longitude.toFixed(4)}
                          </div>
                        ) : null}
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

export default OrderTracker;
