import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Store,
  Users,
  CheckCircle,
  Clock,
  LogOut,
  ArrowLeft,
} from 'lucide-react'

import '../App.css'
import { API_URL } from '../config'

type Seller = {
  id: string
  name: string
  email: string
  phone?: string | null
  createdAt: string
  store: {
    id: string
    name: string
    slug: string
    status: string
    createdAt: string
  } | null
}

function AdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSellers = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/sellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Unable to load sellers.')
      }

      const data = await response.json()
      setSellers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load sellers.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSellers()
  }, [])

  const handleApprove = async (storeId: string) => {
    const token = localStorage.getItem('accessToken')

    try {
      const response = await fetch(
        `${API_URL}/admin/stores/${storeId}/approve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Unable to approve store.')
      }

      await loadSellers()
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to approve store.',
      )
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    window.location.href = '/login'
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="logo-mark">S</span>
          <span>UniqueMarket</span>
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-item">
            Dashboard
          </Link>

          <Link
            to="/admin/sellers"
            className="admin-nav-item active"
          >
            Sellers
          </Link>

          <Link to="/admin/products" className="admin-nav-item">
            Products
          </Link>

          <Link to="/admin/orders" className="admin-nav-item">
            Orders
          </Link>

          <Link to="/admin/users" className="admin-nav-item">
            Users
          </Link>
        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <Link to="/admin" className="admin-back">
              <ArrowLeft size={16} />
              Admin Dashboard
            </Link>

            <h1>Sellers</h1>

            <p>
              Manage sellers and their marketplace stores.
            </p>
          </div>
        </header>

        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <Users size={20} />
            <span>Total Sellers</span>
            <strong>{sellers.length}</strong>
          </div>

          <div className="admin-stat-card">
            <CheckCircle size={20} />
            <span>Active Stores</span>
            <strong>
              {
                sellers.filter(
                  (seller) =>
                    seller.store?.status === 'ACTIVE',
                ).length
              }
            </strong>
          </div>

          <div className="admin-stat-card">
            <Clock size={20} />
            <span>Pending Stores</span>
            <strong>
              {
                sellers.filter(
                  (seller) =>
                    seller.store?.status === 'PENDING',
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-content-card">
          <div className="admin-card-heading">
            <div>
              <h2>Marketplace Sellers</h2>
              <p>
                Review seller accounts and store status.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty">
              Loading sellers...
            </div>
          ) : sellers.length === 0 ? (
            <div className="admin-empty">
              <Store size={40} />
              <h3>No sellers yet</h3>
              <p>
                Seller accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-table">
              <div className="admin-table-header">
                <span>Seller</span>
                <span>Store</span>
                <span>Contact</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {sellers.map((seller) => (
                <div
                  className="admin-table-row"
                  key={seller.id}
                >
                  <div>
                    <strong>{seller.name}</strong>
                    <small>{seller.email}</small>
                  </div>

                  <div>
                    <strong>
                      {seller.store?.name || 'No store'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      {seller.phone || 'No phone'}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`status-badge status-${seller.store?.status?.toLowerCase() || 'none'}`}
                    >
                      {seller.store?.status || 'NO STORE'}
                    </span>
                  </div>

                  <div>
                    {seller.store?.status === 'PENDING' && (
                      <button
                        className="primary-button admin-action-button"
                        onClick={() =>
                          handleApprove(seller.store!.id)
                        }
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default AdminSellers
