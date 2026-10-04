import { API_URL } from '../config'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
Eye,
EyeOff,
ArrowRight,
ShieldCheck,
ShoppingBag,
Store,
CheckCircle2,
} from 'lucide-react'
import '../App.css'

type AccountRole = 'CUSTOMER' | 'SELLER'

function Signup() {
const navigate = useNavigate()

const [role, setRole] = useState<AccountRole>('CUSTOMER')
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const passwordChecks = {
length: password.length >= 8,
number: /\d/.test(password),
}

const handleSubmit = async (event: FormEvent) => {
event.preventDefault()
setLoading(true)
setError('')

try {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      password,
      role,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message || 'Registration failed',
    )
  }

  localStorage.setItem('accessToken', data.accessToken)

  if (data.user) {
    localStorage.setItem('authUser', JSON.stringify(data.user))
  }

  if (role === 'SELLER') {
    navigate('/seller')
  } else {
    navigate('/')
  }
} catch (error) {
  console.error('Registration failed:', error)
  setError(
    error instanceof Error
      ? error.message
      : 'Unable to create account.',
  )
} finally {
  setLoading(false)
}

}

return ( <main className="auth-page auth-page-modern"> <section className="auth-showcase"> <Link to="/" className="auth-brand"> <span className="auth-brand-mark">s.</span> <span>
SME<span className="auth-brand-light">marketplace</span> </span> </Link>

```
    <div className="auth-showcase-content">
      <span className="auth-eyebrow">
        <span className="auth-eyebrow-dot" />
        YOUR NEXT OPPORTUNITY STARTS HERE
      </span>

      <h1>
        Your business.
        <br />
        Your <span>next chapter.</span>
      </h1>

      <p className="auth-showcase-description">
        Join a growing marketplace connecting customers with
        businesses and products across Ethiopia.
      </p>

      <div className="auth-signup-benefits">
        <div className="auth-signup-benefit">
          <span className="auth-benefit-check">
            <CheckCircle2 size={17} />
          </span>
          <span>Discover products from local businesses</span>
        </div>

        <div className="auth-signup-benefit">
          <span className="auth-benefit-check">
            <CheckCircle2 size={17} />
          </span>
          <span>Create your account in just a few steps</span>
        </div>

        <div className="auth-signup-benefit">
          <span className="auth-benefit-check">
            <CheckCircle2 size={17} />
          </span>
          <span>Choose to shop or start selling</span>
        </div>
      </div>

      <div className="auth-role-promo">
        <div className="auth-role-promo-icon">
          <ShoppingBag size={20} />
        </div>
        <div>
          <strong>One marketplace, more possibilities.</strong>
          <p>Find what you need or bring your products to more people.</p>
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
      <span>Already have an account?</span>
      <Link to="/login" className="auth-top-link">
        Sign in <ArrowRight size={15} />
      </Link>
    </div>

    <div className="auth-form-container auth-signup-container">
      <div className="auth-mobile-brand">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark">s.</span>
         <span>
  Unique<span className="auth-brand-light">Market</span>
</span>
        </Link>
      </div>

      <div className="auth-heading-modern auth-signup-heading">
        <span className="auth-form-kicker">GET STARTED TODAY</span>
        <h2>Create your account</h2>
        <p>Choose how you'd like to use the marketplace.</p>
      </div>

      <div className="auth-role-selector auth-role-selector-modern">
        <button
          type="button"
          className={
            role === 'CUSTOMER'
              ? 'role-option active'
              : 'role-option'
          }
          onClick={() => {
            setRole('CUSTOMER')
            setError('')
          }}
          aria-pressed={role === 'CUSTOMER'}
        >
          <span className="auth-role-icon">
            <ShoppingBag size={19} />
          </span>
          <span className="auth-role-copy">
            <strong>Customer</strong>
            <span>Discover and shop</span>
          </span>
          <span className="auth-role-radio">
            {role === 'CUSTOMER' && <span />}
          </span>
        </button>

        <button
          type="button"
          className={
            role === 'SELLER'
              ? 'role-option active'
              : 'role-option'
          }
          onClick={() => {
            setRole('SELLER')
            setError('')
          }}
          aria-pressed={role === 'SELLER'}
        >
          <span className="auth-role-icon">
            <Store size={19} />
          </span>
          <span className="auth-role-copy">
            <strong>Seller</strong>
            <span>Showcase your products</span>
          </span>
          <span className="auth-role-radio">
            {role === 'SELLER' && <span />}
          </span>
        </button>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form auth-form-modern auth-signup-form">
        <label className="auth-field">
          <span>Full name</span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            required
          />
        </label>

        <div className="auth-signup-field-row">
          <label className="auth-field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-field">
            <span>Phone number</span>
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="09XXXXXXXX"
            />
          </label>
        </div>

        <p className="auth-contact-hint">
          Provide the email or phone number you use for your account.
        </p>

        <label className="auth-field">
          <span>Password</span>
          <div className="auth-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              minLength={8}
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

        {password.length > 0 && (
          <div className="auth-password-requirements">
            <span className={passwordChecks.length ? 'is-valid' : ''}>
              <CheckCircle2 size={14} />
              At least 8 characters
            </span>
            <span className={passwordChecks.number ? 'is-valid' : ''}>
              <CheckCircle2 size={14} />
              At least one number
            </span>
          </div>
        )}

        <button
          type="submit"
          className="primary-button auth-button auth-button-modern"
          disabled={loading}
        >
          {loading
            ? 'Creating your account...'
            : <>
                {role === 'SELLER'
                  ? 'Create seller account'
                  : 'Create customer account'}
                <ArrowRight size={18} />
              </>}
        </button>
      </form>

      <div className="auth-security-note">
        <ShieldCheck size={17} />
        <span>Your information is handled securely.</span>
      </div>

      <p className="auth-footer auth-footer-modern">
        Already registered? <Link to="/login">Sign in instead</Link>
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

export default Signup

