"use client";
import React, { useMemo } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HeadingText } from '../FixedUiComponents'
import faqImage  from '@/public/images/faq.png'
import Image from 'next/image'
import { useCompanyInfo } from '@/contexts/CompanyInfoContext';

const Faq = () => {
    const { faqs: rawFaqs, isLoading } = useCompanyInfo();

    const faqs = useMemo(() => {
        if (rawFaqs?.faqsByCategory) {
            const allFaqs = Object.values(rawFaqs.faqsByCategory).flat();
            const sortedFaqs = allFaqs.sort((a, b) => a.displayOrder - b.displayOrder);
            return sortedFaqs.slice(0, 6);
        }
        return [];
    }, [rawFaqs]);

    if (isLoading) {
        // You can return a loading skeleton here if you want
        return null;
    }


    return (
        <div className='max-w-full max-auto bg-[#151A27]  sm:flex justify-center items-center max-sm:gap-10 p-20 py-20 text-white'>
            <div className=' w-full md:w-[40%]'>
                <HeadingText text="Frequently Asked Questions" />
                <Image src={faqImage} alt="FAQ" className='w-[80%] object-contain object-left'/>
            </div>
            <Accordion
                type="single"
                collapsible
                className=" w-full md:w-[60%]"
                defaultValue="item-0"
            >
                {faqs.map((faq, index) => (
                    <AccordionItem key={faq._id} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-sm w-[90%] text-gray-300">
                            <p>{faq.answer}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Faq
