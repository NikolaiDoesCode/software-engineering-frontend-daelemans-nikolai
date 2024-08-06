import Link from "next/link";
import DropdownMenu from "./dropdown";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if sessionStorage is available
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
        const userData = JSON.parse(user);
        setUserEmail(userData.email); // Set user email
        if (userData.role == "OWNER") {
          setIsOwner(true); // Set user email
        }
      }
    }

    // Add event listener to handle clicks outside of the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove user from session storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-gray-800">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl lg:text-4xl text-white font-semibold">
          <Link href="/"> Cars4Rent</Link>
        </h1>
        {isLoggedIn && ( // Check if the user is logged in
          <nav className="hidden md:flex items-center space-x-6 text-white mr-3">
            <Link href="/" className="nav-link hover:underline">
              {t("header.home")}
            </Link>
            {isOwner && (
              <DropdownMenu
                title={t("header.cars")}
                items={[
                  { displayName: `${t("header.cOverview")}`, path: "/car" },
                  { displayName: `${t("header.cAdd")}`, path: "/addCar" },
                ]}
              />
            )}
            <DropdownMenu
              title={t("header.rentals")}
              items={[
                { displayName: `${t("header.rOverview")}`, path: "/rental" },
                { displayName: `${t("header.rSearsh")}`, path: "/search" },
              ]}
            />
            {!isOwner && (
              <Link href="/rents" className="hover:underline">
                {t("header.rents")}
              </Link>
            )}
            <Link href="/notifications" className="hover:underline">
              {t("welcome.notifications")}
            </Link>
            <Link href="/groupchats" className="hover:underline">
              Groupchats
            </Link>
            {sessionStorage.getItem("user") &&
              JSON.parse(sessionStorage.getItem("user")!).isAdmin && (
                <Link href="/users" className="hover:underline">
                  {t("header.users")}
                </Link>
              )}
            {isOwner ? (
              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium hover:bg-gray-700 focus:outline-none"
                  onClick={toggleDropdown}
                >
                  Complaints
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <Link href="/complaints" legacyBehavior>
                        <a
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Complaints
                        </a>
                      </Link>
                      <Link href="/adminNotifications" legacyBehavior>
                        <a
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Admin Notifications
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/complaints" className="hover:underline">
                Complaints
              </Link>
            )}
          </nav>
        )}
        {isLoggedIn && (
          <Link href={"/billing"} className="text-white mr-3 hover:underline">
            {userEmail}
          </Link>
        )}
        {isLoggedIn ? (
          <Link
            href="/login"
            onClick={handleLogout}
            className="p-3 bg-white rounded-xl font-semibold hover:scale-105"
          >
            {t("header.logout")}
          </Link>
        ) : (
          <Link
            href="/login"
            className="p-3 bg-white rounded-xl font-semibold hover:scale-105"
          >
            {t("header.login")}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
