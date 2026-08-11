import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { FiUser, FiKey, FiMail, FiShield, FiLock, FiLogOut } from 'react-icons/fi';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showSuccess('Password updated successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary-500/20 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'User'}</h1>
              <Badge status={user?.role}>{user?.role}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">{user?.email}</p>
            <p className="text-xs text-primary-600 font-bold mt-2 flex items-center">
              <FiShield className="w-3.5 h-3.5 mr-1" /> Authenticated Session
            </p>
          </div>
        </div>

        <Button onClick={logout} variant="danger" icon={FiLogOut}>
          Logout
        </Button>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-6">
          <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
            <FiKey className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Security & Change Password</h3>
            <p className="text-xs text-slate-400">Update your access key to secure your corporate account</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={FiLock}
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={FiLock}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={FiLock}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
