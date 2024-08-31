import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, Table } from 'react-bootstrap';
import { useGeolocated } from 'react-geolocated';

// Function to handle adding or removing locations
const handleLocationClick = (lat, lng, setAllPoints, allPoints) => {
    setAllPoints((prevPoints) => {
        const existingIndex = prevPoints.findIndex(point => point.lat === lat && point.lng === lng);

        if (existingIndex > -1) {
            return prevPoints.filter((_, index) => index !== existingIndex);
        } else {
            return [...prevPoints, { lat, lng }];
        }
    });
};

// Hook to add map click event listener
const MapClickHandler = ({ handleMapClick }) => {
    const map = useMap();

    useEffect(() => {
        map.on('click', handleMapClick);

        return () => {
            map.off('click', handleMapClick);
        };
    }, [map, handleMapClick]);

    return null;
};

const MapWithLocationSelector = () => {
    const [currentLocation, setCurrentLocation] = useState([28.687446456774957, 77.14151483304185]);  //Default location
    const [allPoints, setAllPoints] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    useEffect(() => {
        if (coords) {
            setCurrentLocation([coords.latitude, coords.longitude]);
        }
    }, [coords]);

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;

        if (allPoints.length < 10) {
            handleLocationClick(lat, lng, setAllPoints, allPoints);
        } else {
            setErrorMessage('You can only select up to 10 locations.');
        }
    };

    const handleDoubleClick = (lat, lng) => {
        handleLocationClick(lat, lng, setAllPoints, allPoints);
    };

    useEffect(() => {
        if (allPoints.length < 2) {
            setErrorMessage('You must select at least 2 locations.');
        } else {
            setErrorMessage(null);
        }
    }, [allPoints]);

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="color: red; font-size: 24px;">
            <i class="fas fa-map-marker-alt"></i>
          </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });

    return (
        <div className="map-container">
            <MapContainer
                center={currentLocation}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '500px', width: '1000px', borderRadius: '15px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler handleMapClick={handleMapClick} />
                {currentLocation && (
                    <Marker
                        position={currentLocation}
                        icon={customIcon}
                    >
                        <Popup>Your current location</Popup>
                    </Marker>
                )}
                {allPoints.map((point, index) =>
                    point.lat && point.lng ? (
                        <Marker
                            key={index}
                            icon={customIcon}
                            position={[point.lat, point.lng]}
                            eventHandlers={{
                                dblclick: () => handleDoubleClick(point.lat, point.lng),
                            }}
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

            {errorMessage && (
                <Alert variant="danger" className="mt-3">
                    {errorMessage}
                </Alert>
            )}

            <div className="mt-3">
                <h5>Selected Locations ({allPoints.length})</h5>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPoints.map((point, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{point.lat.toFixed(6)}</td>
                                <td>{point.lng.toFixed(6)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MapWithLocationSelector;
