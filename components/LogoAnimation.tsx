"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LandingSplash = () => {
  const [show, setShow] = useState(false); // Default to hidden

  useEffect(() => {
    const lastShown = localStorage.getItem("landingShown");
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (!lastShown || now - parseInt(lastShown) > oneDay) {
      setShow(true);
      localStorage.setItem("landingShown", now.toString()); // Save timestamp
      setTimeout(() => setShow(false), 2400); // Auto-hide after 2.4 seconds
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ✅ Display GIF */}
          <img src="/W.gif" alt="Splash animation" className="w-1/2 h-auto object-cover" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingSplash;
