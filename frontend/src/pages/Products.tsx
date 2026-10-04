import { API_URL } from '../config'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Search,
  ShoppingCart,
  Package,
  SlidersHorizontal,
  ArrowRight,
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
    id?: string
    name: string
    slug?: string
  }
  store?: {
    id?: string
    name: string
  }
}

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(`${API_URL}/products`)
        const data = response.data

        setProducts(
          Array.isArray(data) ? data : data.products ?? [],
        )
      } catch (err) {
        console.error('Failed to load products:', err)
        setError(
          'Unable to load products. Please check that the backend is running.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = useMemo(() => {
    const names = products
      .map((product) => product.category?.name)
      .filter((name): name is string => Boolean(name))

    return ['All', ...Array.from(new Set(names)).sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchText = search.trim().toLowerCase()

      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText) ||
        product.store?.name.toLowerCase().includes(searchText)

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category?.name === selectedCategory

      return matchesSearch && matchesCategory
    })

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.priceEtb - b.priceEtb)
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.priceEtb - a.priceEtb)
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
    }

    return result
  }, [products, search, selectedCategory, sortBy])

  return (
    <div className="marketplace-page">
      <header className="marketplace-header">
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

      <main className="marketplace-content">
        <section className="products-hero">
          <div>
            <span className="products-eyebrow">
              DISCOVER LOCAL BUSINESSES
            </span>

            <h1>
              Find products.
              <br />
              <span>Support Ethiopian SMEs.</span>
            </h1>

            <p>
              Shop products from local businesses in one place,
              with convenient checkout and delivery options.
            </p>
          </div>
        </section>

        <section className="products-toolbar">
          <div className="products-heading">
            <div>
              <h2>Explore products</h2>
              <p>
                {loading
                  ? 'Loading the marketplace...'
                  : `${filteredProducts.length} products available`}
              </p>
            </div>
          </div>

          <div className="products-controls">
            <label className="products-search">
              <Search size={19} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or stores..."
              />
            </label>

            <label className="products-sort">
              <SlidersHorizontal size={17} />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        </section>

        <div className="products-layout">
          <aside className="products-sidebar">
            <h3>Categories</h3>

            <div className="category-options">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? 'category-option selected'
                      : 'category-option'
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category}</span>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>

            <div className="products-sidebar-note">
              <Store size={20} />
              <strong>Shop local</strong>
              <p>
                Discover products offered by independent Ethiopian
                businesses.
              </p>
            </div>
          </aside>

          <section className="products-results">
            {error && (
              <div className="cart-error">
                <p>{error}</p>
                <button
                  className="primary-button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}

            {loading ? (
              <div className="products-message">
                Loading products...
              </div>
            ) : !error && filteredProducts.length === 0 ? (
              <div className="products-empty">
                <Package size={42} />
                <h3>No products found</h3>
                <p>
                  Try another search or select a different category.
                </p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setSearch('')
                    setSelectedCategory('All')
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="customer-product-grid">
                {filteredProducts.map((product) => (
                  <article
                    className="customer-product-card"
                    key={product.id}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="customer-product-image-wrap"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="customer-product-image"
                        />
                      ) : (
                        <div className="customer-product-placeholder">
                          <Package size={44} />
                          <span>Product image</span>
                        </div>
                      )}

                      {product.stock <= 0 && (
                        <span className="product-stock-badge">
                          Out of stock
                        </span>
                      )}
                    </Link>

                    <div className="customer-product-info">
                      <span className="customer-product-category">
                        {product.category?.name ?? 'General'}
                      </span>

                      <Link
                        to={`/products/${product.id}`}
                        className="customer-product-name"
                      >
                        {product.name}
                      </Link>

                      <p className="customer-product-store">
                        <Store size={14} />
                        {product.store?.name ?? 'Local seller'}
                      </p>

                      <div className="customer-product-bottom">
                        <div>
                          <strong>
                            {product.priceEtb.toLocaleString()} ETB
                          </strong>
                          <span>
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : 'Currently unavailable'}
                          </span>
                        </div>

                        <Link
                          to={`/products/${product.id}`}
                          className="customer-product-action"
                          aria-label={`View ${product.name}`}
                        >
                          <ArrowRight size={19} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Products

