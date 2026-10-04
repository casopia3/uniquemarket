import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Search,
  ShoppingCart,
  Store,
  Package,
  Sparkles,
  User,
  ShieldCheck,
} from 'lucide-react'

import '../App.css'


type Product = {
  id: string
  name: string
  priceEtb: number
  stock: number
  imageUrl?: string | null
  description?: string | null
  category?: {
    id: string
    name: string
    slug: string
  }
  store?: {
    id: string
    name: string
  }
}

type Category = {
  id: string
  name: string
  slug: string
}

function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(true)

  const token = localStorage.getItem('accessToken')
  const authUser = localStorage.getItem('authUser')

  let userName = ''
  let userRole = ''

  if (authUser) {
    try {
      const user = JSON.parse(authUser)
      userName = user?.name || ''
      userRole = user?.role || ''
    } catch {
      userName = ''
      userRole = ''
    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`)

        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        const data = await response.json()

        setProducts(
          Array.isArray(data)
            ? data
            : data.products ?? [],
        )
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`)

        if (!response.ok) {
          throw new Error('Failed to load categories')
        }

        const data = await response.json()

        setCategories(
          Array.isArray(data)
            ? data
            : data.categories ?? [],
        )
      } catch (error) {
        console.error(
          'Failed to load categories:',
          error,
        )
      } finally {
        setCategoryLoading(false)
      }
    }

    loadProducts()
    loadCategories()
  }, [])

  const handleSearch = (
    event: React.FormEvent,
  ) => {
    event.preventDefault()

    const value = search.trim()

    if (value) {
      window.location.href =
        `/products?search=${encodeURIComponent(value)}`
    } else {
      window.location.href = '/products'
    }
  }

  return (
    <div className="marketplace">

      {/* Header */}
      <header className="header">
        <div className="header-inner">

          <Link to="/" className="logo">
            <span className="logo-mark">S</span>

            <span>UniqueMarket</span>
          </Link>

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <Search size={19} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
            />
          </form>

          <nav className="nav">

            <Link to="/products">
              Products
            </Link>

            <Link
              to="/cart"
              className="cart-link"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
            </Link>

            {token ? (
              <>
                <Link to="/orders">
                  My Orders
                </Link>

                <Link
                  to={
                    userRole === 'ADMIN'
                      ? '/admin'
                      : '/seller'
                  }
                  className="account-link"
                >
                  <User size={18} />

                  <span>
                    {userRole === 'ADMIN'
                      ? 'Marketplace Admin'
                      : userName || 'Account'}
                  </span>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="login-button"
              >
                Login
              </Link>
            )}

          </nav>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="hero-section">

          <div className="hero-content">

            <span className="eyebrow">
              <Sparkles size={15} />
              Shop Ethiopian SMEs
            </span>

            <h1>
              Discover products.
              <br />
              <span>Support local businesses.</span>
            </h1>

            <p>
              Shop products from Ethiopian small and
              medium businesses, all in one trusted
              marketplace.
            </p>

            <div className="hero-actions">

              <Link
                to="/products"
                className="primary-button"
              >
                Browse Products
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/seller/register"
                className="secondary-button"
              >
                Become a Seller
              </Link>

            </div>

            <div className="hero-trust">

              <div>
                <ShieldCheck size={17} />
                <span>Trusted marketplace</span>
              </div>

              <div>
                <Store size={17} />
                <span>Local businesses</span>
              </div>

            </div>

          </div>

          <div className="hero-card">

            <div className="hero-card-top">
              <div className="hero-card-icon">
                <Store size={28} />
              </div>

              <span className="hero-card-badge">
                LOCAL
              </span>
            </div>

            <strong>
              Built for Ethiopian businesses
            </strong>

            <span>
              Discover products from growing
              local SMEs and support businesses
              in your community.
            </span>

            <div className="hero-card-stats">

              <div>
                <strong>
                  {products.length}+
                </strong>

                <span>Products</span>
              </div>

              <div>
                <strong>
                  {categories.length}+
                </strong>

                <span>Categories</span>
              </div>

            </div>

          </div>

        </section>

        {/* Categories */}
        <section className="section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                Explore
              </span>

              <h2>
                Shop by category
              </h2>
            </div>

            <Link
              to="/products"
              className="view-all"
            >
              View all
              <ArrowRight size={17} />
            </Link>

          </div>

          {categoryLoading ? (
            <div className="loading-state">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              Categories will appear here as
              they are added.
            </div>
          ) : (
            <div className="category-grid">

              {categories
                .slice(0, 6)
                .map((category) => (
                  <Link
                    key={category.id}
                    to={
                      `/products?category=${encodeURIComponent(
                        category.slug,
                      )}`
                    }
                    className="category-card"
                  >

                    <div className="category-icon">
                      <Package size={21} />
                    </div>

                    <span>
                      {category.name}
                    </span>

                    <ArrowRight size={16} />

                  </Link>
                ))}

            </div>
          )}

        </section>

        {/* Featured Products */}
        <section className="section products-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                Marketplace
              </span>

              <h2>
                Featured products
              </h2>
            </div>

            <Link
              to="/products"
              className="view-all"
            >
              View all
              <ArrowRight size={17} />
            </Link>

          </div>

          {loading ? (
            <div className="loading-state">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">

              <Package size={35} />

              <p>
                No products are available yet.
              </p>

              <Link
                to="/seller/register"
                className="primary-button"
              >
                Become the first seller
              </Link>

            </div>
          ) : (
            <div className="product-grid">

              {products
                .slice(0, 8)
                .map((product) => (

                  <Link
                    to={`/products/${product.id}`}
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-image">

                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      ) : (
                        <div className="product-placeholder">
                          <Package size={32} />
                        </div>
                      )}

                      {product.stock <= 0 && (
                        <span className="product-stock-badge">
                          Out of stock
                        </span>
                      )}

                    </div>

                    <div className="product-info">

                      <span className="product-category">
                        {product.category?.name ||
                          'Product'}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <p className="seller-name">
                        <Store size={13} />

                        {product.store?.name ||
                          'Local SME'}
                      </p>

                      <div className="product-bottom">

                        <strong>
                          {product.priceEtb.toLocaleString()}{' '}
                          ETB
                        </strong>

                        <span>
                          {product.stock > 0
                            ? 'In stock'
                            : 'Out of stock'}
                        </span>

                      </div>

                    </div>

                  </Link>

                ))}

            </div>
          )}

        </section>

        {/* Seller CTA */}
        <section className="seller-cta">

          <div>

            <span className="section-label">
              FOR ETHIOPIAN SMEs
            </span>

            <h2>
              Turn your business into
              an online store.
            </h2>

            <p>
              Create your store, list your
              products, and reach more customers
              through UniqueMarket.
            </p>

          </div>

          <Link
            to="/seller/register"
            className="primary-button"
          >
            Start Selling
            <ArrowRight size={19} />
          </Link>

        </section>

      </main>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-inner">

          <div>

            <Link
              to="/"
              className="logo footer-logo"
            >
              <span className="logo-mark">
                S
              </span>

              <span>
                UniqueMarket
              </span>
            </Link>

            <p>
              Connecting Ethiopian SMEs
              with customers.
            </p>

          </div>

          <div className="footer-links">

            <Link to="/products">
              Products
            </Link>

            <Link to="/orders">
              My Orders
            </Link>

            <Link to="/seller/register">
              Sell with us
            </Link>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </footer>

    </div>
  )
}

export default Home

