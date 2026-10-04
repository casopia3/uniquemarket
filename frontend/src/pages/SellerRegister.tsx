import { API_URL } from '../config'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function SellerRegister() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const [storeName, setStoreName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create seller account
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        password: form.password,
        role: 'SELLER',
      })

      // 2. Save authentication data
      const { accessToken, user } = registerResponse.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('authUser', JSON.stringify(user))

      // 3. Create seller store
      await axios.post(
        `${API_URL}/stores`,
        {
          name: storeName,
          description: '',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      // 4. Go directly to seller dashboard
      navigate('/seller')
    } catch (err: any) {
      const message =
        err?.response?.data?.message

      if (Array.isArray(message)) {
        setError(message.join(', '))
      } else {
        setError(message || 'Seller registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card seller-register-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            UniqueMarket
          </Link>

          <h1>Start selling online</h1>

          <p>
            Create your seller account and start selling your products
            to customers across Ethiopia.
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Business / Owner Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Your name or business name"
              required
            />
          </div>

          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              placeholder="e.g. Nib Chocolate"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="09XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating your store...' : 'Create Seller Account'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>{' '}
          <Link to="/login">Sign in</Link>
        </div>

        <div className="seller-register-back">
          <Link to="/">← Back to marketplace</Link>
        </div>
      </div>
    </div>
  )
}

