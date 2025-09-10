import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const { user, loginWithBlockchain } = useContext(AuthContext);
  const { t } = useTranslation("home"); // Use 'home' namespace
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const geofence = L.polygon(
      [
        [20.0, 78.0],
        [21.0, 78.0],
        [21.0, 79.0],
        [20.0, 79.0],
      ],
      { color: "red", fillOpacity: 0.2 }
    ).addTo(map);
    geofence.bindPopup(t("map:restrictedArea")); // Use 'map' namespace

    setMapInitialized(true);
    return () => map.remove();
  }, [t]);

  const handleSOS = () => {
    if (!user) {
      alert(t("sos:loginRequired")); // Use 'sos' namespace
      return;
    }
    socket.emit("sos", {
      userId: user.did,
      location: { lat: 20.5937, lng: 78.9629 },
      message: t("sos:sosSent"),
    });
    alert(t("sos:sosSent"));
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center px-6">
      

      <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 drop-shadow-sm">
        {t("welcome")}
      </h2>
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed">
        {t("description")}
      </p>

      <div id="map" className="w-full max-w-2xl h-64 my-8 rounded-lg shadow-md"></div>

      <div className="mt-8 flex gap-4">
        {!user ? (
          <button
            onClick={() => loginWithBlockchain("0xSampleWalletAddress")}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
          >
            🔒 {t("login")}
          </button>
        ) : (
          <button
            onClick={handleSOS}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
          >
            🚨 {t("sos:sos")}
          </button>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
        >
          🚀 {t("explore")}
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition"
        >
          📄 {t("learnMore")}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {t("trustedBy")} | {t("poweredBy")}{" "}
        <a href="https://x.ai" className="text-blue-600">
          xAI
        </a>
      </p>
    </div>
  );
};

export default Home;