import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ProcressLoadingModalProps {
  isOpen: boolean;
  progress: number;
  isError: boolean;
  errorMessage?: string;
  onClose: () => void;
}
export const ProcressLoadingModal: React.FC<ProcressLoadingModalProps> = ({
  isOpen,
  progress,
  isError,
  errorMessage,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        }}
        className="relative mx-4 w-full max-w-xl overflow-hidden rounded-md border border-brand-200 bg-brand-900 p-8 shadow-2xl"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#4a7856]/10 rounded-full filter blur-[80px] animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#d79b65]/10 rounded-full filter blur-[80px] animate-pulse delay-300"></div>
        </div>

        <div className="relative z-10">
          {/* Header Icon */}
          {isError ? (
            <motion.div
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: [0, 10, -10, 0], scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner"
            >
              <span className="material-symbols-outlined text-4xl text-red-400">
                error
              </span>
            </motion.div>
          ) : (
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner"
            >
              <span className="material-symbols-outlined text-4xl text-emerald-400 animate-pulse">
                progress_activity
              </span>
            </motion.div>
          )}

          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white text-center tracking-tight"
          >
            {isError
              ? `${t("process_loading.message.error")}`
              : `${t("process_loading.message.pending")}`}
          </motion.h3>

          {/* Content Area */}
          {!isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 mt-8"
            >
              <div className="space-y-3">
                <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">
                    {t("process_loading.loading")}
                  </span>
                  <span className="font-medium text-emerald-300">
                    {progress}%
                  </span>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm text-center leading-relaxed"
              >
                {t("process_loading.please_wait")}
                <span className="inline-block ml-1 animate-[bounce_1s_infinite]">
                  ...
                </span>
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 mt-8"
            >
              <div className="bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-400 mt-0.5 text-lg">
                    info
                  </span>
                  <p className="text-red-100 font-medium text-sm leading-snug">
                    {errorMessage || "ไม่สามารถโหลดข้อมูลได้"}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    refresh
                  </span>
                  {t("process_loading.reload")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose} // assuming you have a close handler
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/90 rounded-xl font-medium transition-all duration-300 border border-white/10 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
                  {t("process_loading.close")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Floating particles */}
        {!isError && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
                className="absolute w-1 h-1 bg-emerald-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
