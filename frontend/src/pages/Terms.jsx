import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <header className="legal-header">
        <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
        </button>
        <h2>Terms of Service</h2>
      </header>

      <div className="legal-content scroll-reveal" data-reveal-delay="0">
        <p><strong>Last Updated:</strong> May 2026</p>

        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using CanYouWork, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>

        <h3>2. Description of Service</h3>
        <p>CanYouWork provides an online platform where users (Earners) can complete microtasks provided by other users or companies (Advertisers) in exchange for monetary rewards. We act as a middleman and guarantee payouts for correctly completed tasks.</p>

        <h3>3. User Accounts</h3>
        <ul>
          <li>You must provide accurate and complete registration information.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>We reserve the right to terminate accounts that violate our fair play policies (e.g., using VPNs, bots, or submitting fake proof).</li>
        </ul>

        <h3>4. Fair Play & Anti-Fraud Policy</h3>
        <p>All task submissions are subject to review. Fraudulent activities, including but not limited to the use of automated scripts, multiple accounts, VPN/Proxy usage, or submitting doctored screenshots, will result in immediate and permanent account suspension without payout.</p>

        <h3>5. Earnings and Withdrawals</h3>
        <p>Earnings are credited to your account balance upon successful verification of task completion. Withdrawals can be requested once the minimum threshold is met. Processing times may vary based on the chosen payment method.</p>

        <h3>6. Modifications to Service</h3>
        <p>CanYouWork reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice. You agree that CanYouWork shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.</p>

        <h3>7. Governing Law</h3>
        <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which CanYouWork operates.</p>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
