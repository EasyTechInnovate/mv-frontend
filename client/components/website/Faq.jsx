"use client";
import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HeadingText } from '../FixedUiComponents'
import faqImage  from '@/public/images/faq.png'
import Image from 'next/image'
import { getFaqs } from '@/services/api.services';

const Faq = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await getFaqs();
                if (response.success && response.data.faqsByCategory) {
                    const allFaqs = Object.values(response.data.faqsByCategory).flat();
                    const sortedFaqs = allFaqs.sort((a, b) => a.displayOrder - b.displayOrder);
                    setFaqs(sortedFaqs.slice(0, 6));
                }
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
            }
        };

        fetchFaqs();
    }, []);

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
