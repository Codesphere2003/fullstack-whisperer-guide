
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

const AttendanceMap = ({ employees, shops }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

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
          center: [20.5937, 78.9629], // Center of India
          zoom: 5,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstance.current);

        // Add shop markers (assigned locations)
        shops.forEach(shop => {
          const shopIcon = L.divIcon({
            className: 'custom-shop-marker',
            html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">S</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          L.marker([shop.lat, shop.lng], { icon: shopIcon })
            .addTo(mapInstance.current)
            .bindPopup(`<div style="text-align: center; padding: 8px;"><b>${shop.name}</b><br/>Shop Location</div>`);
        });

        // Add employee markers with status-based colors
        employees.forEach(employee => {
          if (employee.checkInLocation) {
            let color, symbol;
            
            switch (employee.status) {
              case 'Present':
                color = '#16a34a'; // Green
                symbol = '✓';
                break;
              case 'Absent':
                color = '#dc2626'; // Red
                symbol = '✗';
                break;
              case 'Out of Range':
                color = '#f59e0b'; // Orange
                symbol = '!';
                break;
              case 'Late':
                color = '#ea580c'; // Orange-red
                symbol = '!';
                break;
              default:
                color = '#9ca3af'; // Gray
                symbol = '?';
            }
            
            const employeeIcon = L.divIcon({
              className: 'custom-employee-marker',
              html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${symbol}</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            L.marker([employee.checkInLocation.lat, employee.checkInLocation.lng], { icon: employeeIcon })
              .addTo(mapInstance.current)
              .bindPopup(`<div style="text-align: center; padding: 8px; min-width: 120px;">
                <b>${employee.name}</b><br/>
                <span style="color: ${color}; font-weight: bold;">${employee.status}</span><br/>
                ${employee.checkInTime ? `Time: ${employee.checkInTime}` : 'No check-in time'}
              </div>`);
          }
        });

        // Force map to invalidate size
        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing attendance map:', error);
      }
    }, 50);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [employees, shops]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Employee Attendance Map - India</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm mt-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full shadow-sm border border-white"></div>
            <span className="text-gray-700">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full shadow-sm border border-white"></div>
            <span className="text-gray-700">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm border border-white"></div>
            <span className="text-gray-700">Out of Range/Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full shadow-sm border border-white"></div>
            <span className="text-gray-700">Shop Location</span>
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

export default AttendanceMap;
