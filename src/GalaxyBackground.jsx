import React from 'react';
import { motion } from 'framer-motion';

const GalaxyBackground = () => {
  // Generate random stars for the background
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: -Math.random() * 20
  }));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', background: 'radial-gradient(ellipse at center, #0B0E14 0%, #030406 100%)' }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            width: star.size,
            height: star.size,
            backgroundColor: 'rgba(0, 240, 255, 0.6)',
            boxShadow: '0 0 10px rgba(0,240,255,1)',
            borderRadius: '50%'
          }}
          initial={{ top: '-5%', opacity: 0 }}
          animate={{
            top: '105%',
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: star.delay
          }}
        />
      ))}
      
      {/* Nebula glowing blobs */}
      <motion.div
        style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,240,255,0.03) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(50px)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{ position: 'absolute', bottom: '10%', right: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,0,60,0.03) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(50px)' }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default GalaxyBackground;
