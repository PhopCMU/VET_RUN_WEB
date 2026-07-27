import { AnimatePresence, motion } from "framer-motion";
import { FunctionMenuSizeShirt } from "../../routers/GetRouter";
import { useEffect, useRef, useState, useMemo, type ChangeEvent } from "react";
import ConfirmationSale from "./ConfirmationSale";
import { useTranslation } from "react-i18next";
import { AlertModal } from "../../components/AlertModal";
import { ProcressLoadingModal } from "../../components/ProcessLoadingModal";
import { SalesRouterCryptoJS } from "../../routers/PostRouter";
import { useNavigate } from "react-router-dom";

interface ShirtSize {
  shirtId: string;
  size: string;
  s_width: number;
  s_high: number;
}

interface ShirtItem {
  type: string; // shirtModelId
  size: string; // sizeId (shirtId)
}

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  quantity: string;
  address: string;
  transferFile: File | null;
};

const SaleShirt = () => {
  const { t } = useTranslation();
  const router = useNavigate();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [shirtSize, setShirtSize] = useState<ShirtSize[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    quantity: "",
    address: "",
    transferFile: null,
  });

  const [shirts, setShirts] = useState<ShirtItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shirtModels] = useState<
    { id: string; name: string; color: string; price: number }[]
  >([
    {
      id: "1298b333-6577-437b-b9d1-076b11716e01",
      name: "4 KM",
      color: "Brownish Pink",
      price: 350,
    },
    {
      id: "a4574514-b16b-4fc7-9330-146d0cb6e647",
      name: "11 KM",
      color: "Brownish Blue",
      price: 350,
    },
  ]);

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
    }
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

  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const listMenuShrit = async () => {
    const response = await FunctionMenuSizeShirt();
    if (response.success) {
      setShirtSize(response.data);
    }
  };

  useEffect(() => {
    if (!hasShirt.current) {
      hasShirt.current = true;
      listMenuShrit();
    }
  }, []);

  // คำนวณยอดรวม
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    if (qty === 0) {
      setTotalPrice(0);
      return;
    }

    let price = qty * 350;
    if (openAddress) {
      const shippingFirst = 50;
      const shippingAdditional = Math.max(0, qty - 1) * 5;
      price += shippingFirst + shippingAdditional;
    }

    setTotalPrice(price);
  }, [formData.quantity, openAddress]);

  const accountNumber = "667-411644-1";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber.replace(/-/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // const handleInputChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value, type } = e.target;
  //   const checked = (e.target as HTMLInputElement).checked;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" || type === "radio" ? checked : value,
  //   }));

  //   if (name === "quantity") {
  //     const qty = parseInt(value) || 0;
  //     setShirts(Array.from({ length: qty }, () => ({ type: "", size: "" })));
  //   }
  // };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, ""); // \D = ไม่ใช่ตัวเลข
      const limitedValue = numericValue.slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phone: limitedValue,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" || type === "radio" ? checked : value,
    }));
    if (name === "quantity") {
      const qty = parseInt(value) || 0;
      setShirts(Array.from({ length: qty }, () => ({ type: "", size: "" })));
    }
  };

  const handleShirtChange = (
    index: number,
    field: "type" | "size",
    value: string
  ) => {
    setShirts((prev) =>
      prev.map((shirt, i) =>
        i === index ? { ...shirt, [field]: value } : shirt
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, transferFile: e.target.files![0] }));
    }
  };

  // สร้าง sizeMap เพื่อดึงข้อมูลขนาดจาก shirtId
  const sizeMap = useMemo(() => {
    const map: Record<string, ShirtSize> = {};
    shirtSize.forEach((size) => {
      map[size.shirtId] = size;
    });
    return map;
  }, [shirtSize]);

  const selectedQuantity = parseInt(formData.quantity) || 0;

  const handleSubmit = async () => {
    const qty = parseInt(formData.quantity) || 0;

    if (qty === 0 || shirts.some((s) => !s.type || !s.size)) {
      showCustomAlert("กรุณากรอกข้อมูลเสื้อทุกตัวให้ครบ", {
        title: "กรุณากรอกข้อมูลเสื้อทุกตัวให้ครบ",
        type: "warning",
      });
      return;
    }

    // ✅ สร้าง orderItems จาก shirts
    const orderItems = shirts.map((shirt) => ({
      shirtModelId: shirt.type,
      sizeId: shirt.size,
    }));

    // ✅ สร้าง object ใหม่ที่รวมข้อมูลที่จะส่ง (ไม่ใช้ setFormData เพื่อรอ state update)
    const updatedFormData = {
      ...formData,
      sh_collection_method: openAddress ? "delivery" : "pickup",
      total_amount: totalPrice,
      orderItems: {
        create: orderItems,
      },
    };

    setIsLoading(true);
    setUploadProgress(0);

    const dataToSend = new FormData();

    Object.entries(updatedFormData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // หาก value เป็น object → แปลงเป็น JSON string
      if (typeof value === "object" && !(value instanceof File)) {
        dataToSend.append(key, JSON.stringify(value));
      } else {
        // หากเป็น File หรือ primitive type
        dataToSend.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      // console.log("Sending payload:", Object.fromEntries(dataToSend)); // ใช้ Object.fromEntries เพื่อดูข้อมูล
      // console.log("Updated form data:", updatedFormData);
      const response = await SalesRouterCryptoJS(dataToSend, setUploadProgress);

      if (response.success) {
        showCustomAlert(t("process_loading.message.success"), {
          title: t("page.modal.success"),
          type: "success",
        });
      } else if (response?.success === false) {
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
    <div className="w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="w-full max-w-2xl">
        {step === "form" ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 md:p-9 mb-6"
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="material-symbols-outlined text-blue-600 text-3xl">
                    point_of_sale
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
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

              {/* จำนวนเสื้อ */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 mr-2">
                    inventory
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("form_sale.data_shirts.title")}
                  </h2>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form_sale.data_shirts.subtitle")}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-sm">
                    numbers
                  </span>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                  >
                    <option value="">
                      -- {t("form_sale.data_shirts.select_quantity")} --
                    </option>
                    {quantityOptions.map((num) => (
                      <option key={num} value={num}>
                        {num} {t("form_sale.data_shirts.shirts")}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* รายการเสื้อแต่ละตัว */}
              {selectedQuantity > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <span className="material-symbols-outlined text-blue-600 mr-2">
                      checklist
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {t("form_sale.data_shirts.shirt_number")}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {t("form_sale.data_shirts.subtitle_details")}
                  </p>

                  <div className="space-y-4">
                    {Array.from({ length: selectedQuantity }).map(
                      (_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm space-y-4"
                        >
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-medium text-gray-800">
                              {t("form_sale.data_shirts.shirt_number")}{" "}
                              {index + 1}
                            </h3>
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
                                value={shirts[index]?.type || ""}
                                onChange={(e) =>
                                  handleShirtChange(
                                    index,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                              >
                                <option value="">
                                  -- {t("form_sale.data_shirts.shirt_model")} --
                                </option>
                                {shirtModels.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name} {"["}
                                    {s.color}
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
                                value={shirts[index]?.size || ""}
                                onChange={(e) =>
                                  handleShirtChange(
                                    index,
                                    "size",
                                    e.target.value
                                  )
                                }
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                              >
                                <option value="">
                                  -- {t("form_sale.data_shirts.shirt_size")} --
                                </option>
                                {shirtSize.map((shirt) => (
                                  <option
                                    key={shirt.shirtId}
                                    value={shirt.shirtId}
                                  >
                                    {`${shirt.size} = (${t(
                                      "step3.form_personal.shirt.chest_size"
                                    )}:${shirt.s_width} ${t(
                                      "step3.form_personal.shirt.length_size"
                                    )}:${shirt.s_high})`}
                                  </option>
                                ))}
                              </select>
                              <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                                expand_more
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              )}

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
                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                      !openAddress
                        ? "border-blue-500 bg-blue-50"
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
                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                      openAddress
                        ? "border-blue-500 bg-blue-50"
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
                        "form_sale.data_method.delivery.delivery_address.title"
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
                        "form_sale.data_method.delivery.delivery_address.address"
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
                  className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm"
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
                          {formData.quantity}{" "}
                          {t("form_sale.data_shirts.shirts")} × 350{" "}
                          {t("form_sale.data_method.cost_summary.bath")}
                        </span>
                      </div>
                      <span className="font-medium">
                        {parseInt(formData.quantity) * 350}{" "}
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
                                "form_sale.data_method.cost_summary.shipping_fee_f"
                              )}
                            </span>
                          </div>
                          <span className="font-medium">
                            +50 {t("form_sale.data_method.cost_summary.bath")}
                          </span>
                        </div>

                        {parseInt(formData.quantity) > 1 && (
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <div className="flex items-center">
                              <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                                add
                              </span>
                              <span>
                                {t(
                                  "form_sale.data_method.cost_summary.additional_shipping_fee"
                                )}{" "}
                                ({parseInt(formData.quantity) - 1}{" "}
                                {t("form_sale.data_shirts.shirts")})
                              </span>
                            </div>
                            <span className="font-medium">
                              +
                              {Math.max(0, parseInt(formData.quantity) - 1) * 5}{" "}
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
                              "form_sale.data_method.cost_summary.shipping_fee"
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
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm"
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
                            : "bg-blue-600 text-white hover:bg-blue-700"
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
                      className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
                              "form_sale.data_method.upload_transfer.click_upload"
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
                  if (shirts.length !== selectedQuantity) {
                    showCustomAlert("กรุณาเลือกรายละเอียดเสื้อให้ครบตามจำนวน", {
                      title: "",
                      type: "warning",
                    });
                    return;
                  }
                  if (shirts.some((s) => !s.type || !s.size)) {
                    showCustomAlert("กรุณาเลือกรุ่นและไซส์ให้ครบทุกตัว", {
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center justify-center gap-2"
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
            sizeMap={sizeMap} // ถ้าต้องการให้ ConfirmationSale แสดงข้อมูล size, s_width, s_high
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
