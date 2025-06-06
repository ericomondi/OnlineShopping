import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import CartDropdown from "./CartDropdown";
import { useShoppingCart } from "../context/ShoppingCartContext"; // Import useShoppingCart

const Bar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth(); // Use AuthContext
  const { cartQuantity } = useShoppingCart();

  // Initialize Flowbite
  useEffect(() => {
    // Check if Flowbite is loaded and initialize
    if (window.initFlowbite) {
      window.initFlowbite();
    }
  }, []); // Empty dependency array to run once on mount

  const handleLogout = () => {
    logout(); // Use context logout
    window.location.href = "/login";
  };
  return (
    <>
      <nav className="bg-white dark:bg-gray-800 antialiased sticky top-0 z-20">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="shrink-0">
                <a href="#" title="" className="">
                  <img
                    className="block w-auto h-8 dark:hidden"
                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg"
                    alt=""
                  />
                  <img
                    className="hidden w-auto h-8 dark:block"
                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg"
                    alt=""
                  />
                </a>
              </div>

              <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                <li>
                  <a
                    href="/"
                    title=""
                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Home
                  </a>
                </li>
                <li className="shrink-0">
                  <a
                    href="#"
                    title=""
                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Best Sellers
                  </a>
                </li>
                <li className="shrink-0">
                  <a
                    href="#"
                    title=""
                    className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Gift Ideas
                  </a>
                </li>
                <li className="shrink-0">
                  <a
                    href="/store"
                    title=""
                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Today's Deals
                  </a>
                </li>
                <li className="shrink-0">
                  <a
                    href="/AboutUs"
                    title=""
                    className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  >
                    Sell
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex items-center lg:space-x-2">
              <button
                id="myCartDropdownButton1"
                data-dropdown-toggle="myCartDropdown1"
                type="button"
                className="relative inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
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
                  className="hidden sm:flex w-4 h-4 text-gray-900 dark:text-white ms-1"
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

              <button
                id="userDropdownButton1"
                data-dropdown-toggle="userDropdown1"
                type="button"
                className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
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
                  className="w-4 h-4 text-gray-900 dark:text-white ms-1"
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
                className="hidden z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700"
              >
                <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Account{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/orders-overview"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      My Orders{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Address-book{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/products"
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Products{" "}
                    </a>
                  </li>
                </ul>

                <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                  <a
                    id="logoutButton"
                    data-modal-target="logoutModal"
                    data-modal-toggle="logoutModal"
                    href="#"
                    title=""
                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {" "}
                    Sign Out{" "}
                  </a>
                </div>
              </div>

              <button
                type="button"
                data-collapse-toggle="ecommerce-navbar-menu-1"
                aria-controls="ecommerce-navbar-menu-1"
                aria-expanded="false"
                className="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white"
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

          <div
            id="ecommerce-navbar-menu-1"
            className="bg-gray-50 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4"
          >
            <ul className="text-gray-900 dark:text-white text-sm font-medium dark:text-white space-y-3">
              <li>
                <a
                  href="/"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/store"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Todays Deals
                </a>
              </li>
              <li>
                <a
                  href="/order-management"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Admin Orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Games
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-700 dark:hover:text-primary-500"
                >
                  Home & Garden
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ======== DELETE POP UP =============== */}
      <div
        id="logoutModal"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button
              type="button"
              className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="logoutModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <svg
              className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to Logout?
            </p>
            {isAuthenticated && (
              <div className="flex justify-center items-center space-x-4">
                <Link
                  to="/"
                  data-modal-toggle="logoutModal"
                  type="button"
                  className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, back to home page
                </Link>
                <button
                  onClick={handleLogout}
                  type="submit"
                  className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Yes, Logout
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
