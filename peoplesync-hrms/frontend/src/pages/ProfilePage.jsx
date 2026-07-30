import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import { User, Lock, Bell, Camera, Shield, Save } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('general'); // 'general', 'security', 'notifications'

  // General Form State
  const [profileData, setProfileData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: '+1 (555) 234-5678',
    location: currentUser.location || 'San Francisco, CA',
    avatar: currentUser.avatar,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    showToast({ message: 'Profile details updated successfully!', type: 'success' });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast({ message: 'New passwords do not match!', type: 'danger' });
      return;
    }
    showToast({ message: 'Password changed successfully!', type: 'success' });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatar: url }));
      showToast({ message: 'New avatar preview loaded!', type: 'info' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Account Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal profile, photo, security credentials, and email notifications.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-border-dark pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-primary text-white shadow-soft dark:bg-accent'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" /> Personal Details
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-primary text-white shadow-soft dark:bg-accent'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          <Lock className="w-4 h-4" /> Password & Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'notifications'
              ? 'bg-primary text-white shadow-soft dark:bg-accent'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          <Bell className="w-4 h-4" /> Notification Alerts
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <Card title="General Profile Information">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-border-dark">
              <div className="relative group">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-20 h-20 rounded-3xl object-cover ring-4 ring-primary/20 shadow-md"
                />
                <label className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                  <Camera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-text dark:text-gray-100">Profile Photo</h4>
                <p className="text-xs text-gray-400 mt-0.5">Click photo to upload a custom avatar image.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
              <FormInput
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
              <FormInput
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
              <FormInput
                label="Primary Office Location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-border-dark">
              <Button type="submit" variant="primary" icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title="Change Password">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <FormInput
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
            <FormInput
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              showPasswordStrength={true}
              required
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-border-dark">
              <Button type="submit" variant="primary" icon={Shield}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card title="Email & Push Preference Toggles">
          <div className="space-y-4">
            {[
              { title: 'Leave Approvals & Status Updates', desc: 'Receive instant email when your leave request is approved or rejected.' },
              { title: 'Monthly Payroll Disbursal', desc: 'Receive digital payslip notifications on payroll generation.' },
              { title: 'System Security Alerts', desc: 'Alerts when a new device logs into your PeopleSync account.' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <div>
                  <h5 className="text-xs font-bold text-slate-text dark:text-gray-200">{item.title}</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary/30" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
