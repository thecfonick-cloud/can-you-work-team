import { useState, useEffect } from 'react';
import { 
  Send,
  FileText,
  CheckSquare,
  ExternalLink,
  Upload,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);
import { api } from '../api';

const Tasks = ({ refreshUser }) => {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All Tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [socialUsername, setSocialUsername] = useState('');
  const [proofText, setProofText] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const filterTabs = [
    { name: 'All Tasks', value: 'all' },
    { name: 'Instagram', value: 'instagram' },
    { name: 'Facebook', value: 'facebook' },
    { name: 'YouTube', value: 'youtube' },
    { name: 'Telegram', value: 'telegram' }
  ];

  const fetchTasks = async () => {
    const filterVal = filterTabs.find(f => f.name === activeFilter)?.value || 'all';
    const res = await api.getTasks(filterVal);
    if (res.success) {
      setTasks(res.tasks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeFilter]);

  const getRemainingSlots = (t) => {
    if (t.targetCount !== undefined) return Math.max(0, t.targetCount - (t.currentCount || 0));
    if (t.subscribersRequired !== undefined) return Math.max(0, t.subscribersRequired - (t.subscribersCount || 0));
    return t.remainingSlots || 0;
  };

  const getTotalSlots = (t) => t.targetCount || t.subscribersRequired || t.totalSlots || 1;
  const getReward = (t) => t.reward || t.rewardAmount || 2;
  const getTaskLink = (t) => t.socialLink || t.taskLink || '';
  const getTaskDesc = (t) => t.guidelines || t.description || '';

  const handleSelectTask = async (task) => {
    setSelectedTask(task);
    setSocialUsername('');
    setProofText('');
    setProofFile(null);
    setMsg({ type: '', text: '' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (selectedTask.requiredProof.username && !socialUsername) {
      setMsg({ type: 'error', text: 'Social media username handle is required.' });
      return;
    }

    if (selectedTask.requiredProof.screenshot && !proofFile) {
      setMsg({ type: 'error', text: 'Screenshot proof file is required.' });
      return;
    }

    setSubmitting(true);
    const res = await api.submitProof(
      selectedTask._id,
      socialUsername,
      proofText,
      proofFile
    );
    setSubmitting(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Proof submitted successfully! It will be reviewed by an admin shortly.' });
      if (refreshUser) refreshUser();
      // Remove task or reload lists
      fetchTasks();
      setTimeout(() => {
        setSelectedTask(null);
      }, 3000);
    } else {
      setMsg({ type: 'error', text: res.message || 'Error submitting proof.' });
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="platform-icon text-instagram" size={18} />;
      case 'facebook':
        return <Facebook className="platform-icon text-facebook" size={18} />;
      case 'youtube':
        return <Youtube className="platform-icon text-youtube" size={18} />;
      case 'telegram':
        return <Send className="platform-icon text-telegram" size={18} />;
      default:
        return <FileText className="platform-icon text-neutral" size={18} />;
    }
  };

  return (
    <div className="tasks-page-layout">
      <div className="tasks-main-content">
        {/* Filters */}
        <div className="tasks-filter-bar">
          {filterTabs.map((tab) => (
            <button
              key={tab.name}
              className={`filter-tab-btn ${activeFilter === tab.name ? 'active' : ''}`}
              onClick={() => {
                setActiveFilter(tab.name);
                setSelectedTask(null);
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Horizontal Row List */}
        <div className="tasks-grid-list">
          {tasks.length === 0 ? (
            <div className="empty-tasks-placeholder">
              <CheckSquare size={48} className="text-muted" />
              <h3>No tasks available in this category</h3>
              <p>Check back later or browse other social campaigns.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task._id} 
                className={`task-row-item card ${selectedTask && selectedTask._id === task._id ? 'selected' : ''}`}
                onClick={() => handleSelectTask(task)}
              >
                <div className="task-platform-avatar-wrapper">
                  {getPlatformIcon(task.platform)}
                </div>
                
                <div className="task-row-details">
                  <div className="task-row-tags">
                    <span className="task-tag platform-tag">{task.platform}</span>
                    <span className="task-tag category-tag">{task.category || 'Campaign'}</span>
                  </div>
                  <h3 className="task-row-title">{task.title}</h3>
                  <p className="task-row-desc">{getTaskDesc(task)}</p>
                </div>

                <div className="task-row-slots">
                  <div className="slots-text-row">
                    <span>Remaining Slots: <strong>{getRemainingSlots(task).toLocaleString()}</strong> / {getTotalSlots(task).toLocaleString()}</span>
                  </div>
                  <div className="slots-progress-bar">
                    <div 
                      className="slots-progress-fill" 
                      style={{ width: `${Math.min(100, Math.max(0, ((getTotalSlots(task) - getRemainingSlots(task)) / getTotalSlots(task)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="task-row-action">
                  <span className="task-reward-amount-green">₦{getReward(task).toLocaleString()}</span>
                  <button className="btn btn-secondary btn-sm start-task-btn-row">Start Task</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Slide Drawer Panel */}
      {selectedTask && (
        <div className="task-detail-panel">
          <div className="panel-header">
            <div>
              <h3>Task Verification</h3>
              <span className="panel-subtitle">{selectedTask.platform} Campaign</span>
            </div>
            <button className="panel-close-btn" onClick={() => setSelectedTask(null)}>
              <X size={20} />
            </button>
          </div>

          <div className="panel-body">
            <div className="detail-meta-row">
              <span className="detail-platform">{selectedTask.platform.toUpperCase()} TASK</span>
              <span className="detail-reward-amount">₦{getReward(selectedTask).toLocaleString()}</span>
            </div>

            <h2 className="detail-title">{selectedTask.title}</h2>
            <p className="detail-desc">{getTaskDesc(selectedTask)}</p>

            {/* Note Warning Highlight Box */}
            <div className="task-warning-highlight-box">
              <AlertCircle size={20} className="warning-icon" />
              <div className="warning-text">
                <strong>Attention Earner:</strong> Ensure your social profile matches the username provided, is public, and the screenshot is complete. Failure to follow instructions exactly will result in zero reward.
              </div>
            </div>

            {/* Styled Instruction Circle Steps */}
            <div className="detail-section">
              <h4>Required Steps:</h4>
              <div className="instructions-step-list">
                {selectedTask.instructions ? selectedTask.instructions.map((ins, index) => (
                  <div key={index} className="instruction-step-item">
                    <div className="step-circle-number">{index + 1}</div>
                    <div className="step-text-content">{ins}</div>
                  </div>
                )) : (
                  <div className="instruction-step-item">
                    <div className="step-circle-number">1</div>
                    <div className="step-text-content">{getTaskDesc(selectedTask)}</div>
                  </div>
                )}
              </div>
            </div>

            {getTaskLink(selectedTask) && (
              <a 
                href={getTaskLink(selectedTask)} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary task-link-button"
              >
                Go to Campaign Link <ExternalLink size={16} style={{ marginLeft: '6px' }} />
              </a>
            )}

            <div className="detail-divider"></div>

            {/* Proof Submission form */}
            <form className="proof-submission-form" onSubmit={handleSubmitProof}>
              <h4>Submit Proof Details:</h4>

              {msg.text && (
                <div className={`auth-alert alert-${msg.type}`}>
                  {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                  <span>{msg.text}</span>
                </div>
              )}

              {(!selectedTask.requiredProof || selectedTask.requiredProof.username !== false) && (
                <div className="form-group">
                  <label htmlFor="social-handle">Your Social Handle / Username (Public)</label>
                  <input
                    type="text"
                    id="social-handle"
                    placeholder="e.g. @john_earner"
                    value={socialUsername}
                    onChange={(e) => setSocialUsername(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="proof-text">Proof Comment / Details (Optional)</label>
                <textarea
                  id="proof-text"
                  rows="2"
                  placeholder="Provide any additional account usernames or notes..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>

              {(!selectedTask.requiredProof || selectedTask.requiredProof.screenshot !== false) && (
                <div className="form-group">
                  <label>Screenshot Verification Proof</label>
                  <div className="file-upload-drag-area">
                    {proofFile ? (
                      <div className="file-upload-preview-container">
                        <div className="file-preview-info">
                          <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                          <span className="file-name-text">{proofFile.name}</span>
                        </div>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setProofFile(null)}
                          style={{ marginTop: '0.5rem' }}
                        >
                          Change Screenshot
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          id="screenshot-file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          disabled={submitting}
                        />
                        <label htmlFor="screenshot-file" className="file-upload-label" style={{ cursor: 'pointer' }}>
                          <Upload size={32} className="text-primary" style={{ marginBottom: '0.5rem' }} />
                          <span>Click to browse and upload screenshot</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG or JPEG allowed</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Checklist */}
              <div className="drawer-verification-checklist">
                <h5>Verification Checklist</h5>
                <label className="checkbox-item">
                  <input type="checkbox" required disabled={submitting} />
                  <span>I followed all steps in the campaign instruction.</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" required disabled={submitting} />
                  <span>I will not unfollow/unlike after receiving rewards.</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full submit-proof-btn" 
                disabled={submitting}
                style={{ marginTop: '1.5rem' }}
              >
                {submitting ? 'Uploading Proof...' : 'Submit Verification Proof'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
