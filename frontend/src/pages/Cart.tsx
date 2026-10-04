import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import '../App.css'


type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    priceEtb: number
    stock: number
    imageUrl?: string | null
    store?: {
      name: string
    }
  }
}

type CartData = {
  id: string
  items: CartItem[]
}

function Cart() {
  const navigate = useNavigate()

  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [error, setError] = useState('')

  const token = localStorage.getItem('accessToken')

  const loadCart = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Failed to load cart',
        )
      }

      setCart(data)
    } catch (error) {
      console.error('Failed to load cart:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load cart.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const updateQuantity = async (
    item: CartItem,
    quantity: number,
  ) => {
    if (!token) {
      navigate('/login')
      return
    }

    if (quantity < 1 || quantity > item.product.stock) {
      return
    }

    setUpdatingItem(item.id)

    try {
      const response = await fetch(
        `${API_URL}/cart/items/${item.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Failed to update cart',
        )
      }

      await loadCart()
    } catch (error) {
      console.error('Failed to update cart:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update cart.',
      )
    } finally {
      setUpdatingItem(null)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!token) {
      navigate('/login')
      return
    }

    setUpdatingItem(itemId)

    try {
      const response = await fetch(
        `${API_URL}/cart/items/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Failed to remove item',
        )
      }

      await loadCart()
    } catch (error) {
      console.error('Failed to remove item:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to remove item.',
      )
    } finally {
      setUpdatingItem(null)
    }
  }

  const subtotal =
    cart?.items.reduce(
      (total, item) =>
        total + item.product.priceEtb * item.quantity,
      0,
    ) || 0

  if (loading) {
    return (
      <div className="marketplace">
        <div className="loading-state">
          Loading cart...
        </div>
      </div>
    )
  }

  if (error && !cart) {
    return (
      <div className="marketplace">
        <main className="section cart-page">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <div className="empty-state">
            {error}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="marketplace">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">S</span>
            <span>UniqueMarket</span>
          </Link>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
            />
          </div>

          <nav className="nav">
            <Link to="/products">Products</Link>

            <Link to="/stores">Stores</Link>

            <Link to="/cart" className="cart-link">
              <ShoppingBag size={21} />
              <span>Cart</span>
            </Link>

            <Link to="/" className="login-button">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="section cart-page">
        <Link to="/products" className="back-link">
          <ArrowLeft size={18} />
          Continue shopping
        </Link>

        <div className="section-heading cart-heading">
          <div>
            <span className="section-label">Shopping</span>
            <h1>Your cart</h1>
          </div>
        </div>

        {error && cart && (
          <div className="cart-error">
            {error}
          </div>
        )}

        {!cart?.items.length ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={40} />
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Browse products from Ethiopian SMEs and
              add something to your cart.
            </p>

            <Link
              to="/products"
              className="primary-button"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <div className="cart-item-image">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                      />
                    ) : (
                      <ShoppingBag size={30} />
                    )}
                  </div>

                  <div className="cart-item-info">
                    <span className="product-category">
                      Product
                    </span>

                    <h3>{item.product.name}</h3>

                    <p>
                      {item.product.store?.name ||
                        'Local SME'}
                    </p>

                    <strong>
                      {item.product.priceEtb.toLocaleString()} ETB
                    </strong>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item,
                            item.quantity - 1,
                          )
                        }
                        disabled={
                          updatingItem === item.id ||
                          item.quantity <= 1
                        }
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item,
                            item.quantity + 1,
                          )
                        }
                        disabled={
                          updatingItem === item.id ||
                          item.quantity >= item.product.stock
                        }
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <strong className="cart-item-total">
                      {(
                        item.product.priceEtb *
                        item.quantity
                      ).toLocaleString()}{' '}
                      ETB
                    </strong>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() =>
                        removeItem(item.id)
                      }
                      disabled={updatingItem === item.id}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Order summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>
                  {subtotal.toLocaleString()} ETB
                </strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  {subtotal.toLocaleString()} ETB
                </strong>
              </div>

              <button
                type="button"
                className="primary-button checkout-button"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default Cart

