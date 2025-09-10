import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import TouristIDCard from "../components/TouristIDCard";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation("profile"); // Use 'profile' namespace
  const [permits, setPermits] = useState([]);
  const [incident, setIncident] = useState("");

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//     }
//   }, [user, navigate]);

  // Fetch permits
  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/user/permits", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setPermits(data.permits || []))
        .catch((err) => console.error("Permit fetch failed:", err));
    }
  }, [user]);

  // Handle Refresh ID
  const handleRefreshID = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/refresh-id", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setPermits(data.permits || []);
      alert(t("idRefreshed"));
    } catch (err) {
      console.error("Refresh ID failed:", err);
      alert(t("error"));
    }
  };

  // Handle Share ID
  const handleShareID = () => {
    // Generate shareable link or QR code download (handled in TouristIDCard)
    alert(t("idShared"));
  };

  // Handle Incident Report
  const handleIncidentReport = async (e) => {
    e.preventDefault();
    if (!incident) return;
    try {
      await fetch("http://localhost:5000/api/incident", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.did, description: incident }),
      });
      alert(t("incidentReported"));
      setIncident("");
    } catch (err) {
      console.error("Incident report failed:", err);
      alert(t("error"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {/* Profile Avatar */}
        <div className="flex justify-center">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
            alt="Tourist Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
          />
        </div>

        {/* Tourist Info */}
        <h2 className="mt-4 text-2xl font-bold text-gray-800">{t("title")}</h2>
        <p className="text-gray-500">{t("verified")}</p>
        {permits.length > 0 ? (
          <p className="text-green-600 mt-2">{t("permits")}: {permits.join(", ")}</p>
        ) : (
          <p className="text-red-600 mt-2">{t("noPermits")}</p>
        )}

        {/* Digital ID Card */}
        <div className="mt-6">
          <TouristIDCard user={user} />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleRefreshID}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            🔄 {t("refreshID")}
          </button>
          <button
            onClick={handleShareID}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg transition"
          >
            📤 {t("shareID")}
          </button>
        </div>

        {/* Incident Reporting */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">{t("reportIncident")}</h3>
          <form onSubmit={handleIncidentReport} className="mt-4">
            <textarea
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              placeholder={t("incidentPlaceholder")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <button
              type="submit"
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              📢 {t("submitReport")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;