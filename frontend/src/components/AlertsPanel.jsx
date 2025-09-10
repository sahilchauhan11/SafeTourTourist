import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

const AlertsPanel = ({ socket }) => {
  const { t } = useTranslation("alerts"); // Use 'alerts' namespace
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Alerts fetch failed:", err));

    socket.on("alert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
    });

    return () => socket.off("alert");
  }, [socket]);

  const handleViewOnMap = (alert) => {
    socket.emit("viewAlert", alert);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">{t("realtimeAlerts")}</h3>
      <ul className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-gray-500">{t("noAlerts")}</p>
        ) : (
          alerts.map((alert, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition"
            >
              <AlertTriangle className="text-red-500 w-5 h-5" />
              <div className="flex-1">
                <span className="text-gray-700">{t(alert.message)}</span>
                <button
                  onClick={() => handleViewOnMap(alert)}
                  className="ml-2 text-blue-600 hover:underline text-sm"
                >
                  {t("viewOnMap")}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AlertsPanel;