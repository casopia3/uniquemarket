import { API_URL } from '../config'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Users,
  LogOut,
} from 'lucide-react'

import '../App.css'

type DashboardStats = {
  totalCustomers: number
  totalSellers: number
  totalStores: number
  totalProducts: number
  totalOrders: number
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const authUser = localStorage.getItem('authUser')

    if (!token || !authUser) {
      navigate('/login')
      return
    }

    try {
      const user = JSON.parse(authUser)

      if (user.role !== 'ADMIN') {
        navigate('/')
        return
      }
    } catch {
      navigate('/login')
      return
    }

    const loadDashboard = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setStats(response.data)
      } catch (error) {
        console.error(
          'Failed to load admin dashboard:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    navigate('/login')
  }

  if (loading) {
    return (
      <main className="admin-page">
        <aside className="admin-sidebar">
          <Link to="/" className="admin-brand">
            <span className="logo-mark">S</span>
            <span>UniqueMarket</span>
          </Link>
        </aside>

        <section className="admin-main">
          <div className="admin-empty">
            <p>Loading admin dashboard...</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="logo-mark">S</span>
          <span>UniqueMarket</span>
        </Link>

        <nav className="admin-nav">
          <Link
            to="/admin"
            className="admin-nav-item active"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/sellers"
            className="admin-nav-item"
          >
            <Store size={18} />
            <span>Sellers</span>
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-item"
          >
            <Package size={18} />
            <span>Products</span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-item"
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </Link>

          <Link
            to="/admin/users"
            className="admin-nav-item"
          >
            <Users size={18} />
            <span>Users</span>
          </Link>
        </nav>

        <button
          className="admin-logout"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main */}
      <section className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage your UniqueMarket.
            </p>
          </div>
        </header>

        {/* Stats */}
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <Users size={20} />

            <span>Customers</span>

            <strong>
              {stats?.totalCustomers ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <Store size={20} />

            <span>Sellers</span>

            <strong>
              {stats?.totalSellers ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <Store size={20} />

            <span>Stores</span>

            <strong>
              {stats?.totalStores ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <Package size={20} />

            <span>Products</span>

            <strong>
              {stats?.totalProducts ?? 0}
            </strong>
          </div>

          <div className="admin-stat-card">
            <ShoppingBag size={20} />

            <span>Orders</span>

            <strong>
              {stats?.totalOrders ?? 0}
            </strong>
          </div>
        </div>

        {/* Marketplace overview */}
        <div className="admin-content-card">
          <div className="admin-card-heading">
            <div>
              <h2>Marketplace Overview</h2>

              <p>
                Your marketplace is running. From here you
                can manage sellers, products, users, and
                orders.
              </p>
            </div>
          </div>

          <div className="admin-empty">
            <LayoutDashboard size={40} />

            <h3>Marketplace is running</h3>

            <p>
              Use the navigation to manage your marketplace.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}


