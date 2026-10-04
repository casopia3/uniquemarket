import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
} from 'lucide-react'

type OrderItem = {
  id: string
  quantity: number
  unitPriceEtb: number
  lineTotalEtb: number
  product: {
    id: string
    name: string
    imageUrl?: string | null
  }
}

type SellerOrder = {
  id: string
  subtotalEtb: number
  status: string
  store: {
    id: string
    name: string
  }
  items: OrderItem[]
}

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryCity: string
  deliveryAddress: string
  totalEtb: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
  items: OrderItem[]
  sellerOrders: SellerOrder[]
}

const statusSteps = [
  {
    key: 'PENDING',
    label: 'Order Placed',
    description: 'Your order has been received.',
  },
  {
    key: 'CONFIRMED',
    label: 'Confirmed',
    description: 'The seller has confirmed your order.',
  },
  {
    key: 'PROCESSING',
    label: 'Processing',
    description: 'Your order is being prepared.',
  },
  {
    key: 'SHIPPED',
    label: 'Shipped',
    description: 'Your order is on the way.',
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    description: 'Your order has been delivered.',
  },
]

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login', {
        state: {
          from: `/orders/${id}`,
        },
      })
      return
    }

    const loadOrder = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setOrder(response.data)
      } catch (err) {
        console.error(err)

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Order not found.')
          } else {
            setError(
              err.response?.data?.message ||
                'Unable to load this order.',
            )
          }
        } else {
          setError('Unable to load this order.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id, navigate])

  const formatStatus = (status: string) => {
    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const getStatusIndex = (status: string) => {
    if (status === 'CANCELLED') return -1

    const index = statusSteps.findIndex(
      (step) => step.key === status,
    )

    return index >= 0 ? index : 0
  }

  if (loading) {
    return (
      <main className="marketplace">
        <section className="section">
          <div className="loading-state">
            Loading order...
          </div>
        </section>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="marketplace">
        <section className="section">
          <div className="empty-state order-not-found">
            <XCircle size={48} />

            <h2>{error || 'Order not found'}</h2>

            <Link
              to="/orders"
              className="primary-button"
            >
              Back to My Orders
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const currentStatusIndex = getStatusIndex(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <main className="marketplace">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">S</span>
            <span>UniqueMarket</span>
          </Link>

          <Link to="/orders" className="cart-link">
            My Orders
          </Link>
        </div>
      </header>

      <section className="section order-details-section">
        <Link to="/orders" className="back-link">
          <ArrowLeft size={18} />
          Back to My Orders
        </Link>

        <div className="order-details-heading">
          <div>
            <p className="section-label">ORDER DETAILS</p>

            <h1>{order.orderNumber}</h1>

            <p>
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`status-badge status-${order.status.toLowerCase()}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        {/* Tracking */}
        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <h2>Track your order</h2>
              <p>
                Follow your order from confirmation to delivery.
              </p>
            </div>

            <Truck size={28} />
          </div>

          {isCancelled ? (
            <div className="cancelled-order">
              <XCircle size={28} />

              <div>
                <strong>Order Cancelled</strong>
                <p>
                  This order has been cancelled and will not be
                  delivered.
                </p>
              </div>
            </div>
          ) : (
            <div className="tracking-steps">
              {statusSteps.map((step, index) => {
                const completed =
                  index <= currentStatusIndex

                const active =
                  index === currentStatusIndex

                return (
                  <div
                    className={`tracking-step ${
                      completed ? 'completed' : ''
                    } ${active ? 'active' : ''}`}
                    key={step.key}
                  >
                    <div className="tracking-icon">
                      {completed ? (
                        <CheckCircle size={22} />
                      ) : (
                        <Clock size={22} />
                      )}
                    </div>

                    <div className="tracking-content">
                      <strong>{step.label}</strong>

                      <span>
                        {active
                          ? step.description
                          : completed
                            ? 'Completed'
                            : 'Waiting'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="order-details-grid">
          {/* Products */}
          <div className="order-details-main">
            <div className="details-card">
              <div className="details-card-header">
                <h2>Items</h2>

                <span>
                  {order.items.length}{' '}
                  {order.items.length === 1
                    ? 'item'
                    : 'items'}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    className="order-detail-item"
                    key={item.id}
                  >
                    <div className="order-item-image">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      ) : (
                        <Package size={28} />
                      )}
                    </div>

                    <div className="order-item-info">
                      <strong>
                        {item.product.name}
                      </strong>

                      <span>
                        Quantity: {item.quantity}
                      </span>

                      <span>
                        {item.unitPriceEtb.toLocaleString()} ETB
                        {' '}each
                      </span>
                    </div>

                    <strong>
                      {item.lineTotalEtb.toLocaleString()} ETB
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller orders */}
            {order.sellerOrders?.length > 0 && (
              <div className="details-card">
                <div className="details-card-header">
                  <h2>Seller fulfillment</h2>
                </div>

                <div className="seller-order-list">
                  {order.sellerOrders.map(
                    (sellerOrder) => (
                      <div
                        className="seller-order"
                        key={sellerOrder.id}
                      >
                        <div>
                          <strong>
                            {sellerOrder.store.name}
                          </strong>

                          <span>
                            {sellerOrder.items.length}{' '}
                            {sellerOrder.items.length === 1
                              ? 'item'
                              : 'items'}
                          </span>
                        </div>

                        <div className="seller-order-right">
                          <span
                            className={`status-badge status-${sellerOrder.status.toLowerCase()}`}
                          >
                            {formatStatus(
                              sellerOrder.status,
                            )}
                          </span>

                          <strong>
                            {sellerOrder.subtotalEtb.toLocaleString()}{' '}
                            ETB
                          </strong>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="order-details-sidebar">
            <div className="details-card">
              <h2>Order summary</h2>

              <div className="summary-row">
                <span>Payment</span>
                <strong>
                  {formatStatus(order.paymentMethod)}
                </strong>
              </div>

              <div className="summary-row">
                <span>Payment status</span>
                <span
                  className={`status-badge status-${order.paymentStatus.toLowerCase()}`}
                >
                  {formatStatus(order.paymentStatus)}
                </span>
              </div>

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  {order.totalEtb.toLocaleString()} ETB
                </strong>
              </div>
            </div>

            <div className="details-card">
              <h2>Delivery information</h2>

              <div className="delivery-info">
                <strong>{order.customerName}</strong>

                <span>{order.customerPhone}</span>

                <span>{order.deliveryCity}</span>

                <span>{order.deliveryAddress}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default OrderDetails

