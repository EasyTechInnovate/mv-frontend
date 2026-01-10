import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import { useTestimonials } from '@/contexts/TestimonialContext'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Example(stars) {
    const elements = [];
    for (let i = 0; i < stars; i++) {
        elements.push(<p key={i} className='whitespace-nowrap w-fit '>⭐</p>);
    }

    return <div className='flex gap-2'>{elements}</div>;
}

export default function TestimonialSwiper() {
    const { testimonials, loading, error } = useTestimonials();
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    if (loading) {
        return <div>Loading testimonials...</div>;
    }

    if (error) {
        return <div>Error loading testimonials: {error}</div>;
    }

    if (!testimonials || testimonials.length === 0) {
        return <div>No testimonials available.</div>;
    }

    return (
        <div className="relative w-full h-full">
            <Swiper
                slidesPerView={1}
                spaceBetween={0}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 3
                }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    swiper.params.navigation.nextEl = navigationNextRef.current;
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="mt-8">
                <style>
                    {`
                    .swiper-button-next,
                    .swiper-button-prev {
                    
                        color: white; 
                        background: #652CD6; 
                        width: 70px; 
                        height: 70px; 
                        border-radius: 9999px; 
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); 
                        transition: all 0.3s ease; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        position: absolute;
                        top: 50%;
                        z-index: 10;
                        cursor: pointer;
                    }
                    
                    .swiper-button-prev {
                        left: 0; 
                        transform: translate(55%, -50%); 
                    }

                    .swiper-button-next {
                        right: 0; 
                        transform: translate(-55%, -50%); 
                    }

                    .swiper-button-next:hover {
                        transform: translate(-40%, -50%) scale(1.08); 
                        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); 
                    }

                    .swiper-button-prev:hover {
                        transform: translate(40%, -50%) scale(1.08); 
                        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); 
                    }

                    .swiper-button-next.swiper-button-disabled,
                    .swiper-button-prev.swiper-button-disabled {
                        background-color: #f0f0f0; 
                        color: #652CD6; 
                        cursor: not-allowed; 
                        opacity: 0.5; 
                        
                    }

                    .swiper-pagination-bullet {
                        background-color: white; 
                        opacity: 1; 
                        width: 10px; 
                        height: 10px; 
                        transition: background-color 0.3s ease; 
                    }

                    .swiper-pagination-bullet-active {
                        background-color: #652CD6; 
                    }
                            
                    `}
                </style>
                {testimonials.map((testimonial) => (
                    <SwiperSlide
                        key={testimonial._id}
                        className="px-[5vw] ">
                        <div className="w-full mb-12  rounded-xl overflow-hidden bg-[#fff]/10 backdrop-blur-lg flex flex-col items-center justify-center p-8 py-12 gap-4 border border-gray-500">
                            <div className="w-[90px] h-[90px] rounded-full border-2 mb-8">
                                <Image src={testimonial.profileImageUrl || '/images/home/testimonial1.png'} alt={testimonial.customerName} width={90} height={90} className='w-full h-full' />
                            </div>
                            <h1 className='text-xl font-semibold'>{testimonial.customerName}</h1>
                            <h1 className='text-base text-gray-400'> {testimonial.designation}</h1>

                            {testimonial.rating && Example(testimonial.rating)}

                            <h1 className='text-gray-300 text-center text-xl w-[60%]'>{testimonial.testimonialContent}</h1>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div ref={navigationPrevRef} className="swiper-button-prev">
                <ChevronLeft size={24} />
            </div>
            <div ref={navigationNextRef} className="swiper-button-next">
                <ChevronRight size={24} />
            </div>
        </div>
    )
}

