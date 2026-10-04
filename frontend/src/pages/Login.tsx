import { API_URL } from '../config'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, ShieldCheck, Store, ShoppingBag } from 'lucide-react'
import '../App.css'

function Login() {
const navigate = useNavigate()
const location = useLocation()

const [identifier, setIdentifier] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [rememberMe, setRememberMe] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleSubmit = async (event: FormEvent) => {
event.preventDefault()
setLoading(true)
setError('')

try {
  const loginData = identifier.includes('@')
    ? { email: identifier.trim(), password }
    : { phone: identifier.trim(), password }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message || 'Login failed',
    )
  }

  localStorage.setItem('accessToken', data.accessToken)

  if (data.user) {
    localStorage.setItem('authUser', JSON.stringify(data.user))
  }

  if (rememberMe) {
    localStorage.setItem('rememberedIdentifier', identifier.trim())
  } else {
    localStorage.removeItem('rememberedIdentifier')
  }

  const from = location.state?.from || '/'
  navigate(from)
} catch (error) {
  console.error('Login failed:', error)
  setError(error instanceof Error ? error.message : 'Unable to login.')
} finally {
  setLoading(false)
}

}

return ( <main className="auth-page auth-page-modern"> <section className="auth-showcase"> <Link to="/" className="auth-brand"><span>
  Unique<span className="auth-brand-light">Market</span>
</span> </Link>

    <div className="auth-showcase-content">
      <span className="auth-eyebrow">
        <span className="auth-eyebrow-dot" />
        YOUR MARKETPLACE, REIMAGINED
      </span>

      <h1>
        Great businesses
        <br />
        start with <span>connection.</span>
      </h1>

      <p className="auth-showcase-description">
        Discover local products, support Ethiopian businesses,
        and find everything you need in one place.
      </p>

      <div className="auth-feature-list">
        <div className="auth-feature">
          <span className="auth-feature-icon"><ShoppingBag size={20} /></span>
          <div>
            <strong>Discover more</strong>
            <span>Products from businesses across Ethiopia</span>
          </div>
        </div>

        <div className="auth-feature">
          <span className="auth-feature-icon"><Store size={20} /></span>
          <div>
            <strong>Grow your business</strong>
            <span>Reach customers and showcase your products</span>
          </div>
        </div>
      </div>
    </div>

    <div className="auth-showcase-footer">
      <span>Built for local businesses.</span>
      <span>Made for everyone.</span>
    </div>
  </section>

  <section className="auth-panel">
    <div className="auth-panel-top">
      <span>New to UniqueMarket?</span>
      <Link to="/signup" className="auth-top-link">Create account <ArrowRight size={15} /></Link>
    </div>

    <div className="auth-form-container">
      <div className="auth-mobile-brand">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark">s.</span>
          <span>SME<span className="auth-brand-light">marketplace</span></span>
        </Link>
      </div>

      <div className="auth-heading-modern">
        <span className="auth-form-kicker">WELCOME BACK</span>
        <h2>Sign in to your account</h2>
        <p>Enter your details below to continue.</p>
      </div>

      {error && (
        <div className="auth-error" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="auth-form auth-form-modern">
        <label className="auth-field">
          <span>Email or phone number</span>
          <input
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Enter your email or phone"
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <div className="auth-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="auth-form-options">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="auth-forgot-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="primary-button auth-button auth-button-modern" disabled={loading}>
          {loading ? 'Signing you in...' : <>Sign in to your account <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="auth-security-note">
        <ShieldCheck size={17} />
        <span>Your account and information are protected.</span>
      </div>

      <p className="auth-footer auth-footer-modern">
        Don't have an account? <Link to="/signup">Join the marketplace</Link>
      </p>
    </div>

    <div className="auth-panel-bottom">
      <span>© {new Date().getFullYear()} UniqueMarket</span>
      <Link to="/">Back to marketplace</Link>
    </div>
  </section>
</main>

)
}

export default Login

