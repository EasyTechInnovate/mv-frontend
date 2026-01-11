"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import herobg from "@/public/images/mvadvertisement/herobg.png";
import Image from "next/image";
import signinimage from "@/public/images/signinimage.png";
import logo from "@/public/images/maheshwarilogo.svg";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { loginUser } from '@/services/api.services'
import toast from 'react-hot-toast'

const Page = () => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [passwordShow, setPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
  });

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Submit
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true)
    if (isLogin) {
      try {
        const credentials = {
          emailAddress: formData.emailAddress,
          password: formData.password,
        }
        const response = await loginUser(credentials)
        if (response.success) {
          localStorage.setItem('accessToken', response.data.tokens.accessToken)
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
          toast.success(response.message || 'Login successful!')
          router.push('app/')
        }
      } catch (error) {
        console.error('Login error:', error)
        toast.error(error.response?.data?.message || 'An error occurred during login.')
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log("Sign Up Data:", formData);
      // 🔹 Add Sign Up API call here
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${herobg.src})` }}
      className="w-screen h-screen max-md:h-fit bg-cover bg-center overflow-hidden p-20 flex justify-center items-center gap-10 max-md:flex-col"
    >
      {/* Left Side - Form */}
      <div className="w-[55%] max-md:w-full h-full max-md:h-fit p-8 rounded-lg text-white flex flex-col gap-6 ">
        {/* Logo */}
        <Image
          src={logo}
          alt="maheshwarilogo"
          className="h-[80px] shrink-0 object-contain w-fit mb-6"
        />

        <div>

        {/* Form Title */}
        <h2 className="text-4xl font-bold mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        
        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
            
            <label htmlFor="fullname" >Full Name</label>
            <input
              id="fullname"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 mb-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none"
              required
            />
            </>
          )}
          <label htmlFor="email"> Email</label>
          <input
          id="email"
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 mb-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none"
            required
          />
          <div className="flex justify-between ">
           <label htmlFor="password">Password</label>
           {passwordShow ? <h1 className="flex items-center gap-1 cursor-pointer" onClick={()=> setPasswordShow(false)}> < FiEyeOff/> Hide </h1> : <h1 className="flex items-center gap-1 cursor-pointer"  onClick={()=> setPasswordShow(true)}><FiEye /> show </h1>}
          </div>
          <input
           id="password"
            type={passwordShow? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-3 mb-2 rounded-md bg-white text-black border border-gray-600 focus:outline-none"
            required
          />

          {isLogin && (
            <p className="text-sm cursor-pointer ">
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            className="bg-[#652CD6] mt-6 cursor-pointer hover:scale-[1.04] hover:bg-[#652CD6] rounded-full text-white py-3 px-12 font-semibold transition-all w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
          <p className=" ">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-[#652CD6] underline"
            onClick={() => {
              if (isLogin) {
                router.push('/signup'); // Redirect to signup page
              } else {
                setIsLogin(true); // Toggle to login
                setFormData({ fullName: "", emailAddress: "", password: "" }); // reset form
              }
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
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

export default Page;
