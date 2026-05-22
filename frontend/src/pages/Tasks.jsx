import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Send, 
  FileText, 
  Users, 
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

  useEffect(() => {
    fetchTasks();
  }, [activeFilter]);

  const fetchTasks = async () => {
    const filterVal = filterTabs.find(f => f.name === activeFilter)?.value || 'all';
    const res = await api.getTasks(filterVal);
    if (res.success) {
      setTasks(res.tasks);
    }
  };

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

        {/* Grid List */}
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
                className={`task-item-card card ${selectedTask && selectedTask._id === task._id ? 'selected' : ''}`}
                onClick={() => handleSelectTask(task)}
              >
                <div className="task-item-header">
                  <div className="platform-badge-row">
                    {getPlatformIcon(task.platform)}
                    <span className="platform-name-label">{task.platform}</span>
                  </div>
                  <span className="reward-badge-pill">₦{task.rewardAmount}</span>
                </div>
                
                <h3 className="task-item-title">{task.title}</h3>
                <p className="task-item-desc">{task.description}</p>
                
                <div className="task-item-footer">
                  <span className="remaining-slots-label">
                    Slots: <strong>{task.remainingSlots.toLocaleString()}</strong> / {task.totalSlots.toLocaleString()}
                  </span>
                  <button className="btn btn-secondary btn-sm">Start Task</button>
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
            <h3>Task Details</h3>
            <button className="panel-close-btn" onClick={() => setSelectedTask(null)}>
              <X size={18} />
            </button>
          </div>

          <div className="panel-body">
            <div className="detail-meta-row">
              <span className="detail-platform">{selectedTask.platform.toUpperCase()} TASK</span>
              <span className="detail-reward">Earn ₦{selectedTask.rewardAmount}</span>
            </div>

            <h2 className="detail-title">{selectedTask.title}</h2>
            <p className="detail-desc">{selectedTask.description}</p>

            <div className="detail-section">
              <h4>Instructions:</h4>
              <ol className="instructions-list">
                {selectedTask.instructions.map((ins, index) => (
                  <li key={index}>{ins}</li>
                ))}
              </ol>
            </div>

            {selectedTask.taskLink && (
              <a 
                href={selectedTask.taskLink} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary task-link-button"
              >
                Go to Task Link <ExternalLink size={16} />
              </a>
            )}

            <div className="detail-divider"></div>

            {/* Proof Submission form */}
            <form className="proof-submission-form" onSubmit={handleSubmitProof}>
              <h4>Submit Proof:</h4>

              {msg.text && (
                <div className={`auth-alert alert-${msg.type}`}>
                  {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                  <span>{msg.text}</span>
                </div>
              )}

              {selectedTask.requiredProof.username && (
                <div className="form-group">
                  <label htmlFor="social-handle">Your Social Handle / Username</label>
                  <input
                    type="text"
                    id="social-handle"
                    placeholder="e.g. @john_doe"
                    value={socialUsername}
                    onChange={(e) => setSocialUsername(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="proof-text">Additional Notes (Optional)</label>
                <textarea
                  id="proof-text"
                  rows="2"
                  placeholder="Any details you want to add..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>

              {selectedTask.requiredProof.screenshot && (
                <div className="form-group">
                  <label>Screenshot Proof</label>
                  <div className="file-upload-drag-area">
                    <input
                      type="file"
                      id="screenshot-file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      disabled={submitting}
                    />
                    <label htmlFor="screenshot-file" className="file-upload-label">
                      <Upload size={24} className="text-muted" />
                      <span>{proofFile ? proofFile.name : 'Select or drag screenshot image'}</span>
                    </label>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary w-full submit-proof-btn" 
                disabled={submitting}
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
