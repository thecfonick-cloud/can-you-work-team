import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, DollarSign, Award, ShieldAlert, Sparkles, Menu, X } from 'lucide-react';
import Footer from '../components/Footer';
import { api } from '../api';

// ─── Animated Counter Hook ────────────────────────────
function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let rafId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, started]);

  return { count, ref, start };
}

// ─── Scroll Reveal Hook ───────────────────────────────
function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.scroll-reveal');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add stagger delay based on data attribute
            const delay = entry.target.dataset.revealDelay || 0;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const pageRef = useScrollReveal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [statsData, setStatsData] = useState({ rewardsPaid: 0, tasksCompleted: 0, activeEarners: 0 });

  // Animated counters
  const counter1 = useCountUp(statsData.rewardsPaid, 2200);
  const counter2 = useCountUp(statsData.tasksCompleted, 2000);
  const counter3 = useCountUp(statsData.activeEarners, 1800);
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getGlobalStats();
        if (res.success && res.stats) {
          setStatsData({
            rewardsPaid: res.stats.totalRewardsPaid || 0,
            tasksCompleted: res.stats.totalTasksCompleted || 0,
            activeEarners: res.stats.activeEarners || 0
          });
        }
      } catch (err) {
        console.error('Error fetching global stats:', err);
      }
    };
    fetchStats();
  }, []);



  // Start counters when stats section comes into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted) {
          setCountersStarted(true);
          counter1.start();
          counter2.start();
          counter3.start();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [countersStarted]);

  function formatCount(n) {
    if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M+`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K+`;
    return n.toString();
  }

  const handlePhoneMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates: range -12deg to 12deg
    const xc = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    const yc = -((y - rect.height / 2) / (rect.height / 2)) * 12;
    
    const mockup = el.querySelector('.phone-mockup-frame');
    if (mockup) {
      mockup.style.transform = `rotateX(${yc}deg) rotateY(${xc}deg) scale3d(1.02, 1.02, 1.02)`;
      mockup.style.boxShadow = `
        ${-xc * 1.5}px ${yc * 1.5}px 30px rgba(139, 92, 246, 0.25),
        0 25px 50px -12px rgba(0, 0, 0, 0.4)
      `;
    }
  };

  const handlePhoneMouseLeave = (e) => {
    const el = e.currentTarget;
    const mockup = el.querySelector('.phone-mockup-frame');
    if (mockup) {
      mockup.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      mockup.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.4)';
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'High-Paying Tasks',
      desc: 'Complete simple social media follows, likes, shares, or surveys and earn quick rewards.',
      backDesc: 'Earn up to ₦5,000 daily by performing fast social actions. Tasks are refreshed every hour so you never run out of work!'
    },
    {
      icon: Users,
      title: 'Referral Ecosystem',
      desc: 'Invite friends and get 10% commission on all their earnings, plus milestone bonuses up to ₦500!',
      backDesc: 'Grow your passive income stream. Earn 10% commission of everything your referrals earn, tracked automatically in your referrals tab.'
    },
    {
      icon: Award,
      title: 'Lucky Reward Tasks',
      desc: 'Stand a chance to get randomly assigned premium lucky tasks paying ₦1,000 to ₦10,000 each!',
      backDesc: 'Admins assign surprise high-paying tasks to active users. The more streaks you maintain, the higher your chances to get one!'
    },
    {
      icon: DollarSign,
      title: 'Instant Withdrawals',
      desc: 'Request withdrawals easily using PayPal, Bank Transfer, BTC, USDT, or Payoneer with minimal fees.',
      backDesc: 'We support PayPal, directly to Nigerian/African banks, USDT, BTC, and Payoneer. Payments are processed within 24 hours.'
    }
  ];

  const steps = [
    { num: '01', title: 'Register an Account', desc: 'Create a free profile in seconds. Receive a ₦200 instant sign-up bonus.' },
    { num: '02', title: 'Choose Microtasks', desc: 'Browse hundreds of social media campaigns or surveys updated daily.' },
    { num: '03', title: 'Submit Screenshot Proof', desc: 'Complete the task guidelines, submit proof, and get verified.' },
    { num: '04', title: 'Withdraw Earnings', desc: 'Request your money once you reach the low withdrawal minimums.' }
  ];

  const brandNames = ['1XBET', 'OPay', 'PalmPay', 'Binance', 'Moniepoint', 'Kuda', 'BetKing'];

  return (
    <div className="landing-page-container" ref={pageRef}>
      {/* Top Promo Notice Bar */}
      <div className="promo-notice-bar">
        <span>📢 Get paid for simple tasks online. Join thousands of members earning daily!</span>
        <button onClick={() => navigate('/register')} className="promo-notice-btn">Join Now &rarr;</button>
      </div>

      {/* Navigation Header */}
      <header className="landing-header">
        <div className="logo-container footer-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </div>
          <span className="logo-text">
            CanYou<span style={{ color: '#8b5cf6' }}>Work</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="landing-nav desktop-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </nav>

        {/* Mobile Hamburger toggle button */}
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <div className="mobile-nav-buttons">
                <button className="btn btn-outline" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Login</button>
                <button className="btn btn-primary" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>Get Started</button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        {/* Floating particles background */}
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">
            <Sparkles size={14} style={{ marginRight: '6px' }} /> Get ₦200 instant signup bonus
          </div>
          <h1>Earn Rewards for Simple Social & Survey Tasks</h1>
          <p>
            CanYouWork connects brands with real users. Complete simple microtasks—follow on Instagram, share on Facebook, watch YouTube videos, or answer surveys—and earn real cash.
          </p>
          <div className="hero-cta-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Start Earning Now <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login?role=advertiser')}>
              Advertiser Login
            </button>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="hero-stat-box">
              <h3>{formatCount(counter1.count)}</h3>
              <p>Rewards Paid Out</p>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-box">
              <h3>{formatCount(counter2.count)}</h3>
              <p>Tasks Completed</p>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-box">
              <h3>{formatCount(counter3.count)}</h3>
              <p>Active Earners</p>
            </div>
          </div>
        </div>
        
        {/* High Fidelity Phone Dashboard Mockup */}
        <div 
          className="hero-visual" 
          style={{ position: 'relative', zIndex: 1 }}
          onMouseMove={handlePhoneMouseMove}
          onMouseLeave={handlePhoneMouseLeave}
        >
          <div className="phone-mockup-floating-wrapper">
            <div className="phone-mockup-frame">
              <div className="phone-speaker"></div>
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="phone-status-bar">
                  <span className="phone-time">09:41</span>
                  <div className="phone-status-icons">
                    <span style={{ fontSize: '10px', marginRight: '4px' }}>📶</span>
                    <span style={{ fontSize: '10px' }}>🔋</span>
                  </div>
                </div>
                
                <div className="phone-app-header">
                  <div className="phone-user-profile">
                    <div className="phone-user-avatar">JG</div>
                    <div className="phone-user-info">
                      <span className="phone-username">john_goodluck</span>
                      <span className="phone-badge-verify">Verified Account</span>
                    </div>
                  </div>
                  <div className="phone-bell-icon">🔔</div>
                </div>
                
                <div className="phone-balance-card">
                  <span className="card-label">Main Balance</span>
                  <span className="card-amount">₦2,450.00</span>
                  <div className="card-sub-stats">
                    <span>Pending: ₦300.00</span>
                    <span>Streak: 5 🔥</span>
                  </div>
                </div>
                
                <div className="phone-section-title">
                  <span>Active Microtasks</span>
                  <span className="view-all">All (6)</span>
                </div>
                
                <div className="phone-tasks-list">
                  <div className="phone-task-item">
                    <div className="task-brand-icon instagram">IG</div>
                    <div className="task-details">
                      <span className="task-title">Follow @canyuwork</span>
                      <span className="task-reward">+₦15.00</span>
                    </div>
                    <button className="phone-task-btn">Start</button>
                  </div>
                  
                  <div className="phone-task-item">
                    <div className="task-brand-icon youtube">YT</div>
                    <div className="task-details">
                      <span className="task-title">Like Promo Video</span>
                      <span className="task-reward">+₦12.00</span>
                    </div>
                    <button className="phone-task-btn">Start</button>
                  </div>
  
                  <div className="phone-task-item premium">
                    <div className="task-brand-icon lucky">🎁</div>
                    <div className="task-details">
                      <span className="task-title">Lucky Reward Task</span>
                      <span className="task-reward highlight">+₦10,000.00</span>
                    </div>
                    <button className="phone-task-btn claim">Claim</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Bar */}
      <section className="brand-logos-bar">
        <div className="brand-logos-track">
          <div className="brand-logos-group">
            {brandNames.map((name, idx) => (
              <span className="brand-logo-text" key={idx}>{name}</span>
            ))}
          </div>
          <div className="brand-logos-group" aria-hidden="true">
            {brandNames.map((name, idx) => (
              <span className="brand-logo-text" key={idx}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features — scroll reveal + 3D tilt */}
      <section id="features" className="landing-features-section">
        <div className="section-header-center scroll-reveal" data-reveal-delay="0">
          <h2>Why Choose CanYouWork?</h2>
          <p>We offer the most user-friendly microtask experience with zero advertiser hurdles.</p>
        </div>
        <div className="features-grid">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div className="feature-card-wrapper scroll-reveal" data-reveal-delay={idx * 100} key={idx}>
                <div className="feature-card-inner">
                  <div className="feature-card-front">
                    <div className="feature-icon-container">
                      <Icon size={24} className="feature-icon" />
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                    <div className="flip-hint">Learn details ↺</div>
                  </div>
                  <div className="feature-card-back">
                    <div className="feature-icon-container">
                      <Icon size={24} className="feature-icon" />
                    </div>
                    <h3>{f.title}</h3>
                    <p className="expanded-desc">{f.backDesc}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Task Categories Grid — scroll reveal */}
      <section className="categories-section">
        <div className="section-header-center scroll-reveal" data-reveal-delay="0">
          <h2>Earn From Multiple Channels</h2>
          <p>We support various microtask categories to maximize your daily earnings.</p>
        </div>
        <div className="categories-grid">
          {[
            { code: 'IG', name: 'Instagram Tasks', sub: 'Likes, Comments, Follows', bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
            { code: 'FB', name: 'Facebook Tasks', sub: 'Page Likes, Shares, Comments', bg: '#1877f2' },
            { code: 'YT', name: 'YouTube Tasks', sub: 'Subscribes, Likes, Watch Time', bg: '#ff0000' },
            { code: 'TG', name: 'Telegram Tasks', sub: 'Channel Joins, Group Invites', bg: '#0088cc' },
            { code: 'TK', name: 'TikTok Tasks', sub: 'Video Likes, Follows, Shares', bg: '#000000' },
            { code: 'SV', name: 'Market Surveys', sub: 'Simple Forms, Opinion Polls', bg: '#10b981' }
          ].map((cat, idx) => (
            <div className="category-card scroll-reveal" data-reveal-delay={idx * 60} key={idx}>
              <div className="category-icon-wrapper" style={{ background: cat.bg, color: 'white' }}>
                {cat.code}
              </div>
              <h4>{cat.name}</h4>
              <p>{cat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works — scroll reveal with slide-left */}
      <section id="how-it-works" className="landing-how-section">
        <div className="section-header-center scroll-reveal" data-reveal-delay="0">
          <h2>Get Started in 4 Easy Steps</h2>
          <p>It takes less than 3 minutes to set up your account and start claiming active tasks.</p>
        </div>
        <div className="steps-container">
          {steps.map((s, idx) => (
            <div className="step-card scroll-reveal reveal-left" data-reveal-delay={idx * 120} key={idx}>
              <div className="step-number">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fraud Warning / Safety Banner — scroll reveal */}
      <section className="safety-banner-section scroll-reveal">
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

      {/* Testimonials — scroll reveal with scale */}
      <section id="testimonials" className="landing-testimonials-section">
        <div className="section-header-center scroll-reveal" data-reveal-delay="0">
          <h2>What Our Earners Say</h2>
          <p>Join thousands of users who earn pocket money daily during their free time.</p>
        </div>
        <div className="testimonials-grid">
          {[
            { text: '"CanYouWork is incredibly easy. I follow some pages on Instagram during my daily commute and get paid direct to my bank account. Highly recommended!"', name: 'Tunde A.', loc: 'Lagos, Nigeria', initial: 'T' },
            { text: '"The referral commissions are amazing! I invited 10 friends, and now I earn passive income as they complete tasks, plus milestone bonuses. Best microtask site!"', name: 'Sarah J.', loc: 'Johannesburg, SA', initial: 'S' },
            { text: '"I received a Lucky Task of ₦5,000 for filling out a simple marketing survey. I couldn\'t believe it when it was approved and credited within 2 hours."', name: 'Michael B.', loc: 'Nairobi, Kenya', initial: 'M' }
          ].map((t, idx) => (
            <div className="testimonial-card scroll-reveal reveal-scale" data-reveal-delay={idx * 120} key={idx}>
              <p>{t.text}</p>
              <div className="testimonial-user">
                <div className="user-avatar-placeholder">{t.initial}</div>
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter — scroll reveal */}
      <section className="landing-newsletter-section">
        <div className="newsletter-card scroll-reveal">
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
