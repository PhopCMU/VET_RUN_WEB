import { AnimatePresence, motion } from "framer-motion";

interface AlertModalProps {
  isOpen: boolean;
  type: "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  type,
  title = "แจ้งเตือน",
  message,
  onClose,
  onConfirm,
  confirmText = "ตรวจสอบข้อมูลลงทะเบียน",
}) => {
  const styles = {
    success: {
      icon: "check_circle",
      accent: "bg-emerald-500",
      iconFrame: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      button:
        "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700 focus-visible:outline-emerald-600",
    },
    error: {
      icon: "error",
      accent: "bg-rose-500",
      iconFrame: "bg-rose-50 text-rose-600 ring-rose-100",
      button:
        "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700 focus-visible:outline-rose-600",
    },
    warning: {
      icon: "warning",
      accent: "bg-amber-400",
      iconFrame: "bg-amber-50 text-amber-600 ring-amber-100",
      button:
        "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600 focus-visible:outline-amber-500",
    },
  };

  const currentStyle = styles[type];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="alert-modal"
        role="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-[2px] sm:p-6"
      >
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-message"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_24px_70px_rgba(17,24,39,0.22)]"
        >
          <div className={`h-1.5 w-full ${currentStyle.accent}`} />

          <div className="px-5 pb-5 pt-6 text-center sm:px-7 sm:pb-7 sm:pt-7">
            <div
              className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full ring-8 ${currentStyle.iconFrame}`}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[34px]"
              >
                {currentStyle.icon}
              </span>
            </div>

            <h3
              id="alert-dialog-title"
              className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl"
            >
              {title}
            </h3>
            <p
              id="alert-dialog-message"
              className="mx-auto mb-6 max-h-[45vh] overflow-y-auto whitespace-pre-line px-1 text-left text-[15px] leading-7 text-gray-600 sm:text-base"
            >
              {message}
            </p>

            <div className="border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={onConfirm || onClose}
                className={`min-h-11 w-full rounded-md px-5 py-2.5 font-semibold text-white shadow-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:min-w-48 ${currentStyle.button}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
