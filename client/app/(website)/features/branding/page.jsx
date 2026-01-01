import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React from 'react'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { FullBox, MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'

import smart from '@/public/images/branding/smart.png'
import turnyour from '@/public/images/branding/turnyour.png'
import playlist from '@/public/images/branding/playlist.png'
import playlistimage from '@/public/images/branding/playlistimage.png'
import fanlink from '@/public/images/branding/fanlink.png'
import royalty from '@/public/images/branding/royalty.png'
import dolby from '@/public/images/branding/dolby.png'
import dolbyimage from '@/public/images/branding/dolbyimage.png'
import Link from 'next/link'

const page = () => {
  return (
    <div className='overflow-x-hidden '>
      <div style={{ backgroundImage: `url(${herobg.src})` }} className='bg-cover bg-center min-h-screen w-full flex flex-col justify-center items-center pt-[150px]'>
        <MainHeadingText text='Redefining What' text2='Artists Deserve    ' />
        <Button variant='blue' className='shadow-2xl mt-20 shadow-violet-600'> <Link href="/signup"> Start Free Now</Link></Button>
      </div>

      <TwoHalfBoxes
        item1={{
          iconbg: '#632BDF',
          icon: smart,
          title: 'Smart Cover Art with AI',
          items: ["You can create stunning, professional-quality cover art in just seconds with our AI-powered creator—just upload your inspiration and watch your vision come to life"]
        }}

        item2={{
          iconbg: '#9729CA',
          icon: turnyour,
          title: 'Turn Your Tracks into Soundtracks',
          items: ['Let your music go beyond playlists—artists’ deals can place your tracks in films, games, shows, and global ads']
        }}
      />

      <FullBox
        item1={{
          iconbg: '#CE3AB3',
          icon: playlist,
          title: 'Playlist',
          items: [
            "Submit your tracks for a chance to land on major DSP playlists and boost your streams by reaching fresh new audiences"
          ],
          image: playlistimage
        }}
      />

      <TwoHalfBoxes
        item1={{
          iconbg: '#632BDF',
          icon: fanlink,
          title: 'Fan Links & Pre-Saves',
          items: [
            "Boost hype and fan engagement before your release with customizable pre-saves and fan links—so your music makes an instant splash"
          ]
        }}

        item2={{
          iconbg: '#9729CA',
          icon: royalty,
          title: 'Royalty Splits',
          items: [
            'Easily manage collaborations with automatic royalty splits—handled at the source so your team can stay focused on making great music'
          ]
        }}
      />

      <FullBox
        item1={{
          iconbg: '#CE3AB3',
          icon: dolby,
          title: 'Dolby Atmos Distribution',
          items: [
            "Distribute your music in Dolby Atmos and give your listeners a fully immersive, 3D audio experience that brings every detail to life"
          ],
          image: dolbyimage
        }}
      />

      <Faq />
      <LetTheWorld />
    </div>
  )
}

export default page