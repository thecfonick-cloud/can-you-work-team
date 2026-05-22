import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

const Refund = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <header className="legal-header">
        <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
        </button>
        <h2>Refund Policy</h2>
      </header>

      <div className="legal-content scroll-reveal" data-reveal-delay="0">
        <p><strong>Last Updated:</strong> May 2026</p>

        <h3>1. General Policy</h3>
        <p>At CanYouWork, customer satisfaction for our Advertisers is a top priority. Due to the nature of our microtask services, where funds are distributed directly to Earners upon task completion, our refund policy is strictly governed by the following conditions.</p>

        <h3>2. Advertiser Deposits</h3>
        <p>Funds deposited into an Advertiser wallet are used to fund campaigns. Unused funds remaining in an Advertiser's wallet may be eligible for a refund upon request, subject to a 10% processing fee. The minimum amount eligible for a refund request is ₦5,000.</p>

        <h3>3. Active Campaigns</h3>
        <p>Once a campaign is launched and funds are allocated to Earners who successfully complete tasks, those funds are non-refundable. If you cancel an active campaign, only the unspent budget (funds not yet paid to Earners) will be returned to your Advertiser wallet.</p>

        <h3>4. Disputed Tasks</h3>
        <p>If an Advertiser believes a task was approved in error or the submitted proof is invalid, they must raise a dispute within 48 hours of task approval. Our administrative team will review the dispute. If the dispute is resolved in favor of the Advertiser, the funds for that specific task will be returned to their wallet.</p>

        <h3>5. Processing Time</h3>
        <p>Approved refund requests will be processed within 5-10 business days. Refunds will be issued to the original payment method used for the deposit. In cases where the original payment method cannot accept refunds, an alternative method (such as bank transfer) will be arranged.</p>

        <h3>6. Account Terminations</h3>
        <p>If an account (Earner or Advertiser) is terminated due to violations of our Terms of Service (e.g., fraud, spam, abuse), any remaining wallet balance is forfeited and will not be refunded.</p>
        
        <h3>7. Contact Us</h3>
        <p>If you have any questions about our Refund Policy or wish to request a refund, please contact our support team via the Help & Support section or email support@canyuwork.com.</p>
      </div>
      
      <Footer />
    </div>
  );
};

export default Refund;
