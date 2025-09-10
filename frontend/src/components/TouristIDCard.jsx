import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import { QRCodeCanvas } from "qrcode.react"; // Use named export QRCodeCanvas

const TouristIDCard = ({ user }) => {
  const { t } = useTranslation("profile"); // Use 'profile' namespace

  // Truncate DID for display
  const truncateAddress = (address) => {
    if (!address) return t("noID");
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Download QR code
  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    if (!canvas) {
      alert(t("error"));
      return;
    }
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = `tourist-id-${user?.did || "unknown"}.png`;
    link.href = pngUrl;
    link.click();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800">{t("digitalID")}</h3>
      <p className="text-gray-600 mt-2">{t("id")}: {truncateAddress(user?.did)}</p>
      <div className="flex justify-center mt-4">
        {user?.did ? (
          <QRCodeCanvas
            id="qr-code"
            value={user.did}
            size={128}
            className="border-4 border-white rounded-lg"
          />
        ) : (
          <p className="text-red-600">{t("noID")}</p>
        )}
      </div>
      <button
        onClick={downloadQR}
        className="mt-4 text-blue-600 hover:underline text-sm"
      >
        📥 {t("downloadQR")}
      </button>
    </div>
  );
};

export default TouristIDCard;