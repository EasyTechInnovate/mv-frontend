"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import herobg from "@/public/images/mvadvertisement/herobg.png";
import Image from "next/image";
import signinimage from "@/public/images/signinimage.png";
import logo from "@/public/images/maheshwarilogo.svg";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { resetPassword } from '@/services/api.services'
import toast from 'react-hot-toast'
import Link from 'next/link';

const ResetPasswordContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.")
      router.push('/signin')
    }
  }, [token, router])

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    
    setIsLoading(true)
    try {
      const response = await resetPassword({ token, password, confirmPassword })
      if (response.success) {
        toast.success(response.message || 'Password reset successfully!')
        router.push('/signin')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error.response?.data?.message || 'Token expired or invalid.')
    } finally {
      setIsLoading(false)
    }
  };

  if (!token) return null;

  return (
    <div
      style={{ backgroundImage: `url(${herobg.src})` }}
      className="w-screen h-screen max-md:h-fit bg-cover bg-center overflow-hidden p-20 flex justify-center items-center gap-10 max-md:flex-col"
    >
      {/* Left Side - Form */}
      <div className="w-[55%] max-md:w-full h-full max-md:h-fit p-8 rounded-lg text-white flex flex-col gap-6 ">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logo}
            alt="maheshwarilogo"
            className="h-[80px] shrink-0 object-contain w-fit mb-6"
          />
        </Link>

        <div>
          <h2 className="text-4xl font-bold mb-6">
            Reset Password
          </h2>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <p className="mb-4 text-gray-300">
              Enter your new password below.
            </p>

            <div className="flex justify-between ">
              <label htmlFor="password">New Password</label>
              {passwordShow ? (
                <h1 className="flex items-center gap-1 cursor-pointer" onClick={() => setPasswordShow(false)}> <FiEyeOff/> Hide </h1>
              ) : (
                <h1 className="flex items-center gap-1 cursor-pointer" onClick={() => setPasswordShow(true)}><FiEye /> Show </h1>
              )}
            </div>
            <input
              id="password"
              type={passwordShow ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="p-3 mb-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none"
              required
              minLength={6}
            />

            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type={passwordShow ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="p-3 mb-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="bg-[#652CD6] mt-6 cursor-pointer hover:scale-[1.04] hover:bg-[#652CD6] rounded-full text-white py-3 px-12 font-semibold transition-all w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <Link href="/signin" className="text-[#652CD6] underline mt-4">
              Back to Login
            </Link>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-[45%] max-md:w-full h-full">
        <Image
          src={signinimage}
          alt="signinimage"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={null}>
    <ResetPasswordContent />
  </Suspense>
)

export default ResetPasswordPage;
