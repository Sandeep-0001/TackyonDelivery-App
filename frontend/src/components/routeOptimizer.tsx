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
    <div style={{ 
      width: '100%', 
      padding: '30px', 
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '2.2rem', 
          color: '#2c3e50', 
          marginBottom: '10px',
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🚚 Route Optimizer
        </h2>
        <p style={{ 
          color: '#5a6c7d', 
          fontSize: '1.1rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Optimize delivery routes using advanced algorithms to minimize travel time and fuel consumption
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={handleOptimize} 
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            background: loading 
              ? 'linear-gradient(45deg, #bdc3c7, #95a5a6)' 
              : 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)',
            minWidth: '180px'
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
          {loading ? '⏳ Optimizing...' : '🚀 Optimize Routes'}
        </button>
        
        {routes.length > 0 && (
          <button 
            onClick={handleClearRoutes}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              minWidth: '180px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            🗑️ Clear Routes
          </button>
        )}

        {routes.length > 0 && (
          <button 
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: '600',
              background: showMap 
                ? 'linear-gradient(45deg, #6c757d, #5a6268)' 
                : 'linear-gradient(45deg, #17a2b8, #138496)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              minWidth: '180px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
          </button>
        )}
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
      
      {optimizationInfo && (
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
            <strong style={{ fontSize: '16px' }}>Success:</strong> {optimizationInfo.message}
          </div>
        </div>
      )}
      
      {/* Content for Search Order would go here, if it were part of this component */}

      {/* Route Optimizer Content */}
      {routes.length === 0 && !loading && !error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '15px',
          border: '2px dashed #bdc3c7'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚛</div>
          <p style={{ 
            color: '#5a6c7d', 
            fontSize: '1.2rem',
            fontWeight: '500',
            margin: '0'
          }}>
            No routes available. Click "🚀 Optimize Routes" to generate optimized delivery routes.
          </p>
        </div>
      ) : routes.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            marginBottom: '25px',
            justifyContent: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.8rem', 
              color: '#2c3e50', 
              margin: '0',
              fontWeight: '600'
            }}>
              📍 Optimized Delivery Route
            </h3>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {routes.length} stops
            </span>
          </div>
          <div style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
          }}>
            {routes.map((route, index) => (
              <div
                key={index}
                style={{
                  padding: '20px',
                  borderBottom: index < routes.length - 1 ? '1px solid #f1f2f6' : 'none',
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
                        {route.customerName}
                      </strong>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: route.status === 'pending' ? '#ffeaa7' : 
                                   route.status === 'completed' ? '#d1f2eb' :
                                   route.status === 'in_progress' ? '#e3f2fd' : '#f8f9fa',
                    color: route.status === 'pending' ? '#d63031' : 
                           route.status === 'completed' ? '#00b894' :
                           route.status === 'in_progress' ? '#1976d2' : '#6c757d',
                    border: `1px solid ${route.status === 'pending' ? '#fdcb6e' : 
                                        route.status === 'completed' ? '#00b894' :
                                        route.status === 'in_progress' ? '#1976d2' : '#dee2e6'}`
                  }}>
                    {route.status === 'pending' ? '⏳ Pending' : 
                     route.status === 'completed' ? '✅ Completed' :
                     route.status === 'in_progress' ? '🚚 In Progress' :
                     route.status === 'delivered' ? '📦 Delivered' :
                     route.status === 'cancelled' ? '❌ Cancelled' :
                     `📋 ${route.status.charAt(0).toUpperCase() + route.status.slice(1)}`}
                  </span>
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
                  <span>{route.deliveryAddress}</span>
                </div>
                {route.latitude && route.longitude && (
                  <div style={{ 
                    color: '#95a5a6', 
                    fontSize: '12px', 
                    marginLeft: '45px',
                    marginTop: '5px',
                    fontFamily: 'monospace'
                  }}>
                    📊 Coordinates: {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Map View */}
      {showMap && routes.length > 0 && (
        <div style={{ 
          marginTop: '40px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            marginBottom: '20px',
            justifyContent: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.6rem', 
              color: '#2c3e50', 
              margin: '0',
              fontWeight: '600'
            }}>
              🗺️ Interactive Route Map
            </h3>
            <span style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Live View
            </span>
          </div>
          <p style={{ 
            color: '#5a6c7d', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Interactive map showing the optimized delivery route. Click on markers to see order details and navigate through the route.
          </p>
          <MapView routes={routes} />
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;

export {};
