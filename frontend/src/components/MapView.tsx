import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Route {
  customerName: string;
  deliveryAddress: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface MapViewProps {
  routes: Route[];
  center?: [number, number];
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ 
  routes, 
  center,
  zoom = 12
}) => {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India
  const defaultZoom = 5; // A wider zoom for India

  const mapCenter = center || (routes.length > 0 ? [routes[0].latitude, routes[0].longitude] : defaultCenter);
  const mapZoom = routes.length > 0 ? 12 : defaultZoom; // Zoom in if routes exist, else use defaultZoom

  // Create route coordinates for the polyline
  const routeCoordinates: [number, number][] = routes.map(route => [
    route.latitude,
    route.longitude
  ]);

  // Custom icons for different statuses
  const getMarkerIcon = (status: string) => {
    const color = status === 'pending' ? '#ff6b6b' : '#51cf66';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
      ">📍</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div style={{ height: '500px', width: '100%', marginTop: '20px' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route markers */}
        {routes.map((route, index) => (
          <Marker
            key={index}
            position={[route.latitude, route.longitude]}
            icon={getMarkerIcon(route.status)}
          >
            <Popup>
              <div>
                <h4>Stop {index + 1}: {route.customerName}</h4>
                <p><strong>Address:</strong> {route.deliveryAddress}</p>
                <p><strong>Status:</strong> 
                  <span style={{ 
                    color: route.status === 'pending' ? '#ff6b6b' : '#51cf66',
                    fontWeight: 'bold',
                    marginLeft: '5px'
                  }}>
                    {route.status}
                  </span>
                </p>
                <p><strong>Coordinates:</strong> {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Route polyline */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#007bff"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
      
      {/* Map legend */}
      <div style={{ 
        marginTop: '10px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#ff6b6b', 
              borderRadius: '50%',
              border: '1px solid white'
            }}></div>
            <span>Pending Orders</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#51cf66', 
              borderRadius: '50%',
              border: '1px solid white'
            }}></div>
            <span>Completed Orders</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ 
              width: '20px', 
              height: '3px', 
              backgroundColor: '#007bff',
              opacity: 0.7
            }}></div>
            <span>Optimized Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
