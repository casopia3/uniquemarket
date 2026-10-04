import { API_URL } from '../config'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  Package,
  Plus,
  RefreshCw,
  Store,
  Pencil,
  Image as ImageIcon,
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
  category?: { name: string }
}

function SellerProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.get(`${API_URL}/products/seller/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data.products ?? [],
      )
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Unable to load products. Check the seller products API.',
        )
      } else {
        setError('Unable to load products.')
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <main className="seller-dashboard">
      <aside className="seller-sidebar">
        <Link to="/" className="seller-brand">
          <span className="logo-mark">S</span>
          <span>UniqueMarket</span>
        </Link>

        <nav className="seller-nav">
          <Link to="/seller" className="seller-nav-item">
            <Store size={19} />
            Dashboard
          </Link>

          <Link
            to="/seller/products"
            className="seller-nav-item active"
          >
            <Package size={19} />
            Products
          </Link>

          <Link to="/seller/orders" className="seller-nav-item">
            <Pencil size={19} />
            Orders
          </Link>
        </nav>
      </aside>

      <section className="seller-main">
        <header className="seller-topbar">
          <div>
            <Link to="/seller" className="seller-back-link">
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
            <h1>Products</h1>
            <p>Manage your store inventory and pricing.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate('/seller/products/new')}
          >
            <Plus size={18} />
            Add Product
          </button>
        </header>

        <div className="seller-stats">
          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <Package size={20} />
            </div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <Store size={20} />
            </div>
            <span>Active Products</span>
            <strong>
              {products.filter((p) => p.status === 'ACTIVE').length}
            </strong>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <ImageIcon size={20} />
            </div>
            <span>Low Stock</span>
            <strong>
              {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
            </strong>
          </div>
        </div>

        {error && (
          <div className="cart-error">
            <p>{error}</p>
            <button
              className="primary-button"
              onClick={loadProducts}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        <div className="seller-content-card">
          <div className="seller-card-heading">
            <div>
              <h2>Your inventory</h2>
              <p>Products belonging to your store.</p>
            </div>
            <span>{products.length} products</span>
          </div>

          {loading ? (
            <div className="seller-loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="seller-empty">
              <Package size={42} />
              <h3>No products yet</h3>
              <p>Add your first product to start selling.</p>
              <button
                className="primary-button"
                onClick={() => navigate('/seller/products/new')}
              >
                <Plus size={18} />
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="seller-product-grid">
              {products.map((product) => (
                <article className="seller-product-card" key={product.id}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="seller-product-image"
                    />
                  ) : (
                    <div className="seller-product-placeholder">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  <div className="seller-product-info">
                    <span
                      className={`status-badge status-${product.status.toLowerCase()}`}
                    >
                      {product.status}
                    </span>

                    <h3>{product.name}</h3>
                    <p>{product.category?.name ?? 'Uncategorized'}</p>

                    <strong>
                      {product.priceEtb.toLocaleString()} ETB
                    </strong>

                    <span>Stock: {product.stock}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default SellerProducts

