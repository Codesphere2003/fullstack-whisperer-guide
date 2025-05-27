
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IndianMPMap = ({ mpData }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Indian states with approximate coordinates
  const indianStates = [
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Maharashtra", lat: 19.7515, lng: 75.7139 },
    { name: "Karnataka", lat: 15.3173, lng: 75.7139 },
    { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569 },
    { name: "Gujarat", lat: 23.0225, lng: 72.5714 },
    { name: "Rajasthan", lat: 27.0238, lng: 74.2179 },
    { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    { name: "West Bengal", lat: 22.9868, lng: 87.8550 },
    { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569 },
    { name: "Odisha", lat: 20.9517, lng: 85.0985 }
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    setTimeout(() => {
      try {
        // Initialize map centered on India
        mapInstance.current = L.map(mapRef.current, {
          center: [20.5937, 78.9629],
          zoom: 5,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstance.current);

        // Add MP markers for each state
        indianStates.forEach((state, index) => {
          const mp = mpData.find(mp => mp.constituency === state.name) || {
            name: `MP ${index + 1}`,
            constituency: state.name,
            status: index % 3 === 0 ? 'Present' : index % 3 === 1 ? 'Absent' : 'Late'
          };

          let color, symbol, statusText;
          
          switch (mp.status) {
            case 'Present':
              color = '#16a34a'; // Green
              symbol = '✓';
              statusText = 'Present';
              break;
            case 'Absent':
              color = '#dc2626'; // Red
              symbol = '✗';
              statusText = 'Absent';
              break;
            case 'Late':
              color = '#f59e0b'; // Orange
              symbol = '!';
              statusText = 'Late';
              break;
            default:
              color = '#9ca3af'; // Gray
              symbol = '?';
              statusText = 'Unknown';
          }
          
          const mpIcon = L.divIcon({
            className: 'custom-mp-marker',
            html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold; box-shadow: 0 3px 10px rgba(0,0,0,0.4); cursor: pointer;">${symbol}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          L.marker([state.lat, state.lng], { icon: mpIcon })
            .addTo(mapInstance.current)
            .bindPopup(`<div style="text-align: center; padding: 10px; min-width: 150px;">
              <b style="color: ${color};">${mp.name}</b><br/>
              <span style="color: #666;">Constituency: ${mp.constituency}</span><br/>
              <span style="color: ${color}; font-weight: bold;">Status: ${statusText}</span><br/>
              ${mp.checkInTime ? `Time: ${mp.checkInTime}` : 'No check-in time'}
            </div>`);
        });

        // Force map to invalidate size
        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing Indian MP map:', error);
      }
    }, 50);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mpData]);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
        <CardTitle className="text-xl text-gray-900">Indian MP Attendance Map</CardTitle>
        
        <div className="flex flex-wrap gap-4 text-sm mt-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded-full shadow-sm border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded-full shadow-sm border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full shadow-sm border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Late</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-96 rounded-b-lg overflow-hidden bg-gray-100">
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: '384px' }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default IndianMPMap;
