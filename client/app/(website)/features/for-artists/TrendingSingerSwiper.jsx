"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Anton} from 'next/font/google';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Autoplay, Pagination } from 'swiper/modules';
import { getTopTrendingArtists } from '@/services/api.services';

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
});

export default function TrendingSingerSwiper() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getTopTrendingArtists();
        if (response.success) {
          setArtists(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch trending artists:", error);
      }
    };

    fetchArtists();
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
        {artists.map((item, index) => (
          <SwiperSlide key={index} className="flex flex-col items-center justify-items-center space-y-3 text-white uppercase text-center"> 
            <img src={item.profileImageUrl} alt={item.artistName} className="w-[250px] h-[300px] object-cover rounded-lg mb-4" />
            <h3 className={`text-4xl  font-semibold ${anton.className}`}>{item.artistName}</h3>
            <p className="text-gray-500 ">{item.designation}</p>
           </SwiperSlide>
          
        ))}
        
      </Swiper>
    </>
  );
}
