import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Lock, Phone, Globe, Send, AlertCircle, CheckCircle } from 'lucide-react';

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);
import { api } from '../api';

const Settings = ({ refreshUser }) => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  
  // Social usernames
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [telegram, setTelegram] = useState('');
  const [youtube, setYoutube] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [activeTab, setActiveTab] = useState('profile');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    const res = await api.getProfile();
    if (res.success) {
      const u = res.user;
      setFullname(u.fullname || '');
      setUsername(u.username || '');
      setEmail(u.email || '');
      setPhone(u.phone || '');
      setCountry(u.country || '');
      
      if (u.socialAccounts) {
        setInstagram(u.socialAccounts.instagramUsername || '');
        setTiktok(u.socialAccounts.tiktokUsername || '');
        setTwitter(u.socialAccounts.twitterUsername || '');
        setFacebook(u.socialAccounts.facebookUsername || '');
        setTelegram(u.socialAccounts.telegramUsername || '');
        setYoutube(u.socialAccounts.youtubeChannel || '');
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    const socialAccounts = {
      instagramUsername: instagram,
      tiktokUsername: tiktok,
      twitterUsername: twitter,
      facebookUsername: facebook,
      telegramUsername: telegram,
      youtubeChannel: youtube
    };

    const res = await api.updateProfile(
      fullname,
      username,
      email,
      phone,
      country,
      socialAccounts
    );
    setSaving(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Profile details saved successfully!' });
      if (refreshUser) refreshUser();
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } else {
      setMsg({ type: 'error', text: res.message || 'Error updating profile details.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSaving(true);
    // Simulate endpoint success
    setTimeout(() => {
      setSaving(false);
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    }, 1000);
  };

  return (
    <div className="settings-page-view-container">
      {/* Tab navigation */}
      <div className="settings-tab-bar card">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setMsg({ type: '', text: '' }); }}
        >
          <User size={16} /> Profile Details
        </button>
        <button 
          className={`tab-btn ${activeTab === 'socials' ? 'active' : ''}`}
          onClick={() => { setActiveTab('socials'); setMsg({ type: '', text: '' }); }}
        >
          <Instagram size={16} /> Social Handles
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => { setActiveTab('security'); setMsg({ type: '', text: '' }); }}
        >
          <ShieldCheck size={16} /> Account Security
        </button>
      </div>

      <div className="settings-form-layout card">
        {msg.text && (
          <div className={`auth-alert alert-${msg.type}`}>
            {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        {activeTab === 'profile' && (
          <form className="settings-profile-form" onSubmit={handleUpdateProfile}>
            <h3>Personal Information</h3>
            <p className="subtitle-text">Keep your email and phone details updated to ensure smooth payouts.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary save-btn" disabled={saving}>
              {saving ? 'Saving Details...' : 'Save Profile Details'}
            </button>
          </form>
        )}

        {activeTab === 'socials' && (
          <form className="settings-socials-form" onSubmit={handleUpdateProfile}>
            <h3>Social Verification Links</h3>
            <p className="subtitle-text">Provide the user handles that will be used by admins to verify screenshot proof submissions.</p>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="instagram"><Instagram size={14} className="inline-icon text-instagram" /> Instagram Handle</label>
                <input
                  type="text"
                  id="instagram"
                  placeholder="@username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tiktok">TikTok Username</label>
                <input
                  type="text"
                  id="tiktok"
                  placeholder="@username"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="twitter">Twitter / X Username</label>
                <input
                  type="text"
                  id="twitter"
                  placeholder="@username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="facebook">Facebook Account Link</label>
                <input
                  type="text"
                  id="facebook"
                  placeholder="Profile URL or ID"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="telegram"><Send size={14} className="inline-icon text-telegram" /> Telegram Handle</label>
                <input
                  type="text"
                  id="telegram"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="youtube"><Youtube size={14} className="inline-icon text-youtube" /> YouTube Channel Link</label>
                <input
                  type="text"
                  id="youtube"
                  placeholder="Channel URL"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary save-btn" disabled={saving}>
              {saving ? 'Saving Links...' : 'Save Handles'}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form className="settings-security-form" onSubmit={handlePasswordChange}>
            <h3>Change Account Password</h3>
            <p className="subtitle-text">Keep your password strong and secure. Do not share your credentials.</p>

            <div className="form-group">
              <label htmlFor="current-pass">Current Password</label>
              <input
                type="password"
                id="current-pass"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="new-pass">New Password</label>
                <input
                  type="password"
                  id="new-pass"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-pass">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm-pass"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary save-btn" disabled={saving}>
              {saving ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
