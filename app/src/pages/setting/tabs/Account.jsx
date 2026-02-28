import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Lock, 
  Shield, 
  Smartphone, 
  Eye, 
  EyeOff,
  Monitor,
  Laptop,
  Phone
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getSessions, revokeSession, revokeAllSessions, changePassword } from '@/services/api.services';
import { showToast } from '@/utils/toast';

const Account = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuthStore();

  // Form data state
  const [formData, setFormData] = useState({
    accountDetails: {
      email: '',
      username: ''
    },
    password: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    twoFactorAuth: {
      enabled: false,
      description: 'Add an extra layer of security to your account.'
    },
    activeSessions: []
  });

  // Fetch account data on component mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        accountDetails: {
          email: user.emailAddress || '',
          username: user.artistName || ''
        }
      }));
    }
    // This part can be adjusted to fetch session data separately if needed
    // For now, I'm keeping the mock session data logic.
    fetchSessionData();
  }, [user]);

  const fetchSessionData = async () => {
    setLoading(true);
    try {
      const response = await getSessions();
      
      const sessionList = response.data?.sessions?.map(session => ({
        id: session.sessionId,  // backend returns sessionId (numeric index), not _id
        device: session.deviceInfo?.browser ? `${session.deviceInfo.browser} on ${session.deviceInfo.os}` : 'Unknown Device',
        location: session.ipAddress || 'Unknown Location',
        status: session.isCurrentSession ? 'Current' : 'Active',
        lastActive: session.lastActivity ? new Date(session.lastActivity).toLocaleString() : 'Active now',
        icon: session.deviceInfo?.isMobile ? 'phone' : 'laptop',
        isCurrentSession: session.isCurrentSession
      })) || [];

      setFormData(prev => ({
        ...prev,
        activeSessions: sessionList
      }));
    } catch (error) {
      console.error('Error fetching session data:', error);
      showToast.error('Error loading session data');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      accountDetails: {
        ...prev.accountDetails,
        [field]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      password: {
        ...prev.password,
        [field]: value
      }
    }));
  };

  const handleSaveAccountDetails = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving account details:', formData.accountDetails);
      alert('Account details saved successfully!');
    } catch (error) {
      console.error('Error saving account details:', error);
      alert('Error saving account details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (formData.password.newPassword !== formData.password.confirmPassword) {
      showToast.error('New password and confirm password do not match!');
      return;
    }

    if (formData.password.newPassword.length < 6) {
      showToast.error('Password must be at least 6 characters long!');
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: formData.password.currentPassword,
        newPassword: formData.password.newPassword,
        confirmPassword: formData.password.confirmPassword
      });
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }));
      
      showToast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast.error(error?.response?.data?.message || 'Error updating password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async (enabled) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(prev => ({
        ...prev,
        twoFactorAuth: {
          ...prev.twoFactorAuth,
          enabled: enabled
        }
      }));
      
      console.log('2FA toggled:', enabled);
      alert(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      alert('Error updating two-factor authentication. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    const sessionToRevoke = formData.activeSessions.find(s => s.id === sessionId);
    if (sessionToRevoke?.isCurrentSession) {
      showToast.error('Cannot revoke current session!');
      return;
    }

    setSaving(true);
    try {
      await revokeSession(sessionId);
      
      setFormData(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
      }));
      
      showToast.success('Session revoked successfully!');
    } catch (error) {
      console.error('Error revoking session:', error);
      showToast.error(error?.response?.data?.message || 'Error revoking session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!window.confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device only.')) {
      return;
    }
    setSaving(true);
    try {
      await revokeAllSessions();
      // Remove all non-current sessions from local state
      setFormData(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(session => session.isCurrentSession)
      }));
      showToast.success('All other sessions have been revoked!');
    } catch (error) {
      console.error('Error revoking all sessions:', error);
      showToast.error(error?.response?.data?.message || 'Error revoking sessions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDeviceIcon = (iconType) => {
    switch (iconType) {
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'browser':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Account Details Section */}
      <Card className="border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Account Details</CardTitle>
          </div>
          {/* <Button 
            onClick={handleSaveAccountDetails}
            disabled={saving}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              value={formData.accountDetails.email}
              onChange={(e) => handleAccountDetailsChange('email', e.target.value)}
              placeholder="artist@example.com"
              disabled
              className="border-slate-700"
              type="email"
            />
          </div>
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={formData.accountDetails.username}
              onChange={(e) => handleAccountDetailsChange('username', e.target.value)}
              placeholder="artistname"
              className="border-slate-700"
            />
          </div> */}
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card className="border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <CardTitle>Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.password.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                className="border-slate-700 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.password.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  className="border-slate-700 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.password.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  className="border-slate-700 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleUpdatePassword}
            disabled={saving || !formData.password.currentPassword || !formData.password.newPassword || !formData.password.confirmPassword}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Section */}
      {/* <Card className="border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Enable 2FA</span>
                {formData.twoFactorAuth.enabled && (
                  <Badge className="bg-green-600 text-white">Enabled</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.twoFactorAuth.description}
              </p>
            </div>
            <Switch
              checked={formData.twoFactorAuth.enabled}
              onCheckedChange={handleToggle2FA}
              disabled={saving}
            />
          </div>
          {formData.twoFactorAuth.enabled && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Authenticator app connected</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use your authenticator app to generate verification codes
              </p>
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Active Sessions Section */}
      <Card className="border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              <CardTitle>Active Sessions</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllSessions}
              disabled={saving || formData.activeSessions.filter(s => !s.isCurrentSession).length === 0}
              className="border-red-600 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Revoke All Other Sessions
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage devices that are currently signed in to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.activeSessions.map((session) => (
            <div 
              key={session.id}
              className="flex items-center justify-between p-4 border border-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-4">
                {/* <Checkbox 
                  id={`session-${session.id}`}
                  disabled={session.isCurrentSession}
                /> */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/20 rounded-lg">
                    {getDeviceIcon(session.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.device}</span>
                      {session.isCurrentSession && (
                        <Badge className="bg-green-600 text-white text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{session.location}</span>
                      <span className="mx-2">•</span>
                      <span>{session.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRevokeSession(session.id)}
                disabled={session.isCurrentSession || saving}
                className="border-slate-600 text-red-400 hover:text-red-300 hover:border-red-400"
              >
                {session.isCurrentSession ? 'Current' : 'Revoke'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;