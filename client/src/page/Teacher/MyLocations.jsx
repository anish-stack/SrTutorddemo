import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MyLocations = ({ locations }) => {
    const [showOld, setShowOld] = useState(false);
    const [currentLocation, setCurrentLocation] = useState([28.687446456774957, 77.14151483304185]);

    useEffect(() => {
        // Set `showOld` to false if we have areas in `locations`
        if (locations?.Area?.length > 0) {
            setShowOld(false);
        }
    }, [locations]);

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="color: red; font-size: 24px;"><i class="fa fa-map-marker-alt"></i></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });

    return (
        <div>
            {showOld ? (
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

                        {currentLocation && (
                            <Marker position={currentLocation} icon={customIcon}>
                                <Popup>Your current location</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            ) : (
                <div className="mt-4">
                    <h2 className="text-center mb-4">Location Details Where You Teach</h2>
                    <div className="card text-center shadow-lg">
                        <div className="card-body">
                            {locations && (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">State</th>
                                            <th scope="col">City</th>
                                            <th scope="col">Areas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-start">
                                            <td>1</td>
                                            <td className="fw-bold">{locations.State}</td>
                                            <td>{locations.City}</td>
                                            <td>{locations.Area.join(', ')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLocations;
