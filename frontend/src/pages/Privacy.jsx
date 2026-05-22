import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <header className="legal-header">
        <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
        </button>
        <h2>Privacy Policy</h2>
      </header>

      <div className="legal-content scroll-reveal" data-reveal-delay="0">
        <p><strong>Last Updated:</strong> May 2026</p>

        <h3>1. Information We Collect</h3>
        <p>When you register on CanYouWork, we collect personal information such as your name, email address, phone number, and payment details (e.g., bank account or PayPal email for withdrawals). We also collect data regarding your tasks, IP address, and device information for security and anti-fraud purposes.</p>

        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our platform.</li>
          <li>Process transactions and send related information (e.g., withdrawal confirmations).</li>
          <li>Detect and prevent fraud, spam, and abuse of the platform.</li>
          <li>Communicate with you regarding updates, customer support, and marketing (if opted in).</li>
        </ul>

        <h3>3. Data Sharing and Security</h3>
        <p>We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.</p>
        <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information and data stored on our platform.</p>

        <h3>4. Third-Party Links</h3>
        <p>Our platform contains links to third-party websites (e.g., social media platforms for completing tasks). We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our platform.</p>

        <h3>5. Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law.</p>

        <h3>6. Changes to This Privacy Policy</h3>
        <p>CanYouWork has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our site and revise the updated date at the bottom of this page.</p>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;
