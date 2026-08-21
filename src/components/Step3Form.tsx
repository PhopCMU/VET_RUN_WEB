import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import { motion } from "framer-motion";
import { FunctionMenuSizeShirt } from "../routers/GetRouter";
import { useTranslation } from "react-i18next";
import { AlertModal } from "./AlertModal";
import type { limitAnimal } from "../types/OpenProject";
import vipShirtImage from "../assets/images/shirts/03-01.jpg";

interface Props {
  type: string;
  subOption: string;
  formData: any;
  checkLimitAnimal: limitAnimal | undefined;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ShirtSize {
  shirtId: string;
  size: string;
  s_width: number;
  s_high: number;
  point: number | string;
}

const Step3Form: FC<Props> = ({
  type,
  subOption,
  formData,
  checkLimitAnimal,
  updateFormData,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();
  const hasShirt = useRef(false);
  const [receipt, setReceipt] = useState(formData.needReceipt || false);

  const [ageRange, setAgeRange] = useState("");
  const [shirtSize, setShirtSize] = useState<ShirtSize[]>();

  const safeSubOption = subOption ? subOption : "MINI MARATHON (9 KM)";
  const isDogEvent =
    subOption.includes("FUN RUN 4 KM (มีสุนัข)") ||
    subOption.includes("FUN RUN 4 KM (with dog)") ||
    subOption.includes("VIP FUN RUN (มีสุนัข)") ||
    subOption.includes("VIP FUN RUN (with dog)");
  const isMarathonWithAge =
    type === "MARATHON" || safeSubOption.includes("MINI");

  const ageLimits = {
    [t("step2.option.marathon.label_radio1")]: { min: 5, max: 19 },
    [t("step2.option.marathon.label_radio2")]: { min: 20, max: 29 },
    [t("step2.option.marathon.label_radio3")]: { min: 30, max: 39 },
    [t("step2.option.marathon.label_radio4")]: { min: 40, max: 49 },
    [t("step2.option.marathon.label_radio5")]: { min: 50, max: 120 },
  };

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: "success" | "warning" | "error";
    title?: string;
    message: string;
    confirmText?: string;
  }>({
    isOpen: false,
    type: "warning",
    message: "",
  });

  const listMenuShrit = async () => {
    const response = await FunctionMenuSizeShirt();
    if (response.success) {
      setShirtSize(
        response.data.size.filter((shirt: ShirtSize) => {
          const point = Number(shirt.point);
          return point >= 2 && point <= 17;
        }),
      );
    }
  };

  useEffect(() => {
    if (!hasShirt.current) {
      hasShirt.current = true;
      listMenuShrit();
    }
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    if (name === "phone") {
      updateFormData({ phone: value.slice(0, 10) });
    } else if (name.startsWith("dog")) {
      const key = name.charAt(3).toLowerCase() + name.slice(4); // dogName → name
      updateFormData({
        animal: {
          ...(formData.animal || {}),
          [key]: value,
        },
      });
    } else if (name === "fancys") {
      updateFormData({
        animal: {
          ...(formData.animal || {}),
          fancys: newValue,
        },
      });
    } else if (name === "sizeId") {
      try {
        const { id, size } = JSON.parse(value);
        updateFormData({
          sizeId: id,
          shirtSizeLabel: size,
        });
      } catch (e) {
        console.error("Invalid sizeId JSON");
        updateFormData({
          sizeId: "",
          shirtSizeLabel: "",
        });
      }
    } else if (name === "sizeId_2") {
      try {
        const { id_2, size_2 } = JSON.parse(value);
        updateFormData({
          sizeId_2: id_2,
          shirtSizeLabel_2: size_2,
        });
      } catch (e) {
        console.error("Invalid sizeId JSON");
        updateFormData({
          sizeId_2: "",
          shirtSizeLabel_2: "",
        });
      }
    } else {
      updateFormData({ [name]: newValue });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ transferFile: e.target.files[0] });
    }
  };
  useEffect(() => {
    const isDogEvent =
      subOption.includes("FUN RUN 4 KM (มีสุนัข)") ||
      subOption.includes("FUN RUN 4 KM (with dog)") ||
      subOption.includes("VIP FUN RUN (มีสุนัข)") ||
      subOption.includes("VIP FUN RUN (with dog)");

    if (isDogEvent !== formData.hasDog) {
      updateFormData({ hasDog: isDogEvent });
    }
  }, [subOption]);

  useEffect(() => {
    if (
      type === "VIP" &&
      (formData.items !== "shirt_2" || formData.model_shirt)
    ) {
      updateFormData({ items: "shirt_2", model_shirt: "" });
    }
  }, [type, formData.items, formData.model_shirt]);

  const accountNumber = "667-411644-1";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber.replace(/-/g, "")); // ลบขีดคั่นออกถ้าต้องการ
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // แสดงข้อความว่า copy สำเร็จแค่ 2 วินาที
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      <AlertModal
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        confirmText={alertState.confirmText}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />

      <motion.h2
        className="flex flex-col items-center gap-2 text-xl font-bold text-brand-900 sm:text-2xl md:flex-row"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
      >
        <span className="material-symbols-outlined text-blue-600">person</span>
        {t("step3.title_personal")}{" "}
        <div className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <span className="text-sm font-normal">{safeSubOption}</span>
        </div>
      </motion.h2>

      <div className="space-y-4">
        {/* Personal Information */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* First Name */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              badge
            </span>
            <input
              name="firstName"
              aria-label={t("step3.form_personal.fristname")}
              placeholder={t("step3.form_personal.fristname")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInputChange}
              defaultValue={formData.firstName}
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              badge
            </span>
            <input
              name="lastName"
              aria-label={t("step3.form_personal.lastname")}
              placeholder={t("step3.form_personal.lastname")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInputChange}
              defaultValue={formData.lastName}
            />
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              mail
            </span>
            <input
              name="email"
              type="email"
              aria-label={t("step3.form_personal.email")}
              placeholder={t("step3.form_personal.email")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInputChange}
              defaultValue={formData.email}
            />
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              call
            </span>
            <input
              name="phone"
              type="number"
              aria-label={t("step3.form_personal.phone")}
              placeholder={t("step3.form_personal.phone")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInputChange}
              value={formData.phone}
              maxLength={10}
            />
            {formData.phone && formData.phone.length < 10 && (
              <p className="text-red-500 text-xs mt-1">
                * {t("step3.form_personal.validation.phone_invalid")}
              </p>
            )}
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              person
            </span>
            <select
              name="sex"
              aria-label={t("step3.form_personal.select_sex")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              onChange={handleInputChange}
              defaultValue={formData.sex}
            >
              <option value="">{t("step3.form_personal.select_sex")}</option>
              <option value="M">{t("step3.form_personal.sex.male")}</option>
              <option value="W">{t("step3.form_personal.sex.female")}</option>
            </select>
          </div>

          {isMarathonWithAge && (
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                cake
              </span>
              <select
                aria-label={t("step3.form_personal.select_age_range")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                onChange={(e) => setAgeRange(e.target.value)}
              >
                <option value="">
                  {t("step3.form_personal.select_age_range")}
                </option>
                {Object.keys(ageLimits).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          )}

          {ageRange && isMarathonWithAge && (
            <div className="relative">
              <label
                htmlFor="age-select"
                className="flex mb-1 text-sm font-medium text-gray-700 items-center gap-1"
              >
                <span className="material-symbols-outlined text-gray-400">
                  calendar_view_day
                </span>
                <span>{t("step3.form_personal.select_age_range")}</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                  numbers
                </span>
                <select
                  id="age-select"
                  name="age"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  onChange={handleInputChange}
                  defaultValue={formData.age}
                >
                  <option value="">
                    {t("step3.form_personal.select_age_range")}
                  </option>
                  {ageRange && ageLimits[ageRange]
                    ? Array.from(
                        {
                          length:
                            ageLimits[ageRange].max -
                            ageLimits[ageRange].min +
                            1,
                        },
                        (_, i) => {
                          const age = ageLimits[ageRange].min + i;
                          return (
                            <option key={age} value={age}>
                              {age}
                            </option>
                          );
                        },
                      )
                    : null}
                </select>
              </div>
            </div>
          )}

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              apparel
            </span>
            <select
              name="sizeId"
              aria-label={t("step3.form_personal.select_size_shirt")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              onChange={handleInputChange}
              defaultValue={formData.sizeId}
            >
              <option value="" className="text-gray-700 ">
                {formData.sizeId
                  ? shirtSize?.filter(
                      (shirt: any) => shirt.shirtId === formData.sizeId,
                    )[0].size
                  : t("step3.form_personal.select_size_shirt")}
              </option>
              {shirtSize &&
                shirtSize.map((shirt: any) => (
                  <option
                    key={shirt.shirtId}
                    value={JSON.stringify({
                      id: shirt.shirtId,
                      size: shirt.size,
                    })}
                    className="text-gray-700 flex  gap-x-2 w-full"
                  >
                    {`${shirt.size} =  (${t(
                      "step3.form_personal.shirt.chest_size",
                    )}:${shirt.s_width} ${t(
                      "step3.form_personal.shirt.length_size",
                    )}:${shirt.s_high})`}
                  </option>
                ))}
            </select>
          </div>
        </motion.div>

        {/* Dog Information Section */}
        {isDogEvent && (
          <motion.div
            className="mt-6 border-t pt-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
              <span className="material-symbols-outlined text-blue-600">
                pets
              </span>
              {t("step3.title_animal")}
            </h3>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                badge
              </span>
              <input
                name="dogName"
                aria-label={t("step3.form_animal.name")}
                placeholder={t("step3.form_animal.name")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
                defaultValue={formData.animal.name}
              />
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                pets
              </span>
              <input
                name="dogBreed"
                aria-label={t("step3.form_animal.breed")}
                placeholder={t("step3.form_animal.breed")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
                defaultValue={formData.animal.breed}
              />
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                monitor_weight
              </span>
              <input
                name="dogWeight"
                aria-label={t("step3.form_animal.weight")}
                placeholder={t("step3.form_animal.weight")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
                defaultValue={formData.animal.weight}
              />
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                female
              </span>
              <select
                name="dogGender"
                aria-label={t("step3.form_animal.sex.select_sex")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                onChange={handleInputChange}
                defaultValue={formData.animal.sex}
              >
                <option value="">
                  {t("step3.form_animal.sex.select_sex")}
                </option>
                <option value="DM">{t("step3.form_animal.sex.male")}</option>
                <option value="DF">{t("step3.form_animal.sex.female")}</option>
              </select>
            </div>
            <label className="flex items-center gap-2 mt-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              {checkLimitAnimal?.fancy?.status ? (
                <>
                  <input
                    type="checkbox"
                    name="fancys"
                    checked={formData.animal.fancys || false}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="flex text-sm items-center gap-1">
                    <span className="material-symbols-outlined text-purple-500">
                      celebration
                    </span>
                    {t("step3.form_animal.select_contest")}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-purple-500">
                      celebration
                    </span>
                    {t("step3.form_animal.closed")}
                  </span>
                </>
              )}
            </label>
          </motion.div>
        )}

        {type === "VIP" && (
          <motion.div
            className="mt-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3">
                <span className="material-symbols-outlined text-blue-600">
                  apparel
                </span>
                <span className="font-medium text-gray-800">
                  {t("step3.form_personal.select_shirt_2")}
                </span>
              </div>

              <img
                src={vipShirtImage}
                alt={t("step3.form_personal.shirt_image_alt")}
                className="aspect-[4/3] w-full rounded-md border border-gray-200 object-cover"
              />

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 z-10 text-gray-500">
                  straighten
                </span>
                <select
                  name="sizeId_2"
                  aria-label={t("step3.form_personal.select_size_shirt")}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white py-3 pl-12 pr-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  onChange={handleInputChange}
                  defaultValue=""
                >
                  <option value="" className="text-gray-500">
                    {formData.sizeId_2
                      ? formData.shirtSizeLabel_2
                      : t("step3.form_personal.select_size_shirt")}
                  </option>
                  {shirtSize?.map((shirt) => (
                    <option
                      key={shirt.shirtId}
                      value={JSON.stringify({
                        id_2: shirt.shirtId,
                        size_2: shirt.size,
                      })}
                    >
                      {`${shirt.size} = (${t(
                        "step3.form_personal.shirt.chest_size",
                      )}: ${shirt.s_width} ${t(
                        "step3.form_personal.shirt.length_size",
                      )}: ${shirt.s_high})`}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-gray-400">
                  expand_more
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Receipt Section */}
        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={receipt}
              onChange={() => {
                setReceipt(!receipt);
                updateFormData({ needReceipt: !receipt });
              }}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-green-600">
                receipt
              </span>
              {t("step3.form_personal.needReceipt")}
            </span>
          </label>

          {receipt && (
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                home
              </span>
              <textarea
                name="address"
                placeholder={t("step3.form_personal.address")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                onChange={handleInputChange}
                defaultValue={formData.address}
              ></textarea>
            </div>
          )}

          {/* Card Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 md:mt-6"
          >
            <div className="rounded-md border border-brand-100 bg-brand-50 p-4 shadow-sm md:p-5">
              {/* Header with icon */}
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="material-symbols-outlined text-blue-600 text-lg md:text-xl">
                  payments
                </span>
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                  {t("step3.card_payment.title")}
                </h3>
              </div>

              {/* Payment details - responsive layout */}
              <div className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                {/* Account name */}
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-gray-500 mt-0.5 text-sm md:text-base">
                    badge
                  </span>
                  <span>
                    {t("step3.card_payment.account_name")}{" "}
                    <span className="font-medium">
                      {t("step3.card_payment.account_name_detail")}
                    </span>
                  </span>
                </div>

                {/* Bank name */}
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-gray-500 mt-0.5 text-sm md:text-base">
                    account_balance
                  </span>
                  <span>
                    {t("step3.card_payment.bank_name")}{" "}
                    <span className="font-medium">
                      {t("step3.card_payment.bank_name_detail")}{" "}
                    </span>
                  </span>
                </div>

                {/* Branch */}
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-gray-500 mt-0.5 text-sm md:text-base">
                    location_on
                  </span>
                  <span>
                    {t("step3.card_payment.branch")}{" "}
                    <span className="font-medium">
                      {" "}
                      {t("step3.card_payment.branch_detail")}{" "}
                    </span>
                  </span>
                </div>

                {/* Account number with copy button - responsive layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3 mt-3 md:mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-sm md:text-base">
                      credit_card
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("step3.card_payment.account_number")}
                      </p>
                      <p className="font-mono font-bold text-sm md:text-base text-gray-800 break-all">
                        {accountNumber}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center justify-center gap-1 px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all mt-2 sm:mt-0 ${
                      copied
                        ? "bg-green-100 text-green-800"
                        : "bg-brand-700 text-white hover:bg-brand-800"
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copied ? "check" : "content_copy"}
                    </span>
                    <span>
                      {copied
                        ? `${t("step3.card_payment.button.copied")}`
                        : `${t("step3.card_payment.button.copy")}`}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Additional info - responsive */}
              {/* <div className="mt-3 md:mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="material-symbols-outlined text-sm mt-0.5">
                    info
                  </span>
                  <p>กรุณาชำระเงินภายใน 24 ชั่วโมงหลังจากสมัคร</p>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* File Upload */}
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              <span className="material-symbols-outlined align-middle mr-1">
                attach_file
              </span>
              {t("step3.form_personal.paymentFile")}
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-brand-200 px-4 py-6 transition-colors hover:bg-brand-50">
                  <span className="material-symbols-outlined text-gray-400 text-4xl">
                    upload
                  </span>
                  <p className="text-sm text-gray-500">
                    {formData.transferFile ? (
                      formData.transferFile.name === "File" ? (
                        <span className="text-gray-400">
                          {t("step3.button.click_file")}
                        </span>
                      ) : (
                        formData.transferFile.name
                      )
                    ) : (
                      [t("step3.button.click_file")]
                    )}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex md:flex-row flex-col justify-between gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {t("step1.back_button")}
        </motion.button>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-white shadow-sm hover:bg-brand-800"
        >
          {t("step3.button.examine")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Step3Form;
