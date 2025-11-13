import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
      <motion.p
        className="mt-6 text-gray-600 text-sm font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading, please wait...
      </motion.p>
    </div>
  );
};

export default Loader;
