import React, { useState } from 'react';
import { optimizeRoutes } from '../services/api';
import MapView from './MapView';

interface Route {
  customerName: string;
  deliveryAddress: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface RouteOptimizerProps {
  showNotification?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ showNotification }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationInfo, setOptimizationInfo] = useState<{totalOrders: number, message: string} | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

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

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setOptimizationInfo(null);
    try {
      const response = await optimizeRoutes();
      console.log('Route optimization response:', response);
      
      if (response.data.success) {
        setRoutes(response.data.data);
        setOptimizationInfo({
          totalOrders: response.data.totalOrders,
          message: response.data.message
        });
        setShowMap(true); // Show map when routes are optimized
        if (showNotification) {
          showNotification('Routes optimized successfully!', 'success'); // Trigger success notification
        }
      } else {
        setError(response.data.message || 'Failed to optimize routes');
        if (showNotification) {
          showNotification(response.data.message || 'Failed to optimize routes', 'error'); // Trigger error notification
        }
      }
    } catch (error) {
      console.error('Error optimizing routes', error);
      setError(error instanceof Error ? error.message : 'Failed to optimize routes. Please try again later.');
      if (showNotification) {
        showNotification('Failed to optimize routes.', 'error'); // Trigger error notification
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearRoutes = () => {
    setRoutes([]);
    setOptimizationInfo(null);
    setError(null);
    setShowMap(false);
    if (showNotification) {
      showNotification('Previous routes cleared.', 'info'); // Trigger info notification
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Route optimizer</h2>
            <p className="mt-1 text-sm text-slate-600">
              Optimize delivery routes to reduce travel time and distance.
            </p>
          </div>
          {optimizationInfo ? (
            <div className="badge badge-success">{optimizationInfo.totalOrders} orders</div>
          ) : (
            <div className="badge border-slate-200 bg-slate-50 text-slate-700">Optimizer</div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button onClick={handleOptimize} disabled={loading} className="btn btn-primary">
            {loading ? 'Optimizing…' : 'Optimize routes'}
          </button>

          {routes.length > 0 ? (
            <button onClick={handleClearRoutes} className="btn btn-danger">
              Clear routes
            </button>
          ) : null}

          {routes.length > 0 ? (
            <button onClick={() => setShowMap(!showMap)} className="btn btn-outline">
              {showMap ? 'Hide map' : 'Show map'}
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold">Error:</span> {error}
          </div>
        ) : null}

        {optimizationInfo ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <span className="font-semibold">Success:</span> {optimizationInfo.message}
          </div>
        ) : null}

        {routes.length === 0 && !loading && !error ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="text-sm font-semibold text-slate-900">No optimized route yet</div>
            <div className="mt-1 text-sm text-slate-600">Click “Optimize routes” to generate a route.</div>
          </div>
        ) : null}

        {routes.length > 0 ? (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">Optimized route</div>
              <span className="badge border-slate-200 bg-slate-50 text-slate-700">{routes.length} stops</span>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-100">
                {routes.map((route, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary-600 text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">{route.customerName}</div>
                          <div className="mt-0.5 break-words text-sm text-slate-600">{route.deliveryAddress}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            Coordinates: {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}
                          </div>
                        </div>
                      </div>

                      <span className={statusBadgeClass(route.status)}>{statusLabel(route.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {showMap && routes.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">Interactive route map</div>
              <span className="badge badge-info">Live view</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Click markers to see stop details.
            </p>
            <div className="mt-3">
              <MapView routes={routes} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RouteOptimizer;
