'use client';

import React, { useEffect, useState, use } from 'react';
import { getPublicFanLink } from '@/services/api.services';
import { Music, ExternalLink, Share2, Disc, Play, Headphones, Radio, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORM_ICONS = {
  spotify: <Disc />,
  apple_music: <Music />,
  youtube_music: <Play />,
  amazon_music: <Volume2 />,
  deezer: <Headphones />,
  tidal: <Radio />,
  soundcloud: <Music />,
  jiosaavn: <Music />,
  gaana: <Music />,
};

export default function FanLinkPage({ params }) {
  const { slug } = use(params);
  const [fanLink, setFanLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPublicFanLink(slug);
        if (response.success) {
          setFanLink(response.data);
        } else {
          setError(response.message || 'Link not found');
        }
      } catch (err) {
        setError('Failed to load link');
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Music className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !fanLink) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Disc className="w-10 h-10 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Oops! Link Invalid</h1>
        <p className="text-gray-400 max-w-md">{error || "This fan link might have expired or doesn't exist."}</p>
        <a href="/" className="mt-8 text-purple-400 hover:text-purple-300 transition-colors font-medium">
          Back to Maheshwari Visuals
        </a>
      </div>
    );
  }

  const { userId: creator, title, description, platformLinks } = fanLink;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden font-sans selection:bg-purple-500/30 pt-20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center text-center mb-10"
        >
          {/* Creator Photo */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/10 overflow-hidden bg-[#16161d] shadow-2xl shadow-purple-500/20">
              {creator?.profile?.photo ? (
                <img 
                  src={creator.profile.photo} 
                  alt={creator.firstName} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-16 h-16 text-purple-500/50" />
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {title}
          </h1>
          
          <div className="flex items-center gap-2 mb-4">
             <span className="text-purple-400 font-medium tracking-wide text-sm uppercase">By {creator?.firstName} {creator?.lastName}</span>
          </div>

          {description && (
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
              {description}
            </p>
          )}
        </motion.div>

        {/* Links Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-3"
        >
          <AnimatePresence>
            {platformLinks.filter(l => l.isActive).map((link, index) => (
              <motion.a
                key={link.platform}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl group transition-all duration-300 backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white/80 group-hover:text-white transition-colors text-xl">
                    {PLATFORM_ICONS[link.platform] || <Music />}
                  </div>
                  <span className="text-white font-semibold text-base capitalize tracking-wide">
                    {link.platform.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white/40 group-hover:text-purple-400 uppercase tracking-widest transition-colors hidden sm:block">
                    Listen
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-purple-500 flex items-center justify-center transition-all duration-300 text-white">
                    <Play size={14} className="fill-current" />
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          {/* <div className="flex gap-4">
            <button className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div> */}
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">Powered BY</span>
            <div className="text-white/40 font-bold text-sm tracking-tighter flex items-center gap-1">
              MAHESHWARI <span className="text-purple-500/50">VISUALS</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
