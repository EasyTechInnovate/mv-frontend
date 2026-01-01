import React from 'react'
import letTheWorldbg from '@/public/images/lettheworldbg.png'
import letTheWorld from '@/public/images/lettheworld.png'
import { Button } from '../ui/button'
import { HeadingText } from '../FixedUiComponents'
import Image from 'next/image'
import Link from 'next/link'
const LetTheWorld = () => {
  return (
    <div style={{ backgroundImage: `url(${letTheWorldbg.src})` }} className='p-10 md:p-20  bg-top bg-cover  '>
      <div className='w-full p-8 h-[450px] rounded-4xl bg-[rgba(0,0,0,0.2)] backdrop-blur-lg border-[1px] border-[#ffffff2d] flex max-lg:flex-col max-lg:h-fit gap-10 '>
        <div className='flex flex-col justify-center w-[100%] lg:w-[50%] '>
            <div className='flex items-end'>
            <HeadingText text="Let The World Hear You" />
            <div className='w-[10px] h-[10px] mb-5 ml-1 bg-[#652CD6]'></div>
            </div>

            <p className='text-gray-300 text-base mb-6'>Join us in our mission to share your story with the world.</p>
            <div className='flex space-x-4 flex-wrap '>
                <Button variant="blue"><Link href="/signup">Get Started</Link> </Button>
                <Button variant="transparent"><Link href="/features/for-artist">Explore Features</Link></Button>
            </div>
        </div>
        <div className='rounded  w-[100%] lg:w-[50%] '>
          <Image src={ letTheWorld} alt='Let the world' className='h-full object-contain  max-h-[350px]'/>
        </div>
      </div>

    </div>
  )
}

export default LetTheWorld
