import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ socket, user }) => {
  const { t } = useTranslation("map"); // Use 'map' namespace
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!user) return;

    const map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    fetch("http://localhost:5000/api/geofences", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((geofences) => {
        geofences.forEach((geo) => {
          const polygon = L.polygon(geo.coordinates, {
            color: geo.restricted ? "red" : "green",
            fillOpacity: 0.2,
          }).addTo(map);
          polygon.bindPopup(geo.restricted ? t("restrictedArea") : t("safeZone"));
        });
      })
      .catch((err) => console.error("Geofence fetch failed:", err));

    let marker;
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup(t("yourLocation")).openPopup();
          }
          map.setView([latitude, longitude], 13);
          socket.emit("locationUpdate", {
            userId: user.did,
            location: { lat: latitude, lng: longitude },
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }

    socket.on("geofenceBreach", (data) => {
      alert(`Warning: ${t("alerts:" + data.message)}`); // Use 'alerts' namespace
    });

    setMapInitialized(true);
    return () => {
      socket.off("geofenceBreach");
      map.remove();
    };
  }, [socket, user, t]);

  return (
    <div id="map" className="h-96 rounded-lg">
      {!mapInitialized && (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
          <p className="text-gray-700 font-medium">{t("loadingMap")}</p>
        </div>
      )}
    </div>
  );
};

export default MapView;