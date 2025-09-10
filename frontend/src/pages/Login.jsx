import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import Web3 from "web3"; // For blockchain wallet connection
import { Wallet } from "lucide-react"; // Icon for wallet connect

const Login = () => {
  const { user, loginWithBlockchain } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation("login"); // Use 'login' namespace
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Handle wallet connection
  const handleWalletConnect = async () => {
    setError("");
    setLoading(true);

    try {
      // Check if MetaMask or another wallet is available
      if (!window.ethereum) {
        setError(t("noWallet"));
        setLoading(false);
        return;
      }

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];

      // Call loginWithBlockchain (from AuthContext)
      await loginWithBlockchain(walletAddress);
      navigate("/dashboard");
    } catch (err) {
      console.error("Wallet connect failed:", err);
      setError(t("connectError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
        <p className="mt-2 text-gray-500">{t("description")}</p>

        {/* Wallet Connect Button */}
        <button
          onClick={handleWalletConnect}
          disabled={loading}
          className={`mt-6 flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Wallet className="w-5 h-5" />
          {loading ? t("connecting") : t("connectWallet")}
        </button>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}

        {/* Permit Info */}
        <p className="mt-6 text-sm text-gray-500">
          {t("permitInfo")}{" "}
          <a href="/permits" className="text-blue-600 hover:underline">
            {t("learnMore")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;