"use client";

import React, { useEffect, useRef } from "react";

import PinBlack from "../../../../public/pin_black.png";
import styles from "./map.module.css";

interface MapPin {
    coordinates: [number, number];
    popupHtml: string;
}

interface MapProps {
    center: {
        lng: number;
        lat: number;
    };
    pins: MapPin[];
}

const Map: React.FC<MapProps> = ({ center, pins }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const offset = { lng: 0.0025, lat: 0.0 };
    const adjustedCenter = {
        lng: center.lng + offset.lng,
        lat: center.lat + offset.lat,
    };

    useEffect(() => {
        if (!window.google || !mapContainer.current) return;

        if (!mapRef.current) {
            mapRef.current = new google.maps.Map(mapContainer.current, {
                center: adjustedCenter,
                zoom: 17,
                disableDefaultUI: true,
            });
        } else {
            mapRef.current.setCenter(adjustedCenter);
        }

        // Clear previous markers
        const allOverlays = mapRef.current?.__overlays || [];
        allOverlays.forEach((overlay: google.maps.Marker) => overlay.setMap(null));
        mapRef.current!.__overlays = [];

        pins.forEach((pin) => {
            const marker = new google.maps.Marker({
                position: { lat: pin.coordinates[0], lng: pin.coordinates[1] },
                map: mapRef.current!,
                icon: {
                    url: PinBlack.src,
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32),
                },
            });

            const infowindow = new google.maps.InfoWindow({
                content: pin.popupHtml,
            });

            marker.addListener("click", () => {
                infowindow.open(mapRef.current, marker);
            });

            mapRef.current!.__overlays.push(marker);
        });
    }, [adjustedCenter.lat, adjustedCenter.lng, pins]);

    return (
        <div className={styles.mapWrap}>
            <div ref={mapContainer} className={styles.map} />
        </div>
    );
};

export default Map;
