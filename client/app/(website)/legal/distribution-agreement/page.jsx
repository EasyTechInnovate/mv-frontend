'use client'
import React from 'react'
import { HeadingText } from '@/components/FixedUiComponents'
import DistributionAgreementContent from '@/components/legal/DistributionAgreementContent'

const LegalDistributionAgreementPage = () => {
  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Distribution Agreement" className='text-center' />
      <DistributionAgreementContent />
      <div className="text-center text-sm text-gray-500 py-10">
        © 2022-2025 Maheshwari Visuals PVT LTD. All rights reserved.
      </div>
    </div>
  )
}

export default LegalDistributionAgreementPage
