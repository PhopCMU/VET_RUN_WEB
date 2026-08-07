import { motion } from "framer-motion";
import { images } from "../constant";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="mx-auto mb-6"
        >
          <img
            src={images.logovetrun}
            width={80}
            height={80}
            alt="logo vetrun"
            className="rounded-full"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="text-2xl font-bold text-brand-700"
        >
          Loading...
        </motion.p>

        {/* Animated Progress Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="block h-3 w-3 rounded-full bg-brand-400"
            />
          ))}
        </div>

        {/* Subtle Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-brand-700/70"
        >
          VET CMU RUN 2026
        </motion.p>
      </div>
    </div>
  );
}
