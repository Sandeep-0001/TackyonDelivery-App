import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

  const routeCoordinates: [number, number][] = useMemo(
    () =>
      routes
        .filter(
          (route) =>
            Number.isFinite(route.latitude) &&
            Number.isFinite(route.longitude)
        )
        .map((route) => [route.latitude, route.longitude]),
    [routes]
  );

  const [roadRouteCoordinates, setRoadRouteCoordinates] = useState<[number, number][] | null>(null);
  const [roadRouteKey, setRoadRouteKey] = useState<string>('');

  const routeKey = useMemo(() => {
    if (routeCoordinates.length < 2) return '';
    // stable key; rounding avoids needless refetching when coords change insignificantly
    return routeCoordinates
      .map(([lat, lng]) => `${lat.toFixed(5)},${lng.toFixed(5)}`)
      .join(';');
  }, [routeCoordinates]);

  useEffect(() => {
    // Reset when there is no route
    if (routeCoordinates.length < 2) {
      setRoadRouteCoordinates(null);
      setRoadRouteKey('');
      return;
    }

    // Avoid refetch if we already have this route
    if (routeKey && routeKey === roadRouteKey) return;

    const controller = new AbortController();
    const fetchRoadRoute = async () => {
      try {
        // OSRM expects lon,lat; separated by ';'
        const coordinates = routeCoordinates.map(([lat, lng]) => `${lng},${lat}`).join(';');

        const url =
          `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
          `?overview=full&geometries=geojson&steps=false`;

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Routing failed: ${response.status}`);

        const json = await response.json();
        const geometry = json?.routes?.[0]?.geometry;
        const coords = geometry?.coordinates as Array<[number, number]> | undefined; // [lon, lat]
        if (!coords || coords.length < 2) throw new Error('Routing returned no geometry');

        const roadCoords: [number, number][] = coords.map(([lon, lat]) => [lat, lon]);
        setRoadRouteCoordinates(roadCoords);
        setRoadRouteKey(routeKey);
      } catch (error) {
        // Fall back to straight line if routing fails
        if ((error as any)?.name === 'AbortError') return;
        console.warn('Unable to load road route geometry; falling back to straight line.', error);
        setRoadRouteCoordinates(null);
        setRoadRouteKey('');
      }
    };

    fetchRoadRoute();
    return () => controller.abort();
  }, [routeCoordinates, routeKey, roadRouteKey]);

  const polylineCoordinates = roadRouteCoordinates && roadRouteCoordinates.length > 1 ? roadRouteCoordinates : routeCoordinates;

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

  const getRouteStopIcon = (index: number, totalStops: number) => {
    const stopNumber = index + 1;
    const variant =
      index === 0 ? 'route-stop--start' : index === totalStops - 1 ? 'route-stop--end' : 'route-stop--mid';

    return L.divIcon({
      className: 'route-stop-icon',
      html: `<div class="route-stop ${variant}"><span class="route-stop-label">${stopNumber}</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  };

  const FitRouteBounds: React.FC<{ coordinates: [number, number][] }> = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
      if (coordinates.length === 0) return;
      if (coordinates.length === 1) {
        map.setView(coordinates[0], zoom);
        return;
      }

      const bounds = L.latLngBounds(coordinates.map(([lat, lng]) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [28, 28] });
    }, [coordinates, map]);

    return null;
  };

  return (
    <div className="mt-4 w-full">
      <div className="h-[400px] w-full md:h-[500px]">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <FitRouteBounds coordinates={polylineCoordinates} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route markers */}
        {routes.map((route, index) => (
          <Marker
            key={index}
            position={[route.latitude, route.longitude]}
            icon={getRouteStopIcon(index, routes.length)}
          >
            <Popup>
              <div className="min-w-[220px]">
                <div className="text-sm font-semibold text-slate-900">Stop {index + 1}: {route.customerName}</div>
                <div className="mt-1 text-sm text-slate-700 break-words">
                  <span className="font-semibold">Address:</span> {route.deliveryAddress}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">Status:</span>
                  <span className={statusBadgeClass(route.status)}>{statusLabel(route.status)}</span>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  <span className="font-semibold">Coordinates:</span> {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Route polyline */}
        {polylineCoordinates.length > 1 ? (
          <Polyline
            positions={polylineCoordinates}
            pathOptions={{
              className: 'route-line',
              weight: 4,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        ) : null}
      </MapContainer>
      </div>
      
      {/* Map legend */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Legend</div>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white ring-2 ring-white">1</span>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary-600 text-xs font-semibold text-white ring-2 ring-white">2</span>
            <span>Stop</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-semibold text-white ring-2 ring-white">N</span>
            <span>End</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-1 w-5 rounded bg-blue-600" />
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
