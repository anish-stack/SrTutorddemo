import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MyLocations = ({ locations }) => {
    // Default location (center of the map)
    const [currentLocation, setCurrentLocation] = useState([28.687446456774957, 77.14151483304185]);

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
{locations && locations.length > 0 ? (
    // If there are valid locations, map over them and render markers
    locations.map((point, index) => {
        const { location } = point;
        const coordinates = location && location.coordinates;

        // Check if coordinates are valid
        const hasValidCoordinates = coordinates && Array.isArray(coordinates) && coordinates.length === 2;

        return (
            <Marker
                key={index}
                position={hasValidCoordinates ? [coordinates[1], coordinates[0]] : [0, 0]} // Fallback position
                icon={customIcon}
            >
                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                    <span style={{ fontSize: '10px' }}>
                        {hasValidCoordinates ? `Point ${index + 1}` : 'No location found'}
                    </span>
                </Tooltip>
                <Popup>
                    {hasValidCoordinates
                        ? `Point ${index + 1}: ${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`
                        : 'No location found for this point'}
                </Popup>
            </Marker>
        );
    })
) : (
    // If no valid locations are found, display this message
    <div>No locations available</div>
)}

                </MapContainer>
            </div>
        </div>
    );
};

export default MyLocations;
