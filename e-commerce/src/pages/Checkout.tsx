// Checkout.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useFetchAddresses } from "../components/useFetchAddresses";
import DeliveryDetails from "../components/DeliveryDetails";
import AddDeliveryDetails from "../components/AddDeliveryDetails";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../cart/formatCurrency";
import DeliveryOptions from "../components/deliveryOptions";
import PaymentOptions from "../components/paymentOptions";
import { useFetchProducts } from "../components/UseFetchProducts";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const {
    cartItems,
    deliveryMethod,
    paymentMethod,
    selectedAddress,
    setSelectedAddress,
    deliveryFee,
    subtotal,
    clearCart,
  } = useShoppingCart();

  const { addresses, loading, error } = useFetchAddresses();

  // Extract order data from navigation state (if coming from a previous order creation)
  const {
    orderId: existingOrderId,
    orderCreated,
    subtotal: stateSubtotal,
  } = location.state || {};

  // Use cart subtotal if no state subtotal provided
  const orderSubtotal = stateSubtotal || subtotal;

  // Calculate total
  const total = orderSubtotal + deliveryFee;

  // Set default address as selectedAddress if none is selected
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  // Show success message if order was just created
  useEffect(() => {
    if (orderCreated && existingOrderId) {
      toast.success(
        `Order #${existingOrderId} created successfully! Complete your payment details.`
      );
    }
  }, [orderCreated, existingOrderId]);

  // Check if the form is valid
  const isFormValid =
    deliveryMethod &&
    (deliveryMethod !== "delivery" || selectedAddress) &&
    paymentMethod;

  // Create order function
  const createOrder = async () => {
    if (!token) {
      toast.error("You must be logged in to create an order");
      return null;
    }

    try {
      setIsCreatingOrder(true);

      // Prepare order payload
      const orderPayload = {
        cart: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        delivery_fee: deliveryFee,
        address_id: deliveryMethod === "delivery" ? selectedAddress?.id : null,
      };

      const response = await axios.post(
        "http://localhost:8000/create_order",
        orderPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.order_id) {
        // Clear the cart after successful order creation
        clearCart();
        return response.data.order_id;
      }

      throw new Error("No order ID returned");
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.detail || "Failed to create order");
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Handle Proceed to Payment or Order Confirmation
  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!deliveryMethod) {
        toast.error("Please select a delivery method");
      } else if (deliveryMethod === "delivery" && !selectedAddress) {
        toast.error("Please select a delivery address");
      } else if (!paymentMethod) {
        toast.error("Please select a payment method");
      }
      return;
    }

    // Create order first if we don't have an existing order ID
    let orderId = existingOrderId;
    if (!orderId && cartItems.length > 0) {
      orderId = await createOrder();
      if (!orderId) {
        return; // Order creation failed
      }
    }

    if (!orderId) {
      toast.error("No valid order found");
      return;
    }

    if (paymentMethod === "pay-now") {
      navigate("/payment", {
        state: {
          subtotal: orderSubtotal,
          orderId,
          orderCreated: true,
          deliveryFee,
          total,
        },
      });
    } else {
      // Pay later - go directly to order confirmation
      navigate("/order-confirmation", {
        state: {
          orderId,
          orderDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          name: selectedAddress
            ? `${selectedAddress.first_name} ${selectedAddress.last_name}`
            : "Store Pickup",
          address:
            deliveryMethod === "delivery" && selectedAddress
              ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.region}`
              : "Store Pickup",
          phoneNumber: selectedAddress?.phone_number || "N/A",
          deliveryFee,
          subtotal: orderSubtotal,
          total,
          deliveryMethod,
          paymentMethod,
        },
        replace: true,
      });
    }
  };

  // Use the custom hook to fetch products for carousel
  const { isLoading, products, fetchProducts } = useFetchProducts();
  const { addToCart } = useShoppingCart();
  const imgEndPoint = "http://127.0.0.1:8000";

  // Ref for carousel container
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = 0.7; // Pixels to scroll per frame

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts(1, 100, ""); // Fetch many more products for carousel
  }, [fetchProducts]);

  // Effect for continuous scroll loop carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrameId: number;
    let isHovered = false;

    const scrollStep = () => {
      if (!isHovered) {
        // Increment scrollLeft
        carousel.scrollLeft += scrollSpeed;

        // When scrollLeft passes half the scrollWidth, reset to 0
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    // Handlers to pause scroll on hover
    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };

    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [products]); // Restart effect when products change

  // Helper function for adding to cart with toast notification
  const addToCartWithToast = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img_url: imgEndPoint + product.img_url,
    });
    toast.success(`${product.name} added to cart!`);
  };

  // If no existing order and cart is empty, redirect to cart
  if (!existingOrderId && cartItems.length === 0) {
    return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Checkout
          </h2>
          <div className="text-center mt-6">
            <p className="text-gray-500 dark:text-gray-400">
              No active order found.{" "}
              <a
                href="/shopping-cart"
                className="text-primary-700 underline hover:no-underline dark:text-primary-500"
              >
                Return to cart
              </a>{" "}
              or{" "}
              <a
                href="/store"
                className="text-primary-700 underline hover:no-underline dark:text-primary-500"
              >
                continue shopping
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <form
          action="#"
          className="mx-auto max-w-screen-xl px-4 2xl:px-0"
          onSubmit={handleProceed}
        >
          {/* Order ID Display */}
          {existingOrderId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                <span className="font-medium">Order ID:</span> #
                {existingOrderId}
              </p>
            </div>
          )}

          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            <a
              href="/shopping-cart"
              className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10"
            >
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
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
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Cart
              </span>
            </a>
            <a
              href="/checkout"
              className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10"
            >
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
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
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Checkout
              </span>
            </a>
            <a href="/order-summary" className="flex shrink-0 items-center">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
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
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Order summary
            </a>
          </ol>

          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Customer Address
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:col-span-2">
                  <DeliveryDetails />
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      data-modal-target="addBillingInformationModal"
                      data-modal-toggle="addBillingInformationModal"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 disabled:opacity-50"
                    >
                      <svg
                        className="h-5 w-5"
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
                          d="M5 12h14m-7 7V5"
                        />
                      </svg>
                      Add new address
                    </button>
                  </div>
                </div>
              </div>
              <DeliveryOptions />
              <PaymentOptions />
            </div>

            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(orderSubtotal)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Delivery Fee
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(deliveryFee)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={!isFormValid || isCreatingOrder}
                  className={`bg-blue-600 flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${
                    !isFormValid || isCreatingOrder
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isCreatingOrder
                    ? "Creating Order..."
                    : paymentMethod === "pay-now"
                    ? "Proceed to Payment"
                    : "Complete Order"}
                </button>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  One or more items in your cart require an account.{" "}
                  <a
                    href="#"
                    title=""
                    className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Sign in or create an account now.
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
        <AddDeliveryDetails />
      </section>
        {/* Product Carousel Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-12">
              <div className="mx-auto max-w-screen-xl px-4">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    You may also like
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Discover our latest collection of amazing products
                  </p>
                </div>
      
                {isLoading ? (
                  <div className="text-center text-gray-900 dark:text-white">
                    Loading products...
                  </div>
                )  : (
                  <div
                    ref={carouselRef}
                    className="relative overflow-hidden whitespace-nowrap scrollbar-hide"
                    style={{ scrollBehavior: "auto" }}
                  >
                    {/* Render two sets of products for seamless scrolling */}
                    {[...products, ...products].map((product, index) => (
                      <div
                        key={`${index}-${product.id}`}
                        className="inline-block w-80 mx-4 align-top bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            src={imgEndPoint + product.img_url}
                            alt={product.name}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="h-4 w-4 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              (4.5)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(product.price)}
                            </span>
                            <button
                              onClick={() => addToCartWithToast(product)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L2 1M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                />
                              </svg>
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
    </>
  );
};

export default Checkout;
