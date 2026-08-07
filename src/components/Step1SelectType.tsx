import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { images } from "../constant";

interface Props {
  onSelect: (type: string) => void;
  selected: string | null;
}

const Step1SelectType: React.FC<Props> = ({ onSelect }) => {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [hovered, setHovered] = useState(null);
  const { t } = useTranslation();

  const options = [
    {
      value: "VIP",
      label: t("step1.label_radio1"),
      price: "1,500 " + t("step1.baht"),
      icon: "stars",
      color: "bg-brand-50",
      borderColor: "border-brand-500",
      hoverColor: "hover:border-brand-300",
    },
    {
      value: "FUNRUN",
      label: t("step1.label_radio2"),
      price: "500 " + t("step1.baht"),
      icon: "directions_run",
      color: "bg-brand-50",
      borderColor: "border-brand-500",
      hoverColor: "hover:border-brand-300",
    },
    {
      value: "MARATHON",
      label: t("step1.label_radio3"),
      price: "500 " + t("step1.baht"),
      icon: "sprint",
      color: "bg-brand-50",
      borderColor: "border-brand-500",
      hoverColor: "hover:border-brand-300",
    },
  ];

  return (
    <div className="mx-auto w-full space-y-6">
      <h2 className="text-center text-xl font-bold text-brand-900 sm:text-2xl">
        {t("step1.title")}
      </h2>

      <div className="space-y-3">
        {options.map((opt: any) => (
          <motion.div
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHovered(opt.value)}
            onHoverEnd={() => setHovered(null)}
          >
            <label
              className={`block cursor-pointer rounded-md border-2 p-4 transition-all duration-200 ${
                selected === opt.value
                  ? `${opt.borderColor} ${opt.color} shadow-md`
                  : `border-gray-200 ${opt.hoverColor}`
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    selected === opt.value ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      selected === opt.value
                        ? "text-purple-600"
                        : "text-gray-500"
                    }`}
                  >
                    {opt.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">{opt.label}</span>
                    <span
                      className={`font-semibold ${
                        selected === opt.value
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                    >
                      {opt.price}
                    </span>
                  </div>
                  {hovered === opt.value && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-gray-500 mt-1"
                    >
                      {t(`step1.tooltip.tooltip_${opt.value.toLowerCase()}`)}
                    </motion.p>
                  )}
                </div>
                <input
                  type="radio"
                  name="eventType"
                  value={opt.value}
                  checked={selected === opt.value}
                  onChange={() => setSelected(opt.value)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === opt.value
                      ? `${opt.borderColor} bg-white border-4`
                      : "border-gray-300"
                  }`}
                >
                  {selected === opt.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2 h-2 rounded-full ${opt.borderColor.replace(
                        "border",
                        "bg",
                      )}`}
                    />
                  )}
                </div>
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        whileHover={selected ? { scale: 1.02 } : {}}
        whileTap={selected ? { scale: 0.98 } : {}}
        className={`mt-6 px-6 py-3 rounded-xl text-white font-medium w-full transition-all ${
          selected
            ? "bg-brand-700 shadow-md hover:bg-brand-800"
            : "cursor-not-allowed bg-gray-200 text-gray-500"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <span>{t("step1.next_button")}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col justify-center"
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center justify-center rounded-md border border-brand-100 bg-white p-4 shadow-sm"
          >
            <img
              src={images.fun}
              alt="Shirt VIP 1"
              className="w-full h-auto object-contain"
            />
            <p className="text-center mt-2 text-sm text-gray-600">FUN RUN</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center justify-center rounded-md border border-brand-100 bg-white p-4 shadow-sm"
          >
            <img
              src={images.mini}
              alt="Shirt VIP 2"
              className="w-full h-auto object-contain"
            />
            <p className="text-center mt-2 text-sm text-gray-600">
              MINI MARATHON
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step1SelectType;
