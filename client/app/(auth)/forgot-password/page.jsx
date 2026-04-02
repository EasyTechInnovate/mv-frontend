"use client";
import React, { useState , useEffect} from 'react'
import { useRouter } from 'next/navigation'
import herobg from "@/public/images/mvadvertisement/herobg.png";
import Image from "next/image";
import signinimage from "@/public/images/signinimage.png";
import logo from "@/public/images/maheshwarilogo.svg";
import { forgotPassword } from '@/services/api.services'
import toast from 'react-hot-toast'
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval;
    if (isSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSent, timer]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await forgotPassword({ emailAddress })
      if (response.success) {
        toast.success(response.message || 'Reset link sent to your email!')
        setIsSent(true)
        setTimer(60)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isLoading) return;
    setIsLoading(true)
    try {
      const response = await forgotPassword({ emailAddress })
      if (response.success) {
        toast.success(response.message || 'Reset link resent successfully!')
        setTimer(60)
      }
    } catch (error) {
      console.error('Resend error:', error)
      toast.error(error.response?.data?.message || 'Failed to resend link.')
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${herobg.src})` }}
      className="w-screen h-screen max-md:h-fit bg-cover bg-center overflow-hidden p-20 max-sm:px-4 flex justify-center items-center gap-10 max-md:flex-col"
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
            Forgot Password
          </h2>
          
          {!isSent ? (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <p className="mb-4 text-gray-300">
                Enter your email address and we'll send you a link to reset your password. If you don't see it in your inbox, please check your spam folder.
              </p>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="emailAddress"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter your email"
                className="p-3 mb-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none"
                required
              />

              <button
                type="submit"
                className="bg-[#652CD6] mt-6 cursor-pointer hover:scale-[1.04] hover:bg-[#652CD6] rounded-full text-white py-3 px-12 font-semibold transition-all w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Send Reset Link'}
              </button>
              
              <Link href="/signin" className="text-[#652CD6] underline mt-4">
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xl font-semibold text-green-400">
                Reset link has been sent!
              </p>
              <p className="text-gray-300">
                Please check your email for the password reset link. It will expire in 1 hour. If you don't see it, please check your spam folder.
              </p>

              <div className="mt-2 text-sm">
                {timer > 0 ? (
                  <p className="text-gray-400">
                    Didn't receive the email? You can resend it in <span className="text-[#652CD6] font-semibold">{timer}s</span>
                  </p>
                ) : (
                  <button 
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-[#652CD6] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Resending...' : "Didn't receive the email? Resend Link"}
                  </button>
                )}
              </div>

              <Link href="/signin" className="bg-[#652CD6] mt-6 cursor-pointer hover:scale-[1.04] hover:bg-[#652CD6] rounded-full text-white py-3 px-12 font-semibold transition-all w-fit text-center">
                Back to Login
              </Link>
            </div>
          )}
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

export default ForgotPasswordPage;
