import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Package, ChevronRight } from 'lucide-react'

type OrderItem = {
  id: string
  quantity: number
  unitPriceEtb: number
  lineTotalEtb: number
  product: {
    name: string
    imageUrl?: string | null
  }
}

type Order = {
  id: string
  orderNumber: string
  totalEtb: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
  items: OrderItem[]
}

function Orders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login', { state: { from: '/orders' } })
      return
    }

    const loadOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/orders/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setOrders(response.data)
      } catch (err) {
        console.error(err)
        setError('Unable to load your orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [navigate])

  const formatStatus = (status: string) => {
    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  if (loading) {
    return (
      <main className="marketplace">
        <section className="section">
          <div className="loading-state">
            Loading your orders...
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="marketplace">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">S</span>
            <span>UniqueMarket</span>
          </Link>

          <Link to="/products" className="cart-link">
            Continue Shopping
          </Link>
        </div>
      </header>

      <section className="section orders-section">
        <div className="section-heading">
          <div>
            <p className="section-label">ACCOUNT</p>
            <h1>My Orders</h1>
            <p>View and track all your marketplace orders.</p>
          </div>
        </div>

        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="empty-state orders-empty">
            <Package size={44} />

            <h2>No orders yet</h2>

            <p>
              Your orders will appear here after you make a purchase.
            </p>

            <Link
              to="/products"
              className="primary-button"
            >
              Browse Products
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <Link
                to={`/orders/${order.id}`}
                className="order-card"
                key={order.id}
              >
                <div className="order-card-top">
                  <div className="order-card-number">
                    <Package size={20} />

                    <div>
                      <strong>{order.orderNumber}</strong>

                      <span>
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={20} />
                </div>

                <div className="order-card-bottom">
                  <div>
                    <span className="order-label">
                      Total
                    </span>

                    <strong>
                      {order.totalEtb.toLocaleString()} ETB
                    </strong>
                  </div>

                  <div>
                    <span className="order-label">
                      Payment
                    </span>

                    <strong>
                      {formatStatus(order.paymentMethod)}
                    </strong>
                  </div>

                  <div>
                    <span className="order-label">
                      Status
                    </span>

                    <span
                      className={`status-badge status-${order.status.toLowerCase()}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders

