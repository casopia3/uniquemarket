import { API_URL } from '../config'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'


function CreateStore() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Unable to create store',
        )
      }

      navigate('/seller')
    } catch (error) {
      console.error('Create store failed:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create store.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-mark">S</span>
          <span>UniqueMarket</span>
        </Link>

        <div className="auth-heading">
          <h1>Create your store</h1>
          <p>
            Set up your store before adding your products.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Store name

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Casopia Electronics"
              minLength={2}
              required
            />
          </label>

          <label>
            Store description

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Tell customers about your store"
              rows={5}
            />
          </label>

          <button
            type="submit"
            className="primary-button auth-button"
            disabled={loading}
          >
            {loading ? 'Creating store...' : 'Create Store'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/seller">Back to seller dashboard</Link>
        </p>
      </div>
    </div>
  )
}

export default CreateStore

