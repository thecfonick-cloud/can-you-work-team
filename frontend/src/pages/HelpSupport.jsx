import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, AlertCircle, CheckCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';

const HelpSupport = () => {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  
  // Contact state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const faqs = [
    {
      q: 'How long does task verification take?',
      a: 'Microtask verifications are handled manually by admins to prevent fraud. They are typically reviewed and approved within 1 to 24 hours of submission. Once approved, the reward amount credits to your available wallet balance immediately.'
    },
    {
      q: 'What is the minimum withdrawal amount?',
      a: 'The minimum withdrawal limit depends on the payout method. PayPal payouts have a minimum limit of $1.00 (₦1,500). Other gateways (Bank Transfer, USDT, BTC, Payoneer) require a minimum threshold of $5.00 (₦7,500).'
    },
    {
      q: 'Can I create multiple accounts to earn more?',
      a: 'No. CanYouWork enforces a strict one-account-per-device/IP address rule. Our system utilizes advanced IP checking and device fingerprinting to detect duplicate registrations. Violations will result in immediate permanent suspension of all related accounts and forfeiture of balances.'
    },
    {
      q: 'How does the referral commission milestone work?',
      a: 'When someone signs up using your link, you get a lifetime 10% commission on all their approved microtask rewards. In addition, you get milestone bonuses: ₦200 when they complete their first task, and another ₦300 when they complete their fifth task (₦500 maximum milestone per referred friend).'
    },
    {
      q: 'What should I do if my submission is rejected?',
      a: 'Submissions are rejected if the screenshot proof is invalid, cropped, blurry, or if the social media username handle provided does not match. Please verify that your profiles are public and that you followed all guidelines before submitting. If you feel it was a mistake, you can contact the admin team below.'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!emailSubject || !emailBody) {
      setMsg({ type: 'error', text: 'All contact fields are required.' });
      return;
    }

    setSubmitting(true);
    setMsg({ type: '', text: '' });
    
    // Simulate contact success
    setTimeout(() => {
      setSubmitting(false);
      setMsg({ type: 'success', text: 'Your support ticket has been sent to the admin. We will reply to your email within 12 hours.' });
      setEmailSubject('');
      setEmailBody('');
    }, 1000);
  };

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="help-support-view-layout">
      {/* Search Header */}
      <div className="help-search-banner-card card">
        <div className="search-banner-glow"></div>
        <div className="search-banner-content">
          <h2>How can we help you today?</h2>
          <p>Search our knowledgebase or contact support for assistance.</p>
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search questions, withdrawal terms, referral rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid of categories */}
      <div className="help-categories-grid">
        <div className="card category-box">
          <HelpCircle size={24} className="text-indigo" />
          <h4>Getting Started</h4>
          <p>Learn how to register, link social accounts, and claim tasks.</p>
        </div>
        <div className="card category-box">
          <Mail size={24} className="text-success" />
          <h4>Withdrawals & Fees</h4>
          <p>Details about payment limits, transaction times, and gateway instructions.</p>
        </div>
        <div className="card category-box">
          <MessageSquare size={24} className="text-warning" />
          <h4>Safety & Violations</h4>
          <p>Rules regarding proxy detection, duplicate signups, and proof reviews.</p>
        </div>
      </div>

      {/* Split Row: FAQs vs Contact Form */}
      <div className="help-split-row">
        {/* FAQs section */}
        <div className="card faqs-card split-col">
          <h3>Frequently Asked Questions</h3>
          <p className="subtitle-text">Quick answers to common questions about the platform.</p>

          <div className="faqs-accordion-list">
            {filteredFaqs.length === 0 ? (
              <p className="no-faqs-text text-muted">No matches found for "{search}". Try other keywords.</p>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                    <div 
                      className="faq-question-header"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <h4>{faq.q}</h4>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {isOpen && (
                      <div className="faq-answer-body">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact Form section */}
        <div className="card contact-form-card split-col">
          <h3>Contact Support Admin</h3>
          <p className="subtitle-text">Anyone wanting to run advertising campaigns or report issues must submit details here.</p>

          {msg.text && (
            <div className={`auth-alert alert-${msg.type}`}>
              {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              <span>{msg.text}</span>
            </div>
          )}

          <form className="contact-support-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject / Issue Area</label>
              <input
                type="text"
                id="subject"
                placeholder="e.g. Campaign Promotion inquiry, Withdrawal delay"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="body-text">Detailed Message</label>
              <textarea
                id="body-text"
                rows="5"
                placeholder="Describe your request in detail. Advertisers must provide details of their social profiles and campaign budgets..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                disabled={submitting}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full submit-ticket-btn" disabled={submitting}>
              {submitting ? 'Submitting ticket...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
