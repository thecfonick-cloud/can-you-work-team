import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Users, DollarSign, Award, ShieldAlert } from 'lucide-react';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'High-Paying Tasks',
      desc: 'Complete simple social media follows, likes, shares, or surveys and earn quick rewards.'
    },
    {
      icon: Users,
      title: 'Referral Ecosystem',
      desc: 'Invite friends and get 10% commission on all their earnings, plus milestone bonuses up to ₦500!'
    },
    {
      icon: Award,
      title: 'Lucky Reward Tasks',
      desc: 'Stand a chance to get randomly assigned premium lucky tasks paying ₦1,000 to ₦10,000 each!'
    },
    {
      icon: DollarSign,
      title: 'Instant Withdrawals',
      desc: 'Request withdrawals easily using PayPal, Bank Transfer, BTC, USDT, or Payoneer with minimal fees.'
    }
  ];

  const steps = [
    { num: '01', title: 'Register an Account', desc: 'Create a free profile in seconds. Receive a ₦200 instant sign-up bonus.' },
    { num: '02', title: 'Choose Microtasks', desc: 'Browse hundreds of social media campaigns or surveys updated daily.' },
    { num: '03', title: 'Submit Screenshot Proof', desc: 'Complete the task guidelines, submit proof, and get verified.' },
    { num: '04', title: 'Withdraw Earnings', desc: 'Request your money once you reach the low withdrawal minimums.' }
  ];

  return (
    <div className="landing-page-container">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="logo-container">
          <div className="logo-icon">W</div>
          <span className="logo-text">CanYouWork</span>
        </div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-content">
          <div className="hero-badge">🎉 Get ₦200 instant signup bonus</div>
          <h1>Earn Rewards for Simple Social & Survey Tasks</h1>
          <p>
            CanYouWork connects brands with real users. Complete simple microtasks—follow on Instagram, share on Facebook, watch YouTube videos, or answer surveys—and earn real cash.
          </p>
          <div className="hero-cta-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Start Earning Now <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
              Advertiser Login
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-box">
              <h3>₦2.5M+</h3>
              <p>Rewards Paid Out</p>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-box">
              <h3>240K+</h3>
              <p>Tasks Completed</p>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-box">
              <h3>12K+</h3>
              <p>Active Earners</p>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-dashboard-mockup">
            <div className="mockup-header">
              <span className="dot dot-r"></span>
              <span className="dot dot-y"></span>
              <span className="dot dot-g"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar"></div>
              <div className="mockup-main">
                <div className="mockup-row-1">
                  <div className="mockup-card-sm"></div>
                  <div className="mockup-card-sm"></div>
                </div>
                <div className="mockup-card-lg"></div>
                <div className="mockup-row-2">
                  <div className="mockup-list-item"></div>
                  <div className="mockup-list-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="landing-features-section">
        <div className="section-header-center">
          <h2>Why Choose CanYouWork?</h2>
          <p>We offer the most user-friendly microtask experience with zero advertiser hurdles.</p>
        </div>
        <div className="features-grid">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div className="feature-card" key={idx}>
                <div className="feature-icon-container">
                  <Icon size={24} className="feature-icon" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="landing-how-section">
        <div className="section-header-center">
          <h2>Get Started in 4 Easy Steps</h2>
          <p>It takes less than 3 minutes to set up your account and start claiming active tasks.</p>
        </div>
        <div className="steps-container">
          {steps.map((s, idx) => (
            <div className="step-card" key={idx}>
              <div className="step-number">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fraud Warning / Safety Banner */}
      <section className="safety-banner-section">
        <div className="safety-banner-content">
          <ShieldAlert className="safety-icon" size={32} />
          <div className="safety-text">
            <h3>Fair Play & Integrity Policy</h3>
            <p>
              Our system runs real-time IP checking and device fingerprinting. Using VPNs, proxy networks, or submitting fake screenshots will result in immediate permanent suspension. All tasks are manually verified by admins.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="landing-testimonials-section">
        <div className="section-header-center">
          <h2>What Our Earners Say</h2>
          <p>Join thousands of users who earn pocket money daily during their free time.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"CanYouWork is incredibly easy. I follow some pages on Instagram during my daily commute and get paid direct to my bank account. Highly recommended!"</p>
            <div className="testimonial-user">
              <div className="user-avatar-placeholder">T</div>
              <div>
                <h4>Tunde A.</h4>
                <p>Lagos, Nigeria</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"The referral commissions are amazing! I invited 10 friends, and now I earn passive income as they complete tasks, plus milestone bonuses. Best microtask site!"</p>
            <div className="testimonial-user">
              <div className="user-avatar-placeholder">S</div>
              <div>
                <h4>Sarah J.</h4>
                <p>Johannesburg, SA</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"I received a Lucky Task of ₦5,000 for filling out a simple marketing survey. I couldn't believe it when it was approved and credited within 2 hours."</p>
            <div className="testimonial-user">
              <div className="user-avatar-placeholder">M</div>
              <div>
                <h4>Michael B.</h4>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="landing-newsletter-section">
        <div className="newsletter-card">
          <h2>Never Miss a High-Paying Campaign</h2>
          <p>Subscribe to our newsletter to receive notifications when premium lucky tasks or high-budget campaigns launch.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
