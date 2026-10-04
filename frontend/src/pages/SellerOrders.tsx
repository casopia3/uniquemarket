import { API_URL } from '../config'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

type SellerOrderItem = {
  id: string
  quantity: number
  unitPriceEtb: number
  lineTotalEtb: number
  product: {
    id: string
    name: string
  }
}

type SellerOrder = {
  id: string
  status: OrderStatus
  subtotalEtb: number
  createdAt: string
  order: {
    id: string
    orderNumber: string
    customerName: string
    customerPhone: string
    deliveryCity: string
    deliveryAddress: string
    paymentMethod: string
    paymentStatus: string
    totalEtb: number
    createdAt: string
  }
  items: SellerOrderItem[]
}

const statusOptions: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

export default function SellerOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL')

  const loadOrders = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      setError('Please log in as a seller.')
      setLoading(false)
      return
    }

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
    } catch (err: any) {
      const message = err?.response?.data?.message

      if (Array.isArray(message)) {
        setError(message.join(', '))
      } else {
        setError(message || 'Could not load seller orders.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    if (filter === 'ALL') {
      return orders
    }

    return orders.filter((order) => order.status === filter)
  }, [orders, filter])

  const updateStatus = async (
    sellerOrderId: string,
    status: OrderStatus,
  ) => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      return
    }

    setUpdatingId(sellerOrderId)

    try {
      await axios.patch(
        `${API_URL}/seller/orders/${sellerOrderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setOrders((current) =>
        current.map((order) =>
          order.id === sellerOrderId
            ? { ...order, status }
            : order,
        ),
      )
    } catch (err: any) {
      const message = err?.response?.data?.message

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Could not update order status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const totalSales = orders.reduce(
    (sum, order) => sum + order.subtotalEtb,
    0,
  )

  const pendingCount = orders.filter(
    (order) => order.status === 'PENDING',
  ).length

  const activeCount = orders.filter(
    (order) =>
      order.status === 'CONFIRMED' ||
      order.status === 'PROCESSING' ||
      order.status === 'SHIPPED',
  ).length

  return (
    <div className="seller-page">
      <div className="seller-container">
        <aside className="seller-sidebar">
          <Link to="/" className="seller-brand">
            UniqueMarket
          </Link>

          <nav>
            <Link to="/seller">Dashboard</Link>
            <Link to="/seller/products">Products</Link>
            <Link
              to="/seller/orders"
              className="seller-nav-active"
            >
              Orders
            </Link>
          </nav>

          <button
            className="seller-logout"
            onClick={() => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('authUser')
              window.location.href = '/login'
            }}
          >
            Logout
          </button>
        </aside>

        <main className="seller-main">
          <div className="seller-topbar">
            <div>
              <h1>Orders</h1>
              <p>Manage orders from your customers.</p>
            </div>
          </div>

          <div className="seller-stats-grid">
            <div className="seller-stat-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>

            <div className="seller-stat-card">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>

            <div className="seller-stat-card">
              <span>Active</span>
              <strong>{activeCount}</strong>
            </div>

            <div className="seller-stat-card">
              <span>Sales</span>
              <strong>{totalSales.toLocaleString()} ETB</strong>
            </div>
          </div>

          {error && (
            <div className="seller-form-error">
              {error}
            </div>
          )}

          <div className="seller-orders-toolbar">
            <div className="seller-order-filters">
              <button
                className={filter === 'ALL' ? 'active' : ''}
                onClick={() => setFilter('ALL')}
              >
                All
              </button>

              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={filter === status ? 'active' : ''}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="seller-empty-state">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="seller-empty-state">
              <h3>No orders found</h3>
              <p>
                Orders from customers will appear here.
              </p>
            </div>
          ) : (
            <div className="seller-orders-list">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="seller-order-card"
                >
                  <div className="seller-order-header">
                    <div>
                      <strong>
                        {order.order.orderNumber}
                      </strong>

                      <span>
                        {new Date(
                          order.order.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      className={`seller-order-status status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="seller-order-body">
                    <div>
                      <span>Customer</span>
                      <strong>
                        {order.order.customerName}
                      </strong>
                      <small>
                        {order.order.customerPhone}
                      </small>
                    </div>

                    <div>
                      <span>Delivery</span>
                      <strong>
                        {order.order.deliveryCity}
                      </strong>
                      <small>
                        {order.order.deliveryAddress}
                      </small>
                    </div>

                    <div>
                      <span>Items</span>
                      <strong>
                        {order.items.reduce(
                          (sum, item) =>
                            sum + item.quantity,
                          0,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Order Total</span>
                      <strong>
                        {order.subtotalEtb.toLocaleString()} ETB
                      </strong>
                    </div>
                  </div>

                  <div className="seller-order-products">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <span>
                          {item.product.name}
                        </span>

                        <span>
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="seller-order-footer">
                    <div>
                      Payment:{' '}
                      <strong>
                        {order.order.paymentMethod}
                      </strong>
                    </div>

                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        updateStatus(
                          order.id,
                          event.target.value as OrderStatus,
                        )
                      }
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

