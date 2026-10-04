import { API_URL } from '../config'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    priceEtb: number
    imageUrl?: string | null
  }
}

type Cart = {
  items: CartItem[]
}

function Checkout() {
  const navigate = useNavigate()

  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [error, setError] = useState('')

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('Addis Ababa')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] =
    useState('CASH_ON_DELIVERY')

  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    const loadCart = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setCart(response.data)

        if (!response.data.items?.length) {
          navigate('/cart')
        }
      } catch (err) {
        console.error(err)
        setError('Unable to load your cart.')
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [navigate, token])

  const subtotal = useMemo(() => {
    if (!cart) return 0

    return cart.items.reduce(
      (total, item) =>
        total + item.product.priceEtb * item.quantity,
      0,
    )
  }, [cart])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!token) {
      navigate('/login')
      return
    }

    setError('')
    setPlacingOrder(true)

    try {
      const response = await axios.post(
        `${API_URL}/orders`,
        {
          customerName,
          customerPhone,
          deliveryCity,
          deliveryAddress,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      navigate(`/order-success/${response.data.orderNumber}`)
    } catch (err: any) {
      console.error(err)

      const message = err?.response?.data?.message

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Unable to place your order.',
      )
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) {
    return (
      <main className="marketplace">
        <section className="section">
          <div className="loading-state">
            Loading checkout...
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="marketplace checkout-page">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">S</span>
            <span>UniqueMarket</span>
          </Link>

          <Link to="/cart" className="cart-link">
            ← Back to Cart
          </Link>
        </div>
      </header>

      <section className="section checkout-section">
        <div className="checkout-heading">
          <div>
            <p className="section-label">CHECKOUT</p>
            <h1>Complete your order</h1>
            <p>
              Enter your details and choose how you want to pay.
            </p>
          </div>

          <div className="checkout-step">
            <span>1</span>
            <span>Details</span>
            <span>→</span>
            <span>2</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            {/* Customer */}
            <div className="checkout-card compact-card">
              <div className="checkout-card-header">
                <div>
                  <span className="checkout-number">01</span>
                  <div>
                    <h2>Customer details</h2>
                    <p>Who should receive the order?</p>
                  </div>
                </div>
              </div>

              <div className="checkout-fields two-columns">
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(e.target.value)
                    }
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label>
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) =>
                      setCustomerPhone(e.target.value)
                    }
                    placeholder="0911000000"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Delivery */}
            <div className="checkout-card compact-card">
              <div className="checkout-card-header">
                <div>
                  <span className="checkout-number">02</span>
                  <div>
                    <h2>Delivery details</h2>
                    <p>Where should we deliver your order?</p>
                  </div>
                </div>
              </div>

              <div className="checkout-fields">
                <label>
                  <span>City</span>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) =>
                      setDeliveryCity(e.target.value)
                    }
                    placeholder="Addis Ababa"
                    required
                  />
                </label>

                <label>
                  <span>Delivery address</span>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) =>
                      setDeliveryAddress(e.target.value)
                    }
                    placeholder="Bole, street name, building..."
                    rows={3}
                    required
                  />
                </label>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-card compact-card">
              <div className="checkout-card-header">
                <div>
                  <span className="checkout-number">03</span>
                  <div>
                    <h2>Payment</h2>
                    <p>Select your preferred payment method.</p>
                  </div>
                </div>
              </div>

              <div className="payment-grid">
                <label className="payment-option payment-selected">
                  <input
                    type="radio"
                    value="CASH_ON_DELIVERY"
                    checked={
                      paymentMethod === 'CASH_ON_DELIVERY'
                    }
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <span className="payment-radio"></span>

                  <span className="payment-content">
                    <strong>Cash on Delivery</strong>
                    <small>
                      Pay when your order arrives.
                    </small>
                  </span>

                  <span className="payment-check">✓</span>
                </label>

                <label className="payment-option payment-disabled">
                  <input type="radio" disabled />

                  <span className="payment-radio"></span>

                  <span className="payment-content">
                    <strong>Online Payment</strong>
                    <small>Coming soon</small>
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="cart-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button checkout-submit"
              disabled={placingOrder}
            >
              {placingOrder
                ? 'Placing Order...'
                : 'Place Order'}
            </button>
          </form>

          {/* Summary */}
          <aside className="checkout-summary">
            <div className="checkout-card summary-card">
              <div className="summary-header">
                <div>
                  <p className="section-label">YOUR ORDER</p>
                  <h2>Order summary</h2>
                </div>

                <span className="summary-count">
                  {cart?.items.length || 0}{' '}
                  {cart?.items.length === 1
                    ? 'item'
                    : 'items'}
                </span>
              </div>

              <div className="checkout-items">
                {cart?.items.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >
                    <div className="checkout-item-image">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      ) : (
                        <span>S</span>
                      )}
                    </div>

                    <div className="checkout-item-info">
                      <strong>
                        {item.product.name}
                      </strong>

                      <span>
                        {item.quantity} ×{' '}
                        {item.product.priceEtb.toLocaleString()}{' '}
                        ETB
                      </span>
                    </div>

                    <strong className="checkout-item-price">
                      {(
                        item.product.priceEtb *
                        item.quantity
                      ).toLocaleString()}{' '}
                      ETB
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-line">
                <span>Subtotal</span>
                <strong>
                  {subtotal.toLocaleString()} ETB
                </strong>
              </div>

              <div className="checkout-summary-line muted">
                <span>Delivery</span>
                <span>Calculated after order</span>
              </div>

              <div className="checkout-total">
                <div>
                  <span>Total</span>
                  <small>Including available items</small>
                </div>

                <strong>
                  {subtotal.toLocaleString()} ETB
                </strong>
              </div>

              <div className="summary-note">
                <span>✓</span>
                <p>
                  Your order will be sent to the seller
                  immediately after confirmation.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Checkout


