import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <h3 className="footer-brand-title">CanYouWork</h3>
            <p className="footer-brand-desc">
              The premier reward-based microtask platform. Complete social, survey, and app tasks to earn rewards daily.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon-btn"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-icon-btn"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon-btn"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon-btn"><i className="fab fa-telegram"></i></a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#tasks">Browse Tasks</a></li>
              <li><a href="#leaderboard">Leaderboard</a></li>
              <li><a href="#bonuses">Bonuses & Streaks</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Advertisers</h4>
            <ul>
              <li><a href="#campaigns">Promote Content</a></li>
              <li><a href="#contact">Contact Admin</a></li>
              <li><a href="#help">Advertising Guidelines</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Legal & Safety</h4>
            <ul>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#fraud">Fraud Prevention</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="copyright-text">&copy; 2026 CanYouWork Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>

        {/* Huge block text display at the very bottom */}
        <div className="footer-giant-text-container">
          <div className="footer-giant-text-scroller">
            <pre className="giant-ascii-logo">
{` ██████╗  █████╗ ███╗   ██╗██╗   ██╗ ██████╗ ██╗   ██╗██╗    ██╗  ██████╗  ██████╗  ██╗  ██╗
██╔════╝ ██╔══██╗████╗  ██║╚██╗ ██╔╝██╔═══██╗██║   ██║██║    ██║ ██╔═══██╗ ██╔══██╗ ██║  ██║
██║      ███████║██╔██╗ ██║ ╚████╔╝ ██║   ██║██║   ██║██║ █╗ ██║ ██║   ██║ ██████╔╝ ███████║
██║      ██╔══██║██║╚██╗██║  ╚██╔╝  ██║   ██║██║   ██║██║███╗██║ ██║   ██║ ██╔══██╗ ██╔══██║
╚██████╗ ██║  ██║██║ ╚████║   ██║   ╚██████╔╝╚██████╔╝╚███╔███╔╝ ╚██████╔╝ ██║  ██║ ██║  ██║
 ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝  ╚═════╝  ╚══╝╚══╝   ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝`}
            </pre>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
