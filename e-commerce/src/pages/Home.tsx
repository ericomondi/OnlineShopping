import React, { useState, useEffect, useRef } from "react";
import { useFetchProducts } from "../components/UseFetchProducts";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../cart/formatCurrency";
import { toast } from "react-toastify";

const Home: React.FC = () => {
  // Use the custom hook to fetch products for carousel
  const { isLoading, products, error, fetchProducts } = useFetchProducts();
  const { addToCart } = useShoppingCart();
  const imgEndPoint = "http://127.0.0.1:8000";

  // Ref for carousel container
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = 0.7; // Pixels to scroll per frame

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts(1, 100, ""); // Fetch many more products for carousel
  }, [fetchProducts]);

  // Effect for continuous scroll loop carousel (for products)
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

  // Images for the first section sliding carousel
  const images = [
    {
      src: "https://thumbs.dreamstime.com/b/kyiv-ukraine-february-computer-hardware-store-components-shelf-including-ram-ssd-motherboard-cpu-display-like-cpus-359344790.jpg",
      alt: "Computer hardware components shelf",
    },
    {
      src: "https://muscat.gccgamers.com/best-computer-shop/assets/product-1.webp",
      alt: "Gaming product showcase",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto slide effect with interval, resets on manual navigation
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Set new interval for auto sliding every 4 seconds
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    // Cleanup on unmount or index change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, images.length]);

  return (
    <>
      {/* First Section: Sliding Carousel Showing One Image at a Time with Auto Slide */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-[48px] font-extrabold mb-12 text-gray-900 dark:text-white text-center">
            Featured Collections
          </h2>

          <div className="relative w-full max-w-4xl mx-auto rounded-2xl shadow-md overflow-hidden">
            {/* Images container: flex side-by-side */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              aria-live="polite"
              aria-roledescription="carousel"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-96 rounded-2xl overflow-hidden"
                  aria-hidden={currentIndex !== index}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              aria-label="Previous Slide"
              onClick={() => {
                prevSlide();
              }}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 dark:text-white rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              aria-label="Next Slide"
              onClick={() => {
                nextSlide();
              }}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 dark:text-white rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover our latest collection of amazing products
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-900 dark:text-white">
              Loading products...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400">
              Error loading products: {error}
            </div>
          ) : (
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

export default Home;
