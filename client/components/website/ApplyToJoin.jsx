import React from 'react'
import letTheWorldbg from '@/public/images/lettheworldbg.png'
import letTheWorld from '@/public/images/lettheworld.png'
import { Button } from '../ui/button'
import { HeadingText } from '../FixedUiComponents'
import Image from 'next/image'
import Link from 'next/link'
const ApplyToJoin = () => {
  return (
    <div style={{ backgroundImage: `url(${letTheWorldbg.src})` }} className='p-12  bg-top bg-cover  '>
      <div className='w-full p-8 h-[400px] rounded-4xl bg-[rgba(0,0,0,0.2)] backdrop-blur-lg border-[1px] border-[#ffffff2d] flex max-md:flex-col max-md:h-fit gap-10 '>
        <div className='flex flex-col justify-center w-[100%] md:w-[50%] '>
            <div className='flex items-end'>
            <HeadingText text="Apply to Join as an Aggregator" />
            </div>

            <p className='text-gray-300 text-base mb-6'>Get onboard with us and expand your reach! Fill out our simple form to become a part of our trusted aggregator network.</p>
            <div className='flex space-x-4 flex-wrap '>
              <Link href="/aggregators-form">  
                <Button variant="blue">Apply Now</Button>
              </Link>
            </div>
        </div>
        <div className='rounded  w-[100%] md:w-[50%] '>
          <Image src={ letTheWorld} alt='Let the world' className='h-full object-contain  max-h-[350px]'/>
        </div>
      </div>

    </div>
  )
}

export default ApplyToJoin
