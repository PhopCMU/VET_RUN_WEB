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
  confirmText = "ตกลง",
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <span className="material-symbols-outlined text-green-500 text-4xl">
            check_circle
          </span>
        );
      case "error":
        return (
          <span className="material-symbols-outlined text-red-500 text-4xl">
            error
          </span>
        );
      case "warning":
        return (
          <span className="material-symbols-outlined text-yellow-500 text-4xl">
            warning
          </span>
        );
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-emerald-200 to-emerald-100";
      case "error":
        return "bg-gradient-to-br from-rose-200 to-rose-100";
      case "warning":
        return "bg-gradient-to-br from-amber-200 to-amber-100";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="alert-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-filter backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-md rounded-lg shadow-xl overflow-hidden ${getBgColor()}`}
        >
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">{getIcon()}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm || onClose}
                className={`px-4 py-2 rounded-md ${
                  type === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : type === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white transition`}
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
