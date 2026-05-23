import React, { useState, useEffect } from 'react';
import { Trophy, Award, Users, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../api';

const Leaderboard = ({ user }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const res = await api.getLeaderboard();
    if (res.success) {
      setData(res);
    }
  };

  if (!data) {
    return <div className="loading-spinner-container">Loading Leaderboard Rankings...</div>;
  }

  const { stats, topRewards, currentRank, list } = data;

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  };

  return (
    <div className="leaderboard-view-container">
      {/* Top Banner stats */}
      <div className="leaderboard-stats-grid">
        <div className="card leader-stat-widget">
          <Trophy className="widget-trophy" size={24} />
          <div className="widget-details">
            <span className="label">Total Paid Rewards</span>
            <h3>₦{stats.totalRewardsPaid.toLocaleString()}</h3>
          </div>
        </div>

        <div className="card leader-stat-widget">
          <Users className="widget-trophy" size={24} />
          <div className="widget-details">
            <span className="label">Active Members</span>
            <h3>{stats.totalUsers.toLocaleString()}</h3>
          </div>
        </div>

        <div className="card leader-stat-widget">
          <Award className="widget-trophy" size={24} />
          <div className="widget-details">
            <span className="label">Microtasks Verified</span>
            <h3>{stats.totalTasksCompleted.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Rewards details banner */}
      <div className="card leaderboard-payout-info-card">
        <div className="info-glow"></div>
        <div className="info-layout">
          <Sparkles className="info-icon" size={28} />
          <div className="info-text">
            <h3>Leaderboard Reward Multiplier</h3>
            <p>
              Get top positions at the end of the month to unlock cash bonuses! 1st Place: <strong>₦{topRewards.firstPlace.toLocaleString()}</strong>, 2nd Place: <strong>₦{topRewards.secondPlace.toLocaleString()}</strong>, 3rd Place: <strong>₦{topRewards.thirdPlace.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="leaderboard-rankings-card card">
        <div className="rankings-header-row">
          <h3>Top Earners Ledger</h3>
          <span className="updated-badge"><span className="pulse-dot"></span> Live updates</span>
        </div>

        {/* User's own rank card overlay */}
        {currentRank && (
          <div className="user-own-rank-highlight-strip">
            <div className="rank-badge-item">
              <span className="rank-num">#{currentRank.rank}</span>
              <span className="rank-label">Your Rank</span>
            </div>
            <div className="user-info-item">
              <strong>{currentRank.fullname}</strong>
              <p>@{currentRank.fullname.toLowerCase().replace(' ', '')}</p>
            </div>
            <div className="stat-item">
              <span className="label">Tasks Completed</span>
              <strong>{currentRank.tasksCompleted}</strong>
            </div>
            <div className="stat-item font-indigo">
              <span className="label">Earnings</span>
              <strong>₦{currentRank.totalEarnings.toLocaleString()}</strong>
            </div>
          </div>
        )}

        <div className="history-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Full Name</th>
                <th>Country</th>
                <th>Tasks Completed</th>
                <th>Total Earnings</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr 
                  key={item.rank} 
                  className={item.username === user?.username ? 'user-highlight-row' : ''}
                >
                  <td className={`rank-col-cell ${getRankBadgeClass(item.rank)}`}>
                    {item.rank <= 3 ? (
                      <span className="trophy-badge">{item.rank}</span>
                    ) : (
                      <span>#{item.rank}</span>
                    )}
                  </td>
                  <td className="user-name-cell">
                    <strong>{item.fullname}</strong>
                    <span className="user-handle">@{item.username}</span>
                  </td>
                  <td>{item.country}</td>
                  <td>{item.tasksCompleted.toLocaleString()}</td>
                  <td className="earnings-cell-val">₦{item.totalEarnings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
