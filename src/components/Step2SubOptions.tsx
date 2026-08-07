import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { limitAnimal } from "../types/OpenProject";

interface Props {
  type: string;
  onSelect: (option: string) => void;
  selected: string | null;
  onBack: () => void;
  checkLimitAnimal: limitAnimal | any;
}

const Step2SubOptions: React.FC<Props> = ({
  type,
  onSelect,
  onBack,
  checkLimitAnimal,
}) => {
  const [selected, setSelected] = React.useState<string | null>(null);
  const { t } = useTranslation();

  let options: any = [];

  useEffect(() => {
    localStorage.removeItem("items");
  }, []);

  if (type === "VIP") {
    options = [
      {
        label: t("step2.option.vip.label_radio1"),
        icon: "directions_run",
        color: "bg-purple-100",
        borderColor: "border-purple-500",
      },
      {
        label: t("step2.option.vip.label_radio2"),
        icon: "pets",
        color: "bg-purple-100",
        borderColor: "border-purple-500",
      },
      {
        label: t("step2.option.vip.label_radio3"),
        icon: "flag",
        color: "bg-purple-100",
        borderColor: "border-purple-500",
      },
    ];
  } else if (type === "FUNRUN") {
    options = [
      {
        label: t("step2.option.funrun.label_radio1"),
        icon: "directions_run",
        color: "bg-blue-100",
        borderColor: "border-blue-500",
      },
      {
        label: t("step2.option.funrun.label_radio2"),
        icon: "pets",
        color: "bg-blue-100",
        borderColor: "border-blue-500",
      },
    ];
  } else if (type === "MARATHON") {
    options = [
      {
        label: t("step2.option.marathon.label_radio1"),
        icon: "child_friendly",
        color: "bg-green-100",
        borderColor: "border-green-500",
      },
      {
        label: t("step2.option.marathon.label_radio2"),
        icon: "skateboarding",
        color: "bg-green-100",
        borderColor: "border-green-500",
      },
      {
        label: t("step2.option.marathon.label_radio3"),
        icon: "man",
        color: "bg-green-100",
        borderColor: "border-green-500",
      },
      {
        label: t("step2.option.marathon.label_radio4"),
        icon: "elderly",
        color: "bg-green-100",
        borderColor: "border-green-500",
      },
      {
        label: t("step2.option.marathon.label_radio5"),
        icon: "elderly_woman",
        color: "bg-green-100",
        borderColor: "border-green-500",
      },
    ];
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full " // Increased max width
    >
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-brand-900 sm:text-2xl">
        <span className="material-symbols-outlined text-brand-600">
          {type === "VIP"
            ? "star"
            : type === "FUNRUN"
              ? "directions_run"
              : "flag"}
        </span>
        {t("step2.select_option")} {type}
      </h2>

      <div className="flex  md:flex-row gap-6">
        {/* Options Column */}
        <div className="w-full  space-y-3">
          {options.map((opt: any) => {
            // ตรวจสอบว่าเป็น option มีสุนัขหรือไม่
            const isPetOption =
              (type === "VIP" &&
                opt.label === t("step2.option.vip.label_radio2")) ||
              (type === "FUNRUN" &&
                opt.label === t("step2.option.funrun.label_radio2"));

            const isDisabled =
              !checkLimitAnimal.not_fancy.status && isPetOption;

            return (
              <motion.div
                key={opt.label}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              >
                <label
                  className={`block rounded-md border-2 p-4 transition-all duration-200 ${
                    isDisabled
                      ? "opacity-60 cursor-not-allowed"
                      : selected === opt.label
                        ? `${opt.borderColor} ${opt.color} shadow-md cursor-pointer`
                        : "border-gray-200 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          selected === opt.label ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <span className="material-symbols-outlined text-gray-700">
                          {opt.icon}
                        </span>
                      </div>
                      <div className="flex-1 font-medium text-gray-800">
                        {opt.label}
                      </div>
                      {!isDisabled && (
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selected === opt.label
                              ? `${opt.borderColor} bg-white border-4`
                              : "border-gray-300"
                          }`}
                        >
                          {selected === opt.label && (
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
                      )}
                    </div>

                    {/* แสดง badge ถ้าปิดรับ */}
                    {isDisabled && (
                      <div className="flex justify-center">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                          {t("step2.option.close_register")}
                        </span>
                      </div>
                    )}

                    {/* แสดง radio indicator เฉพาะที่ไม่ disabled */}
                  </div>

                  {/* input radio จะ hidden หาก disabled */}
                  {!isDisabled && (
                    <input
                      type="radio"
                      name="subOption"
                      value={opt.label}
                      checked={selected === opt.label}
                      onChange={() => setSelected(opt.label)}
                      className="hidden"
                    />
                  )}
                </label>
              </motion.div>
            );
          })}

          <div className="flex justify-between gap-4 mt-3">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-3  font-medium  transition-all bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 shadow-sm  w-full"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="material-symbols-outlined">arrow_back</span>
                <span>{t("step1.back_button")}</span>
              </div>
            </motion.button>

            <motion.button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
              whileHover={{ scale: selected ? 1.05 : 1 }}
              whileTap={{ scale: selected ? 0.95 : 1 }}
              className={`mt-6 px-6 py-3 rounded-xl text-white font-medium w-full transition-all ${
                selected
                  ? "w-full bg-brand-700 shadow-md hover:bg-brand-800"
                  : "w-full cursor-not-allowed bg-gray-200 text-gray-500"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{t("step1.next_button")}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2SubOptions;
