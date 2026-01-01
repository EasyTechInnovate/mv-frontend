import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React from 'react'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { FullBox, MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'

import playlistimage from '@/public/images/branding/playlistimage.png'
import dolbyimage from '@/public/images/branding/dolbyimage.png'

import joinmovement from '@/public/images/career/joinmovement.png' 
import whatwestand from '@/public/images/career/whatwestand.png' 
import ourgoal from '@/public/images/career/ourgoal.png' 
import lifeofmv from '@/public/images/career/lifeofmv.png' 
import ourhiring from '@/public/images/career/ourhiring.png' 
import whyyou from '@/public/images/career/whyyou.png' 
import CareerSwiper from './CareerSwiper'
import Link from 'next/link'



const page = () => {
  return (
    <div className='overflow-x-hidden '>
      <div style={{ backgroundImage: `url(${herobg.src})` }} className='bg-cover bg-center min-h-screen w-full flex flex-col justify-center items-center pt-[150px]'>
        <MainHeadingText text='Let’s Build the Future' text2='Together.' />
        <div className='w-full pt-10'>

        <CareerSwiper/>

        </div>
        <Button variant='blue' className='shadow-2xl m-20 shadow-violet-600'> <Link href="/signup"> Start Free Now</Link></Button>
      </div>

        <FullBox
        item1={{
          iconbg: '#CE3AB3',
          icon: joinmovement, 
          title: 'Join the Movement',
          items: [
            "At Maheshwari Visuals, we're not just building a music company—we're crafting a cultural revolution. Whether you're a designer, marketer, engineer, strategist, or storyteller, your ideas have a place here."
          ],
          image: playlistimage 
        }}
      />

      <TwoHalfBoxes
        item1={{
          iconbg: '#632BDF',
          icon: whatwestand, 
          title: 'What We Stand For',
          items: [
            "Artist-First Always: Everything we do begins and ends with empowering artists.",
            "Rooted in India, Built for the World: We honor heritage while pushing creative boundaries.",
            "Culture + Code + Commerce: From Raagas to React, our world blends creativity and precision."
          ]
        }}

        item2={{
          iconbg: '#9729CA',
          icon: whyyou, 
          title: "Why You'll Love it Here",
          items: [
            'Hybrid work model with deep collaboration',
            'Creative freedom & fast growth tracks',
            'Access to events, merch drops, and artist collabs',
            'Learning budgets and hands-on mentorship',
            'Purpose-driven environment where your work makes impact'
          ]
        }}
      />

      <TwoHalfBoxes
        item1={{
          iconbg: '#632BDF',
          icon: lifeofmv, 
          title: 'Life at MV',
          items: [
            "Cross-functional team with music lovers, dreamers, and builders",
            "Behind-the-scenes looks into shoots, drops, and office life",
            "We celebrate festivals, first releases, and every milestone in between"
          ]
        }}

        item2={{
          iconbg: '#9729CA',
          icon: ourhiring, 
          title: 'Our Hiring Process',
          items: [
            'Application Review',
            'Creative/Technical Task',
            'Video Call Interview',
            'Offer & Onboarding',
            'We believe in transparency, fast feedback, and real conversations.'
          ]
        }}
      />

      <FullBox
        item1={{
          iconbg: '#CE3AB3',
          icon: ourgoal, 
          title: 'Our goal',
          items: [
            "To match talent with purpose.",
            "Send us a note anyway. Some of our best roles were created after hello.",
            "email: jobs@maheshwarivisuals.com"
          ],
          image: dolbyimage ,
          buttonText: 'Apply Now',
          buttonLink: '#'
        }}
      />



      <LetTheWorld />
    </div>
  )
}

export default page