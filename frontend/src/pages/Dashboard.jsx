import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import MapView from "../components/MapView";
import SOSButton from "../components/SOSButton";
import AlertsPanel from "../components/AlertsPanel";

const Dashboard = ({ socket }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard"); // Use 'dashboard' namespace

//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//     }
//   }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/user/permits", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.permits.includes("ILP")) {
            alert(t("permitWarning"));
          }
        })
        .catch((err) => console.error("Permit check failed:", err));
    }
  }, [user, t]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("safetyDashboard")}</h2>
        <div className="bg-white shadow-lg rounded-xl p-4 mb-6">
          <MapView socket={socket} user={user} />
        </div>
        <SOSButton socket={socket} />
      </div>
      <div className="w-1/3 bg-gray-100 border-l border-gray-300 p-6 overflow-y-auto">
        <AlertsPanel socket={socket} />
      </div>
    </div>
  );
};

export default Dashboard;