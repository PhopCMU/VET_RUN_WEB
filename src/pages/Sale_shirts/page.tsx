import { AnimatePresence, motion } from "framer-motion";
import { FunctionMenuSizeShirt } from "../../routers/GetRouter";
import { useEffect, useRef, useState, useMemo, type ChangeEvent } from "react";
import ConfirmationSale from "./ConfirmationSale";
import { useTranslation } from "react-i18next";
import { AlertModal } from "../../components/AlertModal";
import { ProcressLoadingModal } from "../../components/ProcessLoadingModal";
import { SalesRouterCryptoJS } from "../../routers/PostRouter";
import { useNavigate } from "react-router-dom";
import images from "../../constant/images";

interface ShirtSize {
  shirtId: string;
  size: string;
  s_width: number;
  s_high: number;
}

interface ShirtItem {
  type: string; // shirtModelId
  color: string; // shirtColorId
  size: string; // sizeId (shirtId)
  quantity: number;
}

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  transferFile: File | null;
};

const SaleShirt = () => {
  const { t } = useTranslation();
  const router = useNavigate();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeShirt, setActiveShirt] = useState(0);
  const [shirtModels, setShirtModels] = useState<any[]>([]);
  const [shirtColors, setShirtColors] = useState<any[]>([]);
  const [shirtSize, setShirtSize] = useState<ShirtSize[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    transferFile: null,
  });

  const listMenuShrit = async () => {
    const response = await FunctionMenuSizeShirt();
    if (response.success) {
      setShirtSize(response.data.size);
      setShirtModels(response.data.shirtModel);
      setShirtColors(response.data.shirtColor);
    }
  };

  useEffect(() => {
    if (!hasShirt.current) {
      hasShirt.current = true;
      listMenuShrit();
    }
  }, []);

  const [shirts, setShirts] = useState<ShirtItem[]>([
    { type: "", color: "", size: "", quantity: 1 },
  ]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const MAX_SHIRTS = 100;
  const SHIRT_PRICE =
    shirtModels.find((model) => model.shirtmodelId === shirts[0]?.type)
      ?.price || 0;
  const shirtGallery = [
    {
      image: images.familyShirtsBlue,
      label: "",
      distance: t("home.ex_shirt.RB"),
      accent: "#",
    },
    {
      image: images.familyShirtsGreen,
      label: "",
      distance: t("home.ex_shirt.PG"),
      accent: "#",
    },
    {
      image: images.familyShirtsAlternate,
      label: "",
      distance: t("home.ex_shirt.CF"),
      accent: "#",
    },
  ];

  const hasShirt = useRef(false);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: "success" | "warning" | "error";
    title?: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "warning",
    message: "",
  });

  const showCustomAlert = (
    message: string,
    options?: {
      title?: string;
      type?: "success" | "warning" | "error";
    },
  ): Promise<void> => {
    return new Promise((resolve) => {
      const { title = t("page.modal.warning"), type = "warning" } =
        options || {};

      setAlertState({
        isOpen: true,
        message,
        title,
        type,
        confirmText: t("page.button.ok"),
        onConfirm: () => {
          setAlertState((prev) => ({ ...prev, isOpen: false }));
          resolve(); // resolve เมื่อกด OK
        },
      });
    });
  };
  const [openAddress, setOpenAddress] = useState(false);

  const selectedQuantity = shirts.reduce(
    (total, shirt) => total + shirt.quantity,
    0,
  );

  // คำนวณยอดรวม
  useEffect(() => {
    let price = selectedQuantity * SHIRT_PRICE;
    if (openAddress) {
      const shippingFirst = 50;
      const shippingAdditional = Math.max(0, selectedQuantity - 1) * 5;
      price += shippingFirst + shippingAdditional;
    }

    setTotalPrice(price);
  }, [selectedQuantity, openAddress]);

  const accountNumber = "667-411644-1";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber.replace(/-/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        phone: value.replace(/\D/g, "").slice(0, 10),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" || type === "radio" ? checked : value,
    }));
  };

  const handleShirtChange = (
    index: number,
    field: keyof ShirtItem,
    value: string | number,
  ) => {
    setShirts((prev) =>
      prev.map((shirt, shirtIndex) =>
        shirtIndex === index ? { ...shirt, [field]: value } : shirt,
      ),
    );
  };

  const addShirtLine = () => {
    if (selectedQuantity >= MAX_SHIRTS) return;
    setShirts((prev) => [
      ...prev,
      { type: "", color: "", size: "", quantity: 1 },
    ]);
  };

  const removeShirtLine = (index: number) => {
    setShirts((prev) => prev.filter((_, shirtIndex) => shirtIndex !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, transferFile: file }));
    }
  };

  const sizeMap = useMemo(() => {
    const map: Record<string, ShirtSize> = {};
    shirtSize.forEach((size) => {
      map[size.shirtId] = size;
    });
    return map;
  }, [shirtSize]);

  const handleSubmit = async () => {
    if (
      selectedQuantity === 0 ||
      selectedQuantity > MAX_SHIRTS ||
      shirts.some((shirt) => !shirt.type || !shirt.color || !shirt.size)
    ) {
      showCustomAlert("กรุณากรอกข้อมูลเสื้อทุกตัวให้ครบ", {
        title: "กรุณากรอกข้อมูลเสื้อทุกตัวให้ครบ",
        type: "warning",
      });
      return;
    }

    const orderItems = shirts.flatMap((shirt) =>
      Array.from({ length: shirt.quantity }, () => ({
        shirtModelId: shirt.type,
        shirtColorId: shirt.color,
        sizeId: shirt.size,
      })),
    );
    const updatedFormData = {
      ...formData,
      quantity: String(selectedQuantity),
      sh_collection_method: openAddress ? "delivery" : "pickup",
      total_amount: totalPrice,
      orderItems: { create: orderItems },
    };

    setIsLoading(true);
    setUploadProgress(0);
    const dataToSend = new FormData();

    Object.entries(updatedFormData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === "object" && !(value instanceof File)) {
        dataToSend.append(key, JSON.stringify(value));
      } else {
        dataToSend.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const response = await SalesRouterCryptoJS(dataToSend, setUploadProgress);
      if (response.success) {
        showCustomAlert(t("process_loading.message.success"), {
          title: t("page.modal.success"),
          type: "success",
        });
      } else {
        showCustomAlert(response?.message as string, {
          title: t("page.modal.warning"),
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("ส่งข้อมูลไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-frame flex items-start justify-center">
      <div className="w-full max-w-7xl">
        {step === "form" ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="content-panel mb-6 p-5 sm:p-7 md:p-9"
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-brand-100">
                  <span className="material-symbols-outlined text-3xl text-brand-700">
                    point_of_sale
                  </span>
                </div>
                <h1 className="text-center text-2xl font-extrabold text-brand-900 md:text-3xl">
                  {t("form_sale.title")}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  {t("form_sale.subtitle")}
                </p>
              </div>

              {/* ข้อมูลผู้ซื้อ */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 mr-2">
                    person
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("form_sale.data_user.title")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("form_sale.data_user.fullname")}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                        badge
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={t("form_sale.data_user.fullname")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("form_sale.data_user.contact_number")}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                        call
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={t("form_sale.data_user.contact_number")}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("form_sale.data_user.email")}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                        mail
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={t("form_sale.data_user.email")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ex.เสื้อที่ระลึก */}
              <section id="shirts" className="overflow-hidden  mb-8">
                <div className="mx-auto ">
                  <div className="grid gap-5 ">
                    <motion.div
                      key={activeShirt}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="relative min-h-[330px] overflow-hidden rounded-md bg-[#242424] "
                    >
                      <img
                        src={shirtGallery[activeShirt].image}
                        alt={`${shirtGallery[activeShirt].label} ${shirtGallery[activeShirt].distance}`}
                        className="absolute inset-0 h-full w-full object-contain object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-20 text-white sm:px-7 sm:pb-7">
                        <div>
                          <p className="text-sm font-semibold text-white/70">
                            {shirtGallery[activeShirt].label}
                          </p>
                          <p className="mt-1 text-3xl font-black">
                            {shirtGallery[activeShirt].distance}
                          </p>
                        </div>
                        <span
                          className="h-3 w-16"
                          style={{
                            backgroundColor: shirtGallery[activeShirt].accent,
                          }}
                        />
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
                      {shirtGallery.map((shirt, index) => (
                        <button
                          key={shirt.image}
                          onClick={() => setActiveShirt(index)}
                          aria-label={`ดูแบบเสื้อ ${shirt.label} ${shirt.distance}`}
                          aria-pressed={activeShirt === index}
                          className={`relative min-h-24 overflow-hidden rounded-md border-2 bg-[#242424] transition-all sm:min-h-32 lg:min-h-0 ${
                            activeShirt === index
                              ? "border-brand-600 shadow-[0_8px_24px_rgba(73,24,107,0.18)]"
                              : "border-transparent opacity-65 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={shirt.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                            loading="lazy"
                          />
                          <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                            {shirt.distance}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="mb-4 flex items-center justify-between gap-4 rounded-md border border-brand-200 bg-brand-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand-700">
                    inventory
                  </span>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("form_sale.data_shirts.total_selected")}
                    </p>
                    <p className="font-bold text-brand-900">
                      {selectedQuantity}/{MAX_SHIRTS}{" "}
                      {t("form_sale.data_shirts.shirts")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addShirtLine}
                  disabled={selectedQuantity >= MAX_SHIRTS}
                  className="flex items-center gap-2 rounded-md bg-brand-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  {t("form_sale.data_shirts.add_line")}
                </button>
              </div>

              {/* รายการเสื้อแบบแยกรุ่น สี ไซส์ และจำนวน */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 mr-2">
                    checklist
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("form_sale.data_shirts.title_details")}
                  </h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {t("form_sale.data_shirts.group_hint")}
                </p>

                <div className="space-y-4">
                  {shirts.map((shirt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4 rounded-md border border-brand-100 bg-brand-50 p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {t("form_sale.data_shirts.order_line")} {index + 1}
                          </h3>
                        </div>
                        {shirts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeShirtLine(index)}
                            aria-label={t("form_sale.data_shirts.remove_line")}
                            title={t("form_sale.data_shirts.remove_line")}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-300"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        )}
                      </div>

                      {/* เลือกสีเสื้อ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("form_sale.data_shirts.shirt_color")}
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                            style
                          </span>
                          <select
                            value={shirt.color}
                            onChange={(e) =>
                              handleShirtChange(index, "color", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                          >
                            <option value="">
                              -- {t("form_sale.data_shirts.shirt_color")} --
                            </option>
                            {shirtColors.map((s) => (
                              <option
                                key={s.shirtcolorId}
                                value={s.shirtcolorId}
                              >
                                {s.name} {"["}
                                {s.name_en}
                                {"]"}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* เลือกรุ่นเสื้อ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("form_sale.data_shirts.shirt_model")}
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                            style
                          </span>
                          <select
                            value={shirt.type}
                            onChange={(e) =>
                              handleShirtChange(index, "type", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                          >
                            <option value="">
                              -- {t("form_sale.data_shirts.shirt_model")} --
                            </option>
                            {shirtModels.map((s) => (
                              <option
                                key={s.shirtmodelId}
                                value={s.shirtmodelId}
                              >
                                {s.name} {"["}
                                {s.name_en}
                                {"]"}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* เลือกไซส์เสื้อ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("form_sale.data_shirts.shirt_size")}
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                            straighten
                          </span>
                          <select
                            value={shirt.size}
                            onChange={(e) =>
                              handleShirtChange(index, "size", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                          >
                            <option value="">
                              -- {t("form_sale.data_shirts.shirt_size")} --
                            </option>
                            {shirtSize.map((shirt) => (
                              <option key={shirt.shirtId} value={shirt.shirtId}>
                                {`${shirt.size} = (${t(
                                  "step3.form_personal.shirt.chest_size",
                                )}:${shirt.s_width} ${t(
                                  "step3.form_personal.shirt.length_size",
                                )}:${shirt.s_high})`}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-brand-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <span className="mb-2 block text-sm font-medium text-gray-700">
                            {t("form_sale.data_shirts.line_quantity")}
                          </span>
                          <div className="grid h-11 w-36 grid-cols-[44px_1fr_44px] overflow-hidden rounded-md border border-gray-300 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                handleShirtChange(
                                  index,
                                  "quantity",
                                  Math.max(1, shirt.quantity - 1),
                                )
                              }
                              disabled={shirt.quantity === 1}
                              className="flex items-center justify-center border-r border-gray-200 disabled:opacity-35"
                              aria-label={t("form_sale.data_shirts.decrease")}
                            >
                              <span className="material-symbols-outlined">
                                remove
                              </span>
                            </button>
                            <span className="flex items-center justify-center font-bold">
                              {shirt.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleShirtChange(
                                  index,
                                  "quantity",
                                  shirt.quantity + 1,
                                )
                              }
                              disabled={selectedQuantity >= MAX_SHIRTS}
                              className="flex items-center justify-center border-l border-gray-200 disabled:opacity-35"
                              aria-label={t("form_sale.data_shirts.increase")}
                            >
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </button>
                          </div>
                        </div>
                        <p className="text-right text-sm text-gray-600">
                          {shirt.quantity} × {SHIRT_PRICE} ={" "}
                          <strong className="text-base text-brand-900">
                            {(shirt.quantity * SHIRT_PRICE).toLocaleString()}{" "}
                            {t("form_sale.data_method.cost_summary.bath")}
                          </strong>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* วิธีรับเสื้อ */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 mr-2">
                    local_shipping
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("form_sale.data_method.title")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-md border-2 p-4 transition ${
                      !openAddress
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setOpenAddress(false)}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          id="pickup"
                          name="choose"
                          checked={!openAddress}
                          onChange={() => setOpenAddress(false)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <label htmlFor="pickup" className="ml-3 block">
                        <span className="font-medium text-gray-900">
                          {t("form_sale.data_method.pick_up.title")}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          {t("form_sale.data_method.pick_up.subtitle")}
                        </p>
                      </label>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-md border-2 p-4 transition ${
                      openAddress
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setOpenAddress(true)}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          id="delivery"
                          name="choose"
                          checked={openAddress}
                          onChange={() => setOpenAddress(true)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <label htmlFor="delivery" className="ml-3 block">
                        <span className="font-medium text-gray-900">
                          {t("form_sale.data_method.delivery.title")}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          {t("form_sale.data_method.delivery.subtitle")}
                        </p>
                      </label>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ที่อยู่จัดส่ง */}
              {openAddress && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <span className="material-symbols-outlined text-blue-600 mr-2">
                      home_pin
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {t(
                        "form_sale.data_method.delivery.delivery_address.title",
                      )}
                    </h2>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                      home
                    </span>
                    <textarea
                      name="address"
                      placeholder={t(
                        "form_sale.data_method.delivery.delivery_address.address",
                      )}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      rows={2}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* แสดงยอดชำระ */}
              {selectedQuantity > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 rounded-md border border-brand-100 bg-brand-50 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <span className="material-symbols-outlined text-blue-600">
                        receipt_long
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-800">
                      {t("form_sale.data_method.cost_summary.title")}
                    </h3>
                  </div>

                  <div className="space-y-3 text-gray-700">
                    {/* รายการสินค้า */}
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                          checkroom
                        </span>
                        <span>
                          {t("form_sale.data_method.cost_summary.shirt")}{" "}
                          {selectedQuantity} {t("form_sale.data_shirts.shirts")}{" "}
                          × 350 {t("form_sale.data_method.cost_summary.bath")}
                        </span>
                      </div>
                      <span className="font-medium">
                        {selectedQuantity * SHIRT_PRICE}{" "}
                        {t("form_sale.data_method.cost_summary.bath")}
                      </span>
                    </div>

                    {/* ค่าจัดส่ง */}
                    {openAddress ? (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-blue-100">
                          <div className="flex items-center">
                            <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                              local_shipping
                            </span>
                            <span>
                              {" "}
                              {t(
                                "form_sale.data_method.cost_summary.shipping_fee_f",
                              )}
                            </span>
                          </div>
                          <span className="font-medium">
                            +50 {t("form_sale.data_method.cost_summary.bath")}
                          </span>
                        </div>

                        {selectedQuantity > 1 && (
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <div className="flex items-center">
                              <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                                add
                              </span>
                              <span>
                                {t(
                                  "form_sale.data_method.cost_summary.additional_shipping_fee",
                                )}{" "}
                                ({selectedQuantity - 1}{" "}
                                {t("form_sale.data_shirts.shirts")})
                              </span>
                            </div>
                            <span className="font-medium">
                              +{Math.max(0, selectedQuantity - 1) * 5}{" "}
                              {t("form_sale.data_method.cost_summary.bath")}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col justify-start items-start py-2 border-b border-blue-100">
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-green-500 text-sm mr-2">
                            local_shipping
                          </span>
                          <span>
                            {t(
                              "form_sale.data_method.cost_summary.shipping_fee",
                            )}
                          </span>
                        </div>
                        <span className=" text-[14px] font-medium text-green-600">
                          {t("form_sale.data_method.cost_summary.free")}
                        </span>
                      </div>
                    )}

                    {/* ยอดรวมทั้งหมด */}
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-between items-center pt-3 mt-2 border-t border-blue-200"
                    >
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-blue-600 mr-2">
                          payments
                        </span>
                        <span className="font-semibold text-blue-900 text-lg">
                          {t("form_sale.data_method.cost_summary.total_amount")}
                        </span>
                      </div>

                      <span className="font-bold text-blue-900 text-xl">
                        {totalPrice.toLocaleString()}{" "}
                        {t("form_sale.data_method.cost_summary.bath")}
                      </span>
                    </motion.div>

                    {/* หมายเหตุ */}
                    {openAddress && (
                      <div className="mt-3 p-3 bg-blue-100 rounded-lg text-sm text-blue-700 flex items-center">
                        <span className="material-symbols-outlined text-sm mr-2 mt-0.5">
                          info
                        </span>
                        <div className="flex flex-col gap-2">
                          <p>{t("form_sale.data_method.cost_summary.info")}</p>
                          <p className="text-green-800">
                            {t("form_sale.data_method.cost_summary.info2")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Payment Info */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-md border border-brand-100 bg-brand-50 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <span className="material-symbols-outlined text-blue-600">
                        payments
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("form_sale.data_method.payment_information.title")}
                    </h3>
                  </div>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-gray-500 mt-0.5 text-sm">
                        badge
                      </span>
                      <span className="text-sm">
                        {t("step3.card_payment.account_name")}{" "}
                        <span className="font-medium">
                          {t("step3.card_payment.account_name_detail")}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-gray-500 mt-0.5 text-sm">
                        account_balance
                      </span>
                      <span className="text-sm">
                        {t("step3.card_payment.bank_name")}{" "}
                        <span className="font-medium">
                          {t("step3.card_payment.bank_name_detail")}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-gray-500 mt-0.5 text-sm">
                        location_on
                      </span>
                      <span className="text-sm">
                        {t("step3.card_payment.branch")}{" "}
                        <span className="font-medium">
                          {t("step3.card_payment.branch_detail")}
                        </span>
                      </span>
                    </div>

                    {/* Copy Account Number */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">
                          credit_card
                        </span>
                        <div>
                          <p className="text-xs text-gray-500">
                            {t("step3.card_payment.account_number")}
                          </p>
                          <p className="font-mono font-bold text-gray-800 break-all">
                            {accountNumber}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleCopy}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                </motion.div>
              </div>

              {/* อัปโหลดสลิป */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 mr-2">
                    receipt
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("form_sale.data_method.upload_transfer.title")}
                  </h2>
                </div>

                <label className="block mb-3 text-sm font-medium text-gray-700">
                  <span className="material-symbols-outlined align-middle mr-1 text-sm">
                    attach_file
                  </span>
                  {t("form_sale.data_method.upload_transfer.subtitle")}
                </label>

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-brand-200 px-4 py-6 transition hover:bg-brand-50"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">
                        {formData.transferFile ? "check_circle" : "upload"}
                      </span>
                      <p className="text-sm text-gray-500">
                        {formData.transferFile ? (
                          <span className="text-green-600 font-medium">
                            {formData.transferFile.name}
                          </span>
                        ) : (
                          <span>
                            {t(
                              "form_sale.data_method.upload_transfer.click_upload",
                            )}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t("form_sale.data_method.upload_transfer.image_file")}{" "}
                        (JPG, PNG)
                      </p>
                    </motion.div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* ปุ่มส่งฟอร์ม */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  if (
                    !formData.fullName ||
                    !formData.phone ||
                    !formData.email
                  ) {
                    showCustomAlert("กรุณากรอกข้อมูลให้ครบ", {
                      title: "",
                      type: "warning",
                    });
                    return;
                  }
                  if (shirts.some((s) => !s.type || !s.color || !s.size)) {
                    showCustomAlert("กรุณาเลือกสี รุ่น และไซส์ให้ครบทุกตัว", {
                      title: "",
                      type: "warning",
                    });

                    return;
                  }
                  if (formData.transferFile === null) {
                    showCustomAlert("กรุณาอัปโหลดสลิปการโอนเงิน", {
                      title: "",
                      type: "warning",
                    });
                    return;
                  }
                  setStep("confirm");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-700 py-3.5 font-semibold text-white shadow-md transition hover:bg-brand-800"
              >
                <span className="material-symbols-outlined">point_of_sale</span>
                {t("form_sale.data_method.upload_transfer.confirm_order")}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <ConfirmationSale
            formData={formData}
            shirts={shirts}
            totalPrice={totalPrice}
            deliveryType={openAddress ? "delivery" : "pickup"}
            onEdit={() => setStep("form")}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            sizeMap={sizeMap} // ถ้าต้องการให้ ConfirmationSale แสดงข้อมูล size, s_width, s_high
            shirtModels={shirtModels}
            shirtColors={shirtColors}
          />
        )}
      </div>
      <AlertModal
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        confirmText={alertState.confirmText}
        onClose={() => {
          if (alertState.onConfirm) {
            alertState.onConfirm();
          } else {
            setAlertState((prev) => ({ ...prev, isOpen: false }));
          }
        }}
        onConfirm={() => {
          if (alertState.onConfirm) {
            if (alertState.type === "success") {
              router("/sale/shirt/tracking?id=tracking");
              setAlertState((prev) => ({ ...prev, isOpen: false }));
            } else {
              setAlertState((prev) => ({ ...prev, isOpen: false }));
            }
          } else {
            setAlertState((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      />
      <ProcressLoadingModal
        isOpen={isLoading}
        progress={uploadProgress}
        isError={false}
        onClose={() => setIsLoading(false)}
      />
    </div>
  );
};

export default SaleShirt;
