import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../App";
import { Menu, LogOut, User, Globe } from "lucide-react"; // Icons from lucide-react

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { t, i18n } = useTranslation("home"); // Use 'home' namespace
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle

  // Handle logout
  const handleLogout = () => {
    setUser(null); // Clear user from context
    navigate("/"); // Redirect to home
  };

  // Handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Truncate blockchain DID/wallet address for display
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo/Title */}
      <Link to="/" className="flex items-center gap-2">
        <h1 className="font-bold text-lg md:text-xl">{t("welcome")}</h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/"
          className="hover:bg-blue-700 px-3 py-2 rounded-md transition"
        >
          {t("home")}
        </Link>
        <Link
          to="/dashboard"
          className="hover:bg-blue-700 px-3 py-2 rounded-md transition"
        >
          {t("dashboard")}
        </Link>
        {user && user.role === "authority" && (
          <Link
            to="/admin"
            className="hover:bg-blue-700 px-3 py-2 rounded-md transition"
          >
            {t("adminPanel")}
          </Link>
        )}
        <Link
          to="/profile"
          className="hover:bg-blue-700 px-3 py-2 rounded-md transition"
        >
          {t("profile")}
        </Link>

        {/* User Info & Logout */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {truncateAddress(user.did)}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-md transition"
            >
              <LogOut className="w-5 h-5" />
              {t("logout")}
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-md transition"
          >
            <User className="w-5 h-5" />
            {t("login")}
          </Link>
        )}

        {/* Language Toggle */}
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-blue-700 text-white rounded-md px-2 py-1"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-600 text-white flex flex-col items-center gap-4 p-4 md:hidden">
          <Link
            to="/"
            className="hover:bg-blue-700 px-3 py-2 rounded-md w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("home")}
          </Link>
          <Link
            to="/dashboard"
            className="hover:bg-blue-700 px-3 py-2 rounded-md w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("dashboard")}
          </Link>
          {user && user.role === "authority" && (
            <Link
              to="/admin"
              className="hover:bg-blue-700 px-3 py-2 rounded-md w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("adminPanel")}
            </Link>
          )}
          <Link
            to="/profile"
            className="hover:bg-blue-700 px-3 py-2 rounded-md w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("profile")}
          </Link>
          {user ? (
            <>
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {truncateAddress(user.did)}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-md w-full text-center"
              >
                <LogOut className="w-5 h-5" />
                {t("logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-md w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              {t("login")}
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <select
              onChange={(e) => {
                changeLanguage(e.target.value);
                setIsMenuOpen(false);
              }}
              value={i18n.language}
              className="bg-blue-700 text-white rounded-md px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;