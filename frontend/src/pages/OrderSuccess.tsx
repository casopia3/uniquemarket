import { Link, useParams } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Package } from 'lucide-react'

function OrderSuccess() {
  const { orderNumber } = useParams()

  return (
    <main className="marketplace">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">S</span>
            <span>UniqueMarket</span>
          </Link>

          <Link to="/products" className="cart-link">
            Continue Shopping
          </Link>
        </div>
      </header>

      <section className="order-success">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle size={56} />
          </div>

          <p className="section-label">ORDER CONFIRMED</p>

          <h1>Thank you for your order!</h1>

          <p className="success-message">
            Your order has been successfully submitted.
            The seller will start processing it shortly.
          </p>

          <div className="order-number-box">
            <span>Order number</span>
            <strong>{orderNumber}</strong>
          </div>

          <div className="success-info">
            <div>
              <Package size={20} />
              <span>
                <strong>Cash on Delivery</strong>
                <small>Payment will be collected when your order arrives.</small>
              </span>
            </div>

            <div>
              <ShoppingBag size={20} />
              <span>
                <strong>Order received</strong>
                <small>Your seller has received your order.</small>
              </span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/orders" className="primary-button">
              View My Orders
            </Link>

            <Link to="/products" className="secondary-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default OrderSuccess
