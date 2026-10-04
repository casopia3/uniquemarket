import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'
import SellerDashboard from './pages/SellerDashboard'
import CreateStore from './pages/CreateStore'
import SellerProducts from './pages/SellerProducts'
import SellerRegister from './pages/SellerRegister'
import AddProduct from './pages/AddProduct'
import SellerOrders from './pages/SellerOrders'
import AdminDashboard from './pages/AdminDashboard'
import AdminSellers from './pages/AdminSellers'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/seller/store/create" element={<CreateStore />} />
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller/orders" element={<SellerOrders />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
  path="/admin/sellers"
  element={<AdminSellers />}
/>
      <Route
  path="/seller/products/new"
  element={<AddProduct />}
/>
      <Route
  path="/seller/products"
  element={<SellerProducts />}
/>
      <Route
  path="/order-success/:orderNumber"
  element={<OrderSuccess />}
/>
    </Routes>
  )
}

export default App
