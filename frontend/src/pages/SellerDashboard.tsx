import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Package,
  ShoppingBag,
  Store,
  LogOut,
  ChevronRight,
} from 'lucide-react'

type SellerOrder = {
  id: string
  subtotalEtb: number
  status: string
  order: {
    id: string
    orderNumber: string
    customerName: string
    customerPhone: string
    deliveryCity: string
    deliveryAddress: string
    createdAt: string
  }
  store: {
    id: string
    name: string
  }
  items: {
    id: string
    quantity: number
    unitPriceEtb: number
    lineTotalEtb: number
    product: {
      name: string
    }
  }[]
}

type SellerStore = {
  id: string
  name: string
  slug: string
  description: string | null
  status: string
}

function SellerDashboard() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [store, setStore] = useState<SellerStore | null>(null)

  const [loading, setLoading] = useState(true)
  const [storeLoading, setStoreLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login')
      return
    }

    const loadStore = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/stores/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setStore(response.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status !== 404) {
            console.error('Store check failed:', err)
          }
        } else {
          console.error('Store check failed:', err)
        }
      } finally {
        setStoreLoading(false)
      }
    }

    const loadOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/seller/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setOrders(response.data)
      } catch (err) {
        console.error(err)

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              'Unable to load seller orders.',
          )
        } else {
          setError('Unable to load seller orders.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadStore()
    loadOrders()
  }, [navigate])

  const formatStatus = (status: string) => {
    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    navigate('/login')
  }

  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING',
  ).length

  const activeOrders = orders.filter(
    (order) =>
      !['DELIVERED', 'CANCELLED'].includes(order.status),
  ).length

  const totalSales = orders
    .filter((order) => order.status !== 'CANCELLED')
    .reduce(
      (total, order) => total + order.subtotalEtb,
      0,
    )

  if (loading || storeLoading) {
    return (
      <main className="seller-dashboard">
        <div className="seller-loading">
          Loading seller dashboard...
        </div>
      </main>
    )
  }

  return (
    <main className="seller-dashboard">
      <aside className="seller-sidebar">
        <Link to="/" className="seller-brand">
          <span className="logo-mark">S</span>
          <span>UniqueMarket</span>
        </Link>

        <nav className="seller-nav">
          <Link
            to="/seller"
            className="seller-nav-item active"
          >
            <Store size={19} />
            Dashboard
          </Link>

          <Link
            to="/seller/products"
            className="seller-nav-item"
          >
            <Package size={19} />
            Products
          </Link>

          <Link
            to="/seller/orders"
            className="seller-nav-item"
          >
            <ShoppingBag size={19} />
            Orders
          </Link>
        </nav>

        <button
          className="seller-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <section className="seller-main">
        <header className="seller-topbar">
          <div>
            <p className="section-label">SELLER</p>
            <h1>Dashboard</h1>
          </div>

          <Link
            to="/"
            className="seller-view-store"
          >
            View Marketplace
          </Link>
        </header>

        {/* Store status */}
        {!store && (
          <div className="cart-error">
            <strong>Seller store not found.</strong>

            <p>
              Create your store to start adding products
              and receiving orders.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate('/seller/store/create')
              }
            >
              Create Your Store
            </button>
          </div>
        )}

        {store && (
          <div className="seller-store-card">
            <div>
              <p className="section-label">YOUR STORE</p>
              <h2>{store.name}</h2>

              {store.description && (
                <p>{store.description}</p>
              )}
            </div>

            <span
              className={`status-badge status-${store.status.toLowerCase()}`}
            >
              {formatStatus(store.status)}
            </span>
          </div>
        )}

        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        <div className="seller-stats">
          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <ShoppingBag size={20} />
            </div>

            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <Package size={20} />
            </div>

            <span>Active Orders</span>
            <strong>{activeOrders}</strong>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <Store size={20} />
            </div>

            <span>Pending Orders</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <span>ETB</span>
            </div>

            <span>Total Sales</span>

            <strong>
              {totalSales.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="seller-content-card">
          <div className="seller-card-heading">
            <div>
              <h2>Recent Orders</h2>

              <p>
                Orders from customers buying your products.
              </p>
            </div>

            <Link to="/seller/orders">
              View All
              <ChevronRight size={17} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="seller-empty">
              <ShoppingBag size={42} />

              <h3>No orders yet</h3>

              <p>
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="seller-orders-table">
              <div className="seller-table-header">
                <span>Order</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span></span>
              </div>

              {orders.slice(0, 8).map((order) => (
                <Link
                  to={`/seller/orders/${order.id}`}
                  className="seller-table-row"
                  key={order.id}
                >
                  <strong>
                    {order.order.orderNumber}
                  </strong>

                  <span>
                    {order.order.customerName}
                  </span>

                  <strong>
                    {order.subtotalEtb.toLocaleString()} ETB
                  </strong>

                  <span
                    className={`status-badge status-${order.status.toLowerCase()}`}
                  >
                    {formatStatus(order.status)}
                  </span>

                  <ChevronRight size={18} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default SellerDashboard

