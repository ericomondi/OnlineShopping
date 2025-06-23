import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Star,
  ArrowRight,
  Heart,
  User,
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../cart/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { toast } from "react-toastify";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

// Define types for our data
type Category = {
  id: number;
  name: string;
  description: string | null;
};

type Product = {
  id: number;
  name: string;
  price: number;
  original_price: number;
  rating: number;
  stock_quantity: number;
  category_id: number;
  subcategory_id: number | null;
  brand: string;
  description: string;
  discount: number;
  is_new: boolean;
  category: Category;
  subcategory?: {
    id: number;
    name: string;
    description: string | null;
  };
  images: Array<{
    id: number;
    img_url: string;
  }>;
  reviews: Array<{
    id: number;
    rating: number;
    comment: string;
  }>;
};

type Banner = {
  id: number;
  image_url: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
};

const ModernEcommerceHomepage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Database state
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryCarouselIndex, setCategoryCarouselIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [homepageBanners, setHomepageBanners] = useState<Banner[]>([]);

  const { addToCart, getItemQuantity } = useShoppingCart();
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        `${import.meta.env.VITE_API_BASE_URL}/public/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch featured products (one per category, max 6)
  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/public/products?limit=50`
      );

      const products = response.data.items;

      // Group products by category and select one from each
      const productsByCategory = products.reduce(
        (acc: Record<number, Product[]>, product: Product) => {
          if (!acc[product.category_id]) {
            acc[product.category_id] = [];
          }
          acc[product.category_id].push(product);
          return acc;
        },
        {}
      );

      // Select one product from each category (preferably with highest rating)
      const featured = Object.values(productsByCategory)
        .map(
          (categoryProducts: any) =>
            categoryProducts.sort(
              (a: Product, b: Product) => (b.rating || 0) - (a.rating || 0)
            )[0]
        )
        .slice(0, 6); // Max 6 products

      setFeaturedProducts(featured);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  // Fetch top rated products
  const fetchTopRatedProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/public/products?limit=50`
      );

      const products = response.data.items;

      // Sort by rating and take top 5
      const topRated = products
        .sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);

      setTopRatedProducts(topRated);
    } catch (error) {
      console.error("Error fetching top rated products:", error);
    }
  };

  // Fetch homepage banners
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/public/banners?type=homepage`)
      .then((res) => {
        setHomepageBanners(
          res.data.map((b: any) => ({
            ...b,
            image_url: b.image_url.startsWith("http")
              ? b.image_url
              : `${import.meta.env.VITE_API_BASE_URL}${b.image_url}`,
          }))
        );
      });
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchFeaturedProducts(),
        fetchTopRatedProducts(),
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Auto-advance homepage banner carousel
  useEffect(() => {
    if (homepageBanners.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homepageBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [homepageBanners]);

  const handleAddToCart = (product: Product) => {
    const currentQuantityInCart = getItemQuantity(product.id);
    if (currentQuantityInCart >= product.stock_quantity) {
      toast.error(
        `Cannot add more than available stock (${product.stock_quantity}) for ${product.name}`
      );
      return;
    }
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img_url: product.images?.[0] || null,
        stockQuantity: product.stock_quantity,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const handleToggleFavorite = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to use favorites.");
      return;
    }
    const idStr = product.id.toString();
    try {
      if (isFavorite(idStr)) {
        await removeFavorite(idStr);
        toast.info(`${product.name} removed from favorites.`);
      } else {
        await addFavorite(idStr);
        toast.success(`${product.name} added to favorites!`);
      }
    } catch (err) {
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  // Navigate to category page
  const handleCategoryClick = (categoryName: string) => {
    console.log("Test.tsx: Navigating to category:", categoryName);
    // Navigate to the correct route path with category parameter
    navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`, {
      state: { categoryName },
      replace: true,
    });
  };

  // Calculate items per slide based on screen size
  const getItemsPerSlide = () => {
    if (windowWidth < 640) return 2; // mobile: 2 items
    if (windowWidth < 768) return 3; // small tablet: 3 items
    if (windowWidth < 1024) return 4; // tablet: 4 items
    if (windowWidth < 1280) return 5; // small desktop: 5 items
    return 6; // large desktop: 6 items
  };

  const itemsPerSlide = getItemsPerSlide();
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextCategorySlide();
    }
    if (isRightSwipe) {
      prevCategorySlide();
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Reset carousel index when screen size changes to prevent out-of-bounds
      setCategoryCarouselIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Category carousel navigation
  const nextCategorySlide = () => {
    setCategoryCarouselIndex((prev) => {
      const nextIndex = prev + itemsPerSlide;
      return nextIndex >= categories.length ? 0 : nextIndex;
    });
  };

  const prevCategorySlide = () => {
    setCategoryCarouselIndex((prev) => {
      const prevIndex = prev - itemsPerSlide;
      return prevIndex < 0
        ? Math.max(0, categories.length - itemsPerSlide)
        : prevIndex;
    });
  };

  // Get product image URL
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].img_url;
      return imageUrl.startsWith("http")
        ? imageUrl
        : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"; // Default image
  };

  // Calculate discount percentage
  const calculateDiscount = (product: Product) => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      );
    }
    return 0;
  };

  // Get category color based on name
  const getCategoryColor = (categoryName: string) => {
    const colors = [
      "bg-blue-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    const index = categoryName.length % colors.length;
    return colors[index];
  };

  // Get category icon based on name
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      Electronics: "📱",
      Fashion: "👗",
      "Home & Garden": "🏠",
      Sports: "⚽",
      Books: "📚",
      Beauty: "💄",
      Laptops: "💻",
      Smartphones: "📱",
      "PC Components": "🔧",
      Accessories: "🎧",
    };
    return iconMap[categoryName] || "📦";
  };

  // Helper to get top-rated product image for a category
  const getCategoryImage = (categoryId: number) => {
    // Try to find the top-rated product in this category
    const productsInCategory = featuredProducts.filter(
      (p) => p.category_id === categoryId
    );
    if (productsInCategory.length > 0) {
      // Sort by rating descending
      const top = [...productsInCategory].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      )[0];
      if (top && top.images && top.images.length > 0) {
        const url = top.images[0].img_url;
        return url.startsWith("http")
          ? url
          : `${import.meta.env.VITE_API_BASE_URL}${url}`;
      }
    }
    // Fallback image
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {homepageBanners.length > 0 && (
          <>
            <img
              src={homepageBanners[currentSlide].image_url}
              alt={homepageBanners[currentSlide].title || "Banner"}
              className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
              style={{ pointerEvents: "none" }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {homepageBanners[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                {homepageBanners[currentSlide].subtitle}
              </p>
              <button
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold text-base hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
                onClick={() => navigate("/shop")}
              >
                {homepageBanners[currentSlide].button_text || "Shop Now"}
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </div>
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {homepageBanners.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>

          {/* Category Carousel */}
          <div className="relative">
            {/* Mobile Swipe Instruction */}
            <div className="sm:hidden text-center mb-4">
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <span className="mr-2">👆</span>
                {totalSlides > 1
                  ? "Swipe to see more categories"
                  : "All categories shown"}
              </p>
              {totalSlides > 1 && (
                <p className="text-xs text-gray-400 mt-1">
                  {Math.floor(categoryCarouselIndex / itemsPerSlide) + 1} of{" "}
                  {totalSlides}
                </p>
              )}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevCategorySlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={nextCategorySlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden sm:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Categories Grid */}
            <div
              className={`grid gap-4 sm:gap-6 overflow-hidden items-stretch transition-all duration-300 ease-in-out ${
                categories.length <= itemsPerSlide
                  ? `grid-cols-${categories.length}`
                  : windowWidth < 640
                  ? "grid-cols-2"
                  : windowWidth < 768
                  ? "grid-cols-3"
                  : windowWidth < 1024
                  ? "grid-cols-4"
                  : windowWidth < 1280
                  ? "grid-cols-5"
                  : "grid-cols-6"
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {categories
                .slice(
                  categoryCarouselIndex,
                  categoryCarouselIndex + itemsPerSlide
                )
                .map((category, index) => (
                  <div
                    key={`${category.id}-${categoryCarouselIndex}`}
                    className="group cursor-pointer flex flex-col items-center justify-center animate-fadeIn"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-md bg-white flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={getCategoryImage(category.id)}
                        alt={category.name}
                        className="w-full h-full object-cover object-center"
                        style={{ background: "#eee" }}
                      />
                    </div>
                    <h3 className="text-gray-800 font-semibold text-sm sm:text-base mt-1 text-center">
                      {category.name}
                    </h3>
                  </div>
                ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === Math.floor(categoryCarouselIndex / itemsPerSlide)
                      ? "bg-purple-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() =>
                    setCategoryCarouselIndex(index * itemsPerSlide)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading
                  ? // Loading skeleton
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                      >
                        <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))
                  : featuredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
                      >
                        <div className="relative">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {product.is_new
                                ? "New"
                                : calculateDiscount(product) > 0
                                ? `${calculateDiscount(product)}% OFF`
                                : "Featured"}
                            </span>
                          </div>
                          <button
                            onClick={() => handleToggleFavorite(product)}
                            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isFavorite(product.id.toString())
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 font-medium">
                              {product.category?.name}
                            </span>
                            {product.subcategory && (
                              <span className="text-xs text-gray-400">
                                {product.subcategory.name}
                              </span>
                            )}
                          </div>

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              ({(product.rating || 0).toFixed(1)}) •{" "}
                              {product.reviews?.length || 0} reviews
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-purple-600">
                                {formatCurrency(product.price)}
                              </span>
                              {product.original_price &&
                                product.original_price > product.price && (
                                  <span className="text-gray-500 line-through">
                                    {formatCurrency(product.original_price)}
                                  </span>
                                )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Top Rated Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg mr-3">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <h3 className="text-xl font-bold">Top Rated</h3>
                </div>

                <div className="space-y-4">
                  {isLoading
                    ? // Loading skeleton for top rated
                      Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-xl animate-pulse"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))
                    : topRatedProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <div className="relative">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {product.name}
                            </h4>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(product.rating || 0)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 ml-1">
                                {(product.rating || 0).toFixed(1)} (
                                {product.reviews?.length || 0})
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-lg font-bold text-purple-600">
                                {formatCurrency(product.price)}
                              </span>
                              {product.original_price &&
                                product.original_price > product.price && (
                                  <span className="text-xs text-gray-500 line-through ml-2">
                                    {formatCurrency(product.original_price)}
                                  </span>
                                )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                  View All Top Rated
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: `On orders over ${formatCurrency(100)}`,
              },
              {
                icon: Shield,
                title: "Secure Payment",
                desc: "100% secure transactions",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                desc: "Expert customer service",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "30-day return policy",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-purple-100 mb-8">
            Get the latest deals and product updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LUXE
              </h3>
              <p className="text-gray-400 mb-4">
                Your premier destination for premium products and exceptional
                shopping experience.
              </p>
            </div>

            {[
              {
                title: "Quick Links",
                links: ["Home", "Shop", "About", "Contact", "FAQ"],
              },
              {
                title: "Categories",
                links: ["Electronics", "Fashion", "Home", "Sports", "Beauty"],
              },
              {
                title: "Customer Service",
                links: [
                  "Shipping Info",
                  "Returns",
                  "Size Guide",
                  "Support",
                  "Track Order",
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LUXE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernEcommerceHomepage;
