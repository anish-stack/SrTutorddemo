import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MyLocations = ({ locations }) => {
    // Initialize state for location and points
    const [currentLocation, setCurrentLocation] = useState([28.687446456774957, 77.14151483304185]); // Default location
    const [allPoints, setAllPoints] = useState(locations || []);

    // Define custom icon for markers
    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="color: red; font-size: 24px;">
            <i class="fa fa-map-marker-alt"></i>
          </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });

    // Render the component
    return (
        <div>
            <div className="map-container" style={{ maxWidth: '100%', height: '500px' }}>
                <MapContainer
                    center={currentLocation}
                    zoom={12}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', borderRadius: '15px' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Render current location marker if available */}
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            icon={customIcon}
                        >
                            <Popup>Your current location</Popup>
                        </Marker>
                    )}
                    
                    {/* Render all points markers */}
                    {allPoints.map((point, index) =>
                        point.lat && point.lng ? (
                            <Marker
                                key={index}
                                icon={customIcon}
                                position={[point.lat, point.lng]}
                            >
                                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                                    <span style={{ fontSize: '10px' }}>{`Point ${index + 1}`}</span>
                                </Tooltip>
                                <Popup>
                                    {`Point ${index + 1}: ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`}
                                </Popup>
                            </Marker>
                        ) : null
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default MyLocations;
