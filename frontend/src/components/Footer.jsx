import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';

const FacebookIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <div className="logo-container footer-logo" onClick={() => navigate('/')}>
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </div>
              <span className="logo-text" style={{ color: '#ffffff', background: 'none', WebkitTextFillColor: 'initial' }}>
                CanYou<span style={{ color: '#8b5cf6' }}>Work</span>
              </span>
            </div>
            <p className="footer-brand-desc">
              The #1 platform that rewards you for completing simple tasks online. Work. Earn. Get Paid.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn"><FacebookIcon size={16} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn"><InstagramIcon size={16} /></a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="social-icon-btn"><Send size={16} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn"><TwitterIcon size={16} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn"><YoutubeIcon size={16} /></a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#tasks">Tasks</a></li>
              <li><a href="#earn">Earn</a></li>
              <li><a href="#advertise">Advertise</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>For Users</h4>
            <ul>
              <li><span onClick={() => navigate('/login')} className="footer-nav-link-btn">Log In</span></li>
              <li><span onClick={() => navigate('/register')} className="footer-nav-link-btn">Sign Up</span></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#refund">Refund Policy</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>For Advertisers</h4>
            <ul>
              <li><a href="#advertise">Advertise With Us</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-links-col subscribe-col">
            <h4>Subscribe</h4>
            <p className="subscribe-desc">Get the latest updates and earning tips straight to your mail.</p>
            <form className="footer-subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <div className="subscribe-input-wrapper">
                <Mail size={16} className="subscribe-mail-icon" />
                <input type="email" placeholder="Enter your email" required />
              </div>
              <button type="submit" className="btn btn-primary subscribe-submit-btn">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="copyright-text">&copy; 2026 CanYouWork. All Rights Reserved.</p>
          <div className="footer-payment-methods">
            <span className="pay-logo visa">VISA</span>
            <span className="pay-logo mastercard">
              <span className="mc-circles">
                <span className="mc-circle red"></span>
                <span className="mc-circle yellow"></span>
              </span>
              mastercard
            </span>
            <span className="pay-logo paypal">
              <span className="pp-italic">Pay</span>Pal
            </span>
            <span className="pay-logo verve">Verve</span>
            <span className="pay-logo opay">
              <span className="opay-dot"></span>OPay
            </span>
          </div>
        </div>

        {/* Huge centered CANYOUWORK text at the bottom */}
        <div className="footer-giant-logo-container">
          <span className="giant-canyou">CANYOU</span>
          <span className="giant-work">WORK</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
