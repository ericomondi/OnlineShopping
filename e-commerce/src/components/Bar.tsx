import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartDropdown from "./CartDropdown";
import { useShoppingCart } from "../context/ShoppingCartContext";

declare global {
  interface Window {
    initFlowbite?: () => void;
  }
}

// Define the component as a React Functional Component (React.FC) for TypeScript compliance
const Bar: React.FC = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const { cartQuantity } = useShoppingCart();

  // Initialize Flowbite (if available) on component mount
  useEffect(() => {
    if (window.initFlowbite) {
      window.initFlowbite();
    }
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 antialiased sticky top-0 z-20">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="shrink-0">
                <Link to="https://www.instagram.com/flowtechs_ltd" title="">
                  <img
                    className="hidden w-auto h-20 dark:block"
                    src="/logomoto.png"
                    alt="Flowtechs Logo" // Added alt text for accessibility
                  />
                </Link>
              </div>
              {/* Navigation Links */}
              <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                <li>
                  <Link
                    to="/"
                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Home
                  </Link>
                </li>
                <li className="shrink-0">
                  <Link
                    to="/store"
                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Today's Deals
                  </Link>
                </li>
                <li className="shrink-0">
                  <Link
                    to="/about"
                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    About us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex items-center lg:space-x-2">
              {/* Cart Button */}
              <button
                id="myCartDropdownButton1"
                data-dropdown-toggle="myCartDropdown1"
                type="button"
                className="cursor-pointer relative inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-200 text-sm font-medium leading-none text-white"
              >
                <span className="sr-only">Cart</span>
                <svg
                  className="w-5 h-5 lg:me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                  />
                </svg>
                <span className="hidden sm:flex">My Cart</span>
                <svg
                  className="hidden sm:flex w-4 h-4 text-white ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </button>
              <CartDropdown />
              {/* User Authentication Section */}
              {isAuthenticated ? (
                <>
                  <button
                    id="userDropdownButton1"
                    data-dropdown-toggle="userDropdown1"
                    type="button"
                    className="inline-flex items-center rounded-lg justify-center p-2 cursor-pointer text-sm font-medium leading-none text-white"
                  >
                    <svg
                      className="w-5 h-5 me-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    Account
                    <svg
                      className="w-4 h-4 text-white ms-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    id="userDropdown1"
                    className="hidden z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow"
                  >
                    <ul className="p-2 text-start text-sm font-medium text-gray-900">
                      <li>
                        <Link
                          to="/MyProfile"
                          className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          My Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders-overview"
                          className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      </li>
                      {(role === "admin" || role === "SUPERADMIN" ) && (
                        <li>
                          <Link
                            to="/products"
                            className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Products
                          </Link>
                        </li>
                      )}
                      {(role === "admin" || role === "SUPERADMIN") && (
                        <li>
                          <Link
                            to="/Orders-management"
                            className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            All Orders
                          </Link>
                        </li>
                      )}
                      {role === "SUPERADMIN" && (
                        <li>
                          <Link
                            to="/AdminPage"
                            className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                    </ul>
                    <div className="p-2 text-sm font-medium text-gray-900">
                      <Link
                        id="logoutButton"
                        data-modal-target="logoutModal"
                        data-modal-toggle="logoutModal"
                        to="#"
                        className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Sign Out
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-lg justify-center p-2 cursor-pointer text-sm font-medium leading-none text-gray-900"
                >
                  Sign In
                </Link>
              )}
              {/* Mobile Menu Toggle */}
              <button
                type="button"
                data-collapse-toggle="ecommerce-navbar-menu-1"
                aria-controls="ecommerce-navbar-menu-1"
                aria-expanded="false"
                className="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md p-2 text-white"
              >
                <span className="sr-only">Open Menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M5 7h14M5 12h14M5 17h14"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Navigation Menu */}
          <div
            id="ecommerce-navbar-menu-1"
            className="bg-gray-50 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4 dark:bg-gray-800 dark:border-gray-700"
          >
            <ul className="text-gray-900 text-sm font-medium space-y-3 dark:text-gray-200">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  About us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      <div
        id="logoutModal"
        tabIndex={-1} // tabIndex as a number for accessibility
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full backdrop-blur-sm bg-black/30 transition-opacity duration-300"
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto transition-transform duration-300 transform translate-y-0">
          <div className="relative p-8 text-center bg-white rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-xl dark:bg-gray-800 dark:border-gray-700">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 hover:scale-110 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              data-modal-toggle="logoutModal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>

            {/* Logout Icon with Gradient Background */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              {/* Animated Rings (using Tailwind's animate utilities) */}
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-red-200 animate-ping opacity-30"></div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border border-red-300 animate-pulse"></div>
            </div>

            {/* Modal Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to Leave?
            </h3>

            {/* Modal Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Your session will end and you'll need to sign in again to access
              your account.
            </p>

            {/* Action Buttons */}
            {isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Stay Logged In Button */}
                <button
                  type="button"
                  data-modal-toggle="logoutModal"
                  className="group relative px-6 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl font-medium transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                >
                  <span className="relative z-10">Stay Logged In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group relative px-6 py-3 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-medium transition-all duration-200 hover:from-red-600 hover:to-pink-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-200 transform active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                      />
                    </svg>
                    Yes, Logout
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bar;
