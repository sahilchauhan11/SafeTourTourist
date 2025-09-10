import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";

const SOSButton = ({ socket }) => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation("sos"); // Use 'sos' namespace

  const handleSOS = () => {
    if (!user) {
      alert(t("loginRequired"));
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("sos", {
            userId: user.did,
            location: { lat: latitude, lng: longitude },
            message: "sosReceived", // Key for translation
          });
          alert(t("sosSent"));
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert(t("locationError"));
        }
      );
    } else {
      alert(t("locationError"));
    }
  };

  return (
    <button
      onClick={handleSOS}
      className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-2xl animate-pulse"
    >
      🚨 {t("sos")}
    </button>
  );
};

export default SOSButton;