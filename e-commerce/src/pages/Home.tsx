import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFetchProducts } from "../components/UseFetchProducts";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../cart/formatCurrency";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Type definitions for better type safety
interface Product {
  id: string | number;
  name: string;
  price: number;
  img_url: string;
}

interface CartItem {
  id: number; // Changed to match the expected type
  name: string;
  price: number;
  img_url: string | null; // Added null to match expected type
}

// Constants
const IMG_ENDPOINT = "http://127.0.0.1:8000";
const SCROLL_SPEED = 0.7;
const PRODUCTS_TO_FETCH = 100;
const STAR_RATING = 4.5;

const Home: React.FC = () => {
  // Use the custom hook to fetch products for carousel
  const { isLoading, products, error, fetchProducts } = useFetchProducts();
  const { addToCart } = useShoppingCart();

  // Animation state
  const [isVisible, setIsVisible] = useState({});

  // Ref for carousel container
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | undefined>(undefined); // Fixed: provide initial value
  const isHoveredRef = useRef<boolean>(false);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts(1, PRODUCTS_TO_FETCH, "");
  }, [fetchProducts]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Memoized scroll step function to prevent recreation on every render
  const scrollStep = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || isHoveredRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(scrollStep);
      return;
    }

    carousel.scrollLeft += SCROLL_SPEED;

    // Reset scroll position for seamless loop
    if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
      carousel.scrollLeft = 0;
    }

    animationFrameIdRef.current = requestAnimationFrame(scrollStep);
  }, []);

  // Effect for continuous scroll loop carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || products.length === 0) return;

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(scrollStep);

    // Mouse event handlers
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [products, scrollStep]);

  // Memoized function for adding to cart with toast notification
  const addToCartWithToast = useCallback((product: Product) => {
    const cartItem: CartItem = {
      id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id, // Convert string to number if needed
      name: product.name,
      price: product.price,
      img_url: `${IMG_ENDPOINT}${product.img_url}`,
    };
    
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, [addToCart]);

  // Memoized star rating component
  const StarRating = React.memo(() => (
    <div className="flex items-center mb-2" aria-label={`Rating: ${STAR_RATING} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-yellow-400 hover:scale-110 transition-transform duration-200"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        ({STAR_RATING})
      </span>
    </div>
  ));

  // Memoized product card component with enhanced animations
  const ProductCard = React.memo(({ product, index }: { product: Product; index: number }) => (
    <div
      className="inline-block w-80 mx-4 align-top bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={`${IMG_ENDPOINT}${product.img_url}`}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg'; // Fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 
          className="text-lg font-semibold text-gray-900 dark:text-white mb-3 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
          title={product.name}
        >
          {product.name}
        </h3>
        <StarRating />
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={() => addToCartWithToast(product)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:from-blue-700 focus:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
  ));

  // Error boundary for product images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  return (
    <>
      {/* Hero Section with Enhanced Styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative gap-16 items-center py-20 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-24 lg:px-6">
          <div 
            id="hero-text"
            data-animate
            className={`font-light text-gray-500 sm:text-lg dark:text-gray-400 transform transition-all duration-1000 ${
              isVisible["hero-text"]
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <h1 className="mb-6 text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900 dark:text-white leading-tight">
              Amaizing Deals
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Perfect 4 You
              </span>
            </h1>
            <p className="mb-6 text-xl leading-relaxed">
              Explore our extensive selection of high-quality products tailored
              to meet all your needs. Enjoy seamless shopping, secure payment,
              and fast delivery right to your doorstep.
            </p>
            <p className="mb-8 text-lg">
              Our commitment is to provide you with exceptional customer
              service, great prices, and a shopping experience you can trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/store">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Shop Now
              </button>
              </Link>
              {/* <link to="/AboutUs"> */}
              <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                Learn More
              </button>
              {/* </link> */}
            </div>
          </div>
          <div 
            id="hero-images"
            data-animate
            className={`grid grid-cols-2 gap-4 mt-8 transform transition-all duration-1000 delay-300 ${
              isVisible["hero-images"]
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            }`}
          >
            <div className="relative">
              <img
                className="w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                src="https://thumbs.dreamstime.com/b/kyiv-ukraine-february-computer-hardware-store-components-shelf-including-ram-ssd-motherboard-cpu-display-like-cpus-359344790.jpg"
                alt="Computer hardware store with various components on display"
                loading="lazy"
                onError={handleImageError}
              />
            </div>
            <div className="relative">
              <img
                className="mt-4 w-full lg:mt-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                src="https://muscat.gccgamers.com/best-computer-shop/assets/product-1.webp"
                alt="Gaming computer setup display"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Carousel Section with Enhanced Styling */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="mx-auto max-w-screen-xl px-4">
          <div 
            id="carousel-header"
            data-animate
            className={`text-center mb-12 transform transition-all duration-1000 ${
              isVisible["carousel-header"]
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our latest collection of amazing products, carefully curated for your needs
            </p>
          </div>

          <div 
            id="carousel-content"
            data-animate
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible["carousel-content"]
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {isLoading ? (
              <div className="text-center text-gray-900 dark:text-white py-20" role="status" aria-live="polite">
                <div className="inline-block animate-spin mr-3 h-8 w-8 border-4 border-gray-900 border-r-transparent rounded-full dark:border-white dark:border-r-transparent"></div>
                <span className="text-xl">Loading amazing products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20" role="alert" aria-live="assertive">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-red-600 dark:text-red-400 text-lg mb-4">Error loading products: {error}</p>
                  <button 
                    onClick={() => fetchProducts(1, PRODUCTS_TO_FETCH, "")}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-900 dark:text-white py-20">
                <div className="text-6xl mb-4">🛍️</div>
                <p className="text-xl">No products available at the moment.</p>
              </div>
            ) : (
              <div
                ref={carouselRef}
                className="relative overflow-hidden whitespace-nowrap scrollbar-hide"
                style={{ scrollBehavior: "auto" }}
                role="region"
                aria-label="Featured products carousel"
              >
                {/* Render two sets of products for seamless scrolling */}
                {[...products, ...products].map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;