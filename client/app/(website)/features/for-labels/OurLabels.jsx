"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Autoplay, Pagination } from 'swiper/modules';
import { Anton } from 'next/font/google';
import { getTopTrendingLabels } from '@/services/api.services';

const anton = Anton({
    weight: ['400'],    
    subsets: ['latin']
});

export default function OurLabels() {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await getTopTrendingLabels();
        if (response.success) {
          setLabels(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch trending labels:", error);
      }
    };

    fetchLabels();
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        draggable={true}
        modules={[ Autoplay]}
        autoplay= {{
            delay: 3000,
        }}
         onSwiper={(swiper) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!swiper.autoplay) return; 
            if (entry.isIntersecting) {
              swiper.autoplay.start();
            } else {
              swiper.autoplay.stop();
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(swiper.el);
      }}
        breakpoints= {{
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            900:{
                slidesPerView: 4,
                spaceBetween: 30
            }
        }}
        className="mySwiper"
      >
        {labels.map((item, index) => (
          <SwiperSlide key={index} className="flex flex-col items-center justify-items-center space-y-3 text-white uppercase text-center"> 
            <img src={item.logoUrl} alt={item.labelName} className="w-[200px] h-[200px] object-cover rounded-lg mb-4" />
            <h3 className={`text-4xl  font-semibold ${anton.className}`}>{item.labelName}</h3>
            <p className="text-gray-500 ">{item.designation}</p>
           </SwiperSlide>
          
        ))}
        
      </Swiper>
    </>
  );
}
