import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { changePassword } from '@/services/api.services'
import { showToast } from '@/utils/toast'

const Account = () => {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { user } = useAuthStore()

    const [formData, setFormData] = useState({
        accountDetails: {
            email: '',
            username: '',
            accountId: ''
        },
        password: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        twoFactorAuth: {
            enabled: false,
            description: 'Add an extra layer of security to your account.'
        }
    })

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                accountDetails: {
                    email: user.emailAddress || '',
                    username: user.artistName || '',
                    accountId: user.accountId || ''
                }
            }))
        }
    }, [user])

    const handleAccountDetailsChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            accountDetails: {
                ...prev.accountDetails,
                [field]: value
            }
        }))
    }

    const handlePasswordChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            password: {
                ...prev.password,
                [field]: value
            }
        }))
    }

    const handleSaveAccountDetails = async () => {
        setSaving(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log('Saving account details:', formData.accountDetails)
            alert('Account details saved successfully!')
        } catch (error) {
            console.error('Error saving account details:', error)
            alert('Error saving account details. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async () => {
        if (formData.password.newPassword !== formData.password.confirmPassword) {
            showToast.error('New password and confirm password do not match!')
            return
        }

        if (formData.password.newPassword.length < 6) {
            showToast.error('Password must be at least 6 characters long!')
            return
        }

        setSaving(true)
        try {
            await changePassword({
                currentPassword: formData.password.currentPassword,
                newPassword: formData.password.newPassword,
                confirmPassword: formData.password.confirmPassword
            })

            setFormData((prev) => ({
                ...prev,
                password: {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }
            }))

            showToast.success('Password updated successfully!')
        } catch (error) {
            console.error('Error updating password:', error)
            showToast.error(error?.response?.data?.message || 'Error updating password. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleToggle2FA = async (enabled) => {
        setSaving(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setFormData((prev) => ({
                ...prev,
                twoFactorAuth: {
                    ...prev.twoFactorAuth,
                    enabled: enabled
                }
            }))

            console.log('2FA toggled:', enabled)
            alert(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully!`)
        } catch (error) {
            console.error('Error toggling 2FA:', error)
            alert('Error updating two-factor authentication. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading account data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <Card className="border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <CardTitle>Account Details</CardTitle>
                    </div>
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Account ID</label>
                        <Input
                            value={formData.accountDetails.accountId}
                            placeholder="MV-XXXXXX"
                            disabled
                            className="border-slate-700 font-mono"
                        />
                    </div>
                    
                </CardContent>
            </Card>

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
                                type={showCurrentPassword ? 'text' : 'password'}
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
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? 'text' : 'password'}
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
                                    onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
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
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleUpdatePassword}
                        disabled={
                            saving || !formData.password.currentPassword || !formData.password.newPassword || !formData.password.confirmPassword
                        }
                        className="bg-purple-600 text-white hover:bg-purple-700">
                        {saving ? 'Updating...' : 'Update Password'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default Account
