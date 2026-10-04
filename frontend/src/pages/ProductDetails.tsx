import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Store,
} from 'lucide-react'
import '../App.css'


type Product = {
  id: string
  name: string
  description?: string | null
  priceEtb: number
  stock: number
  imageUrl?: string | null
  status: string
  category?: {
    name: string
  }
  store?: {
    name: string
    description?: string | null
  }
}

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(
          `${API_URL}/products/${id}`,
        )

        setProduct(response.data)
      } catch (err) {
        console.error('Failed to load product:', err)

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              'Unable to load this product.',
          )
        } else {
          setError('Unable to load this product.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  const increaseQuantity = () => {
    if (!product) return

    setQuantity((current) =>
      Math.min(current + 1, product.stock),
    )
  }

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1))
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login', {
        state: {
          from: `/products/${id}`,
        },
      })
      return
    }

    if (!product || product.stock <= 0) {
      return
    }

    setAdding(true)
    setError('')
    setSuccess('')

    try {
      await axios.post(
        `${API_URL}/cart/items`,
        {
          productId: product.id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setSuccess('Product added to your cart.')
    } catch (err) {
      console.error('Add to cart failed:', err)

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Unable to add this product to your cart.',
        )
      } else {
        setError('Unable to add this product to your cart.')
      }
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          Loading product...
        </div>
      </main>
    )
  }

  if (error && !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          <p>{error}</p>
          <Link to="/products" className="primary-button">
            Back to Products
          </Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return null
  }

  const total = product.priceEtb * quantity
  const isOutOfStock = product.stock <= 0

  return (
    <main className="product-details-page">
      <header className="product-details-header">
        <Link to="/" className="marketplace-brand">
          <span className="logo-mark">S</span>
          <span>UniqueMarket</span>
        </Link>

        <nav className="marketplace-nav">
          <Link to="/">Home</Link>
          <Link to="/products" className="active">
            Products
          </Link>
          <Link to="/orders">My Orders</Link>
        </nav>

        <Link to="/cart" className="marketplace-cart">
          <ShoppingCart size={19} />
          <span>Cart</span>
        </Link>
      </header>

      <section className="product-details-content">
        <Link to="/products" className="product-back-link">
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="product-details-layout">
          <div className="product-details-image">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <div className="product-details-placeholder">
                <ShoppingCart size={60} />
                <span>No product image</span>
              </div>
            )}
          </div>

          <div className="product-details-info">
            <span className="product-details-category">
              {product.category?.name ?? 'General'}
            </span>

            <h1>{product.name}</h1>

            <div className="product-details-store">
              <Store size={17} />
              <span>
                Sold by{' '}
                <strong>
                  {product.store?.name ?? 'Local seller'}
                </strong>
              </span>
            </div>

            <div className="product-details-price">
              {product.priceEtb.toLocaleString()} ETB
            </div>

            <div className="product-details-stock">
              {isOutOfStock ? (
                <span className="stock-unavailable">
                  Out of stock
                </span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{product.stock} available</span>
                </>
              )}
            </div>

            <div className="product-details-divider" />

            <div className="product-description">
              <h2>About this product</h2>

              <p>
                {product.description ||
                  'This seller has not added a product description yet.'}
              </p>
            </div>

            {!isOutOfStock && (
              <div className="product-purchase">
                <div className="quantity-section">
                  <span>Quantity</span>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={17} />
                    </button>

                    <strong>{quantity}</strong>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>

                <div className="product-total">
                  <span>Total</span>
                  <strong>
                    {total.toLocaleString()} ETB
                  </strong>
                </div>

                <button
                  type="button"
                  className="primary-button product-add-button"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  <ShoppingCart size={19} />
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            {error && (
              <div className="cart-error">
                {error}
              </div>
            )}

            {success && (
              <div className="product-success">
                <Check size={18} />
                <span>{success}</span>

                <Link to="/cart">
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails

