import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

type Category = {
  id: string
  name: string
}

export default function AddProduct() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    priceEtb: '',
    stock: '',
    imageUrl: '',
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`)
        setCategories(response.data)
      } catch {
        setError('Could not load product categories.')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login')
      return
    }

    if (!form.categoryId) {
      setError('Please select a category.')
      return
    }

    setLoading(true)

    try {
      await axios.post(
        `${API_URL}/products`,
        {
          name: form.name.trim(),
          categoryId: form.categoryId,
          description: form.description.trim() || undefined,
          priceEtb: Number(form.priceEtb),
          stock: Number(form.stock),
          imageUrl: form.imageUrl.trim() || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      navigate('/seller/products')
    } catch (err: any) {
      const message = err?.response?.data?.message

      if (Array.isArray(message)) {
        setError(message.join(', '))
      } else {
        setError(message || 'Could not create product.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="seller-page">
      <div className="seller-container">
        <div className="seller-topbar">
          <div>
            <Link to="/seller/products" className="seller-back-link">
              ← Products
            </Link>

            <h1>Add Product</h1>
            <p>Add a new product to your store.</p>
          </div>
        </div>

        <div className="seller-form-card">
          {error && <div className="seller-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="seller-form-grid">
              <div className="seller-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Ethiopian Coffee"
                  required
                />
              </div>

              <div className="seller-form-group">
                <label>Category</label>

                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      categoryId: event.target.value,
                    })
                  }
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories
                      ? 'Loading categories...'
                      : 'Select a category'}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seller-form-group">
                <label>Price (ETB)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.priceEtb}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priceEtb: event.target.value,
                    })
                  }
                  placeholder="500"
                  required
                />
              </div>

              <div className="seller-form-group">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      stock: event.target.value,
                    })
                  }
                  placeholder="10"
                  required
                />
              </div>
            </div>

            <div className="seller-form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(event) =>
                  setForm({
                    ...form,
                    imageUrl: event.target.value,
                  })
                }
                placeholder="https://example.com/product.jpg"
              />

              <small>
                You can add image upload later. For the MVP, use an image URL.
              </small>
            </div>

            <div className="seller-form-group">
              <label>Description</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                placeholder="Describe your product..."
              />
            </div>

            <div className="seller-form-actions">
              <Link
                to="/seller/products"
                className="seller-secondary-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="seller-primary-button"
                disabled={loading}
              >
                {loading ? 'Creating Product...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
