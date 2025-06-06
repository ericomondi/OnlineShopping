// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Home from "./pages/Home";
import Layout from "./assets/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./assets/PrivateRoutes";
import Products from "./pages/Product";
import Store from "./pages/Store";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderSummary from "./pages/Order-Summary";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetails";
import OrdersOverview from "./pages/OrdersOverview";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import AdminOrderTable from "./components/TestProductTable";
import OrdersManagement from "./pages/OrderManagement";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import CategoryForm from "./components/AddCategory";
import AboutPage from "./pages/AboutUs";
function App() {
  return (
    <AuthProvider>
      <ShoppingCartProvider>
        <Router>
          <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            progressClassName="toast-progress-bar"
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route element={<ProtectedRoute />}> */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/store" element={<Store />} />
              <Route path="/shopping-cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route
                path="/order-details/:orderId"
                element={<OrderDetails />}
              />
              <Route path="/orders-overview" element={<OrdersOverview />} />
              <Route path="/test-products" element={<AdminOrderTable />} />
              <Route path="/orders-management" element={<OrdersManagement />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/category" element={<CategoryForm />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* </Route> */}
          </Routes>
        </Router>
      </ShoppingCartProvider>
    </AuthProvider>
  );
}

export default App;
