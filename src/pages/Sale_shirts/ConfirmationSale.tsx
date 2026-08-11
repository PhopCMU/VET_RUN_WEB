import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ShirtSize {
  shirtId: string;
  size: string;
  s_width: number;
  s_high: number;
}

interface ShirtItem {
  type: string; // shirtModelId (UUID)
  color: string; // shirtColorId (UUID)
  size: string; // sizeId (shirtSizeId)
  quantity: number;
}

interface NamedOption {
  id: string;
  name: string;
  name_en?: string;
}

interface ConfirmationProps {
  formData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    transferFile: File | null;
  };
  shirts: ShirtItem[];
  totalPrice: number;
  deliveryType: "delivery" | "pickup";
  onEdit: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  sizeMap: Record<string, ShirtSize>; // เพิ่ม sizeMap เพื่อดึงข้อมูลขนาด
  shirtModels: NamedOption[];
  shirtColors: NamedOption[];
}

const ConfirmationSale = ({
  formData,
  shirts,
  onEdit,
  onSubmit,
  totalPrice,
  deliveryType,
  isLoading = false,
  sizeMap,
  shirtModels,
  shirtColors,
}: ConfirmationProps) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  const [confirmedData, setConfirmedData] = useState(false);
  const [acceptedRefundPolicy, setAcceptedRefundPolicy] = useState(false);
  const [acceptedPDPA, setAcceptedPDPA] = useState(false);

  // ตรวจสอบว่าทั้ง 3 checkbox ถูกเลือก
  const agreed = confirmedData && acceptedRefundPolicy && acceptedPDPA;
  const totalQuantity = shirts.reduce(
    (total, shirt) => total + shirt.quantity,
    0,
  );

  console.log("ConfirmationSale: shirts", shirts);

  // สร้าง preview เมื่อมีการอัปโหลดไฟล์
  useEffect(() => {
    if (fileRef.current === formData.transferFile && previewUrl) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (formData.transferFile) {
      const url = URL.createObjectURL(formData.transferFile);
      setPreviewUrl(url);
      fileRef.current = formData.transferFile;
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [formData.transferFile, previewUrl]);

  // แปลง shirtModelId เป็น label จากข้อมูลจริงที่ดึงมาจาก backend
  const getShirtLabel = (type: string) => {
    const model = shirtModels.find((m: any) => m.shirtmodelId === type);
    console.log("getShirtLabel", type);
    if (!model) return "ไม่ทราบ";
    return model.name_en ? `${model.name} [${model.name_en}]` : model.name;
  };

  // แปลง shirtColorId เป็น label
  const getColorLabel = (color: string) => {
    const colorItem = shirtColors.find((c: any) => c.shirtcolorId === color);
    if (!colorItem) return "ไม่ทราบ";
    return colorItem.name_en
      ? `${colorItem.name} [${colorItem.name_en}]`
      : colorItem.name;
  };

  // ดึงข้อมูลขนาดจาก sizeMap
  const getSizeDetail = (sizeId: string) => {
    if (!sizeId) return null;
    return sizeMap[sizeId] || null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="content-panel mx-auto max-w-7xl p-5 sm:p-6 md:p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-green-100">
            <span className="material-symbols-outlined text-green-600 text-3xl">
              fact_check
            </span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("form_confirm.title")}
        </h2>
        <p className="text-gray-500">{t("form_confirm.subtitle")}</p>
      </div>

      {/* ข้อมูลผู้ซื้อ */}
      <div className="mb-7 rounded-md border border-brand-100 bg-brand-50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-blue-600">
            person
          </span>
          <h3 className="font-semibold text-lg text-gray-800">
            {t("form_sale.data_user.title")}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          <div className="flex items-start">
            <span className="material-symbols-outlined text-gray-500 text-sm mr-2 mt-0.5">
              badge
            </span>
            <div>
              <p className="font-medium text-gray-600">
                {t("form_sale.data_user.fullname")}
              </p>
              <p className="text-gray-800">{formData.fullName}</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="material-symbols-outlined text-gray-500 text-sm mr-2 mt-0.5">
              call
            </span>
            <div>
              <p className="font-medium text-gray-600">
                {t("form_sale.data_user.contact_number")}
              </p>
              <p className="text-gray-800">{formData.phone}</p>
            </div>
          </div>
          <div className="md:col-span-2 flex items-start">
            <span className="material-symbols-outlined text-gray-500 text-sm mr-2 mt-0.5">
              mail
            </span>
            <div>
              <p className="font-medium text-gray-600">
                {t("form_sale.data_user.email")}
              </p>
              <p className="text-gray-800">{formData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* จำนวนเสื้อ */}
      <div className="flex items-center gap-3 mb-7 p-4 bg-gray-50 rounded-xl">
        <span className="material-symbols-outlined text-gray-600">
          inventory_2
        </span>
        <div>
          <p className="font-medium text-gray-600">
            {t("form_sale.data_shirts.title")}
          </p>
          <p className="text-gray-800 text-lg font-semibold">
            {totalQuantity} {t("form_sale.data_shirts.shirts")} ·{" "}
            {shirts.length} {t("form_sale.data_shirts.variants")}
          </p>
        </div>
      </div>

      {/* รายละเอียดเสื้อแต่ละตัว */}
      <div className="mb-7 rounded-md border border-brand-100 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-purple-600">
            checkroom
          </span>
          <h3 className="font-semibold text-lg text-gray-800">
            {t("form_confirm.data_detail.title")}
          </h3>
        </div>

        {/* ตาราง (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100">
                <th className="p-3 text-left text-purple-800 font-semibold rounded-tl-lg">
                  {t("form_confirm.data_detail.no")}
                </th>
                <th className="p-3 text-left text-purple-800 font-semibold">
                  {t("form_confirm.data_detail.shirt_model")}
                </th>
                <th className="p-3 text-left text-purple-800 font-semibold">
                  {t("form_confirm.data_detail.shirt_color")}
                </th>
                <th className="p-3 text-left text-purple-800 font-semibold">
                  {t("form_confirm.data_detail.size")}
                </th>
                <th className="p-3 text-center text-purple-800 font-semibold">
                  {t("form_sale.data_shirts.line_quantity")}
                </th>
                <th className="p-3 text-right text-purple-800 font-semibold">
                  {t("form_confirm.data_detail.subtotal")}
                </th>
              </tr>
            </thead>
            <tbody>
              {shirts.map((shirt, index) => {
                const sizeDetail = getSizeDetail(shirt.size);
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-purple-50"
                    } ${index === shirts.length - 1 ? "rounded-b-lg" : ""}`}
                  >
                    <td className="p-3 border-b border-purple-100">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                          {index + 1}
                        </div>
                        <span>
                          {t("form_confirm.data_detail.sh")} {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border-b border-purple-100">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-gray-500 text-sm mr-2">
                          style
                        </span>
                        {getShirtLabel(shirt.type)}
                      </div>
                    </td>
                    <td className="p-3 border-b border-purple-100">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-gray-500 text-sm mr-2">
                          palette
                        </span>
                        {getColorLabel(shirt.color)}
                      </div>
                    </td>
                    <td className="p-3 border-b border-purple-100">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-gray-500 text-sm mr-2">
                          straighten
                        </span>
                        {sizeDetail?.size || "ไม่ทราบ"}
                      </div>
                    </td>
                    <td className="p-3 text-center border-b border-purple-100 font-semibold">
                      {shirt.quantity}
                    </td>
                    <td className="p-3 text-right border-b border-purple-100 font-semibold">
                      {(shirt.quantity * 350).toLocaleString()}{" "}
                      {t("form_sale.data_method.cost_summary.bath")}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* การ์ด (Mobile) */}
        <div className="md:hidden space-y-3">
          {shirts.map((shirt, index) => {
            const sizeDetail = getSizeDetail(shirt.size);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-md border border-brand-100 bg-brand-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-700">
                      {t("form_confirm.data_detail.sh")} {index + 1}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded-md col-span-2">
                    <div className="flex items-center text-gray-600 mb-1">
                      <span className="material-symbols-outlined text-sm mr-1">
                        style
                      </span>
                      <span>{t("form_confirm.data_detail.shirt_model")}</span>
                    </div>
                    <div className="font-medium text-gray-800">
                      {getShirtLabel(shirt.type)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center text-gray-600 mb-1">
                      <span className="material-symbols-outlined text-sm mr-1">
                        palette
                      </span>
                      <span>{t("form_confirm.data_detail.shirt_color")}</span>
                    </div>
                    <div className="font-medium text-gray-800">
                      {getColorLabel(shirt.color)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center text-gray-600 mb-1">
                      <span className="material-symbols-outlined text-sm mr-1">
                        straighten
                      </span>
                      <span>{t("form_confirm.data_detail.size")}</span>
                    </div>
                    <div className="font-medium text-gray-800">
                      {sizeDetail?.size || "ไม่ทราบ"}
                    </div>
                  </div>

                  {sizeDetail && (
                    <div className="bg-gray-50 p-2 rounded-md col-span-2">
                      <div className="text-gray-600 mb-1">
                        {t("form_confirm.data_detail.size_detail")}
                      </div>
                      <div className="font-medium text-gray-800 text-xs">
                        {`${t("step3.form_personal.shirt.chest_size")}:${
                          sizeDetail.s_width
                        }" ${t("step3.form_personal.shirt.length_size")}:${
                          sizeDetail.s_high
                        }"`}
                      </div>
                    </div>
                  )}
                  <div className="col-span-2 flex items-center justify-between rounded-md bg-white p-3 text-sm">
                    <span className="text-gray-600">
                      {t("form_sale.data_shirts.line_quantity")}:{" "}
                      {shirt.quantity}
                    </span>
                    <strong className="text-brand-900">
                      {(shirt.quantity * 350).toLocaleString()}{" "}
                      {t("form_sale.data_method.cost_summary.bath")}
                    </strong>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* แสดงยอดชำระ */}
      <div className="mb-7 rounded-md border border-green-200 bg-green-50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-green-600">
            receipt_long
          </span>
          <h3 className="font-semibold text-lg text-gray-800">
            {t("form_confirm.data_detail.total")}
          </h3>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-sm mr-2">
                checkroom
              </span>
              <span>
                {t("form_confirm.data_detail.sh_price")} {totalQuantity}{" "}
                {t("form_sale.data_shirts.shirts")} × 350{" "}
                {t("form_sale.data_method.cost_summary.bath")}
              </span>
              <span className="font-medium ml-5">
                {totalQuantity * 350}{" "}
                {t("form_sale.data_method.cost_summary.bath")}
              </span>
            </div>

            {deliveryType === "delivery" && (
              <div className="flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">
                  local_shipping
                </span>
                <span>
                  {t("form_sale.data_method.cost_summary.shipping_fee")}
                </span>
                <span className="font-medium ml-5">
                  +{50 + Math.max(0, totalQuantity - 1) * 5}{" "}
                  {t("form_sale.data_method.cost_summary.bath")}
                </span>
              </div>
            )}

            {deliveryType === "pickup" && (
              <div className="flex items-center text-green-600">
                <span className="material-symbols-outlined text-sm mr-2">
                  local_shipping
                </span>
                <span>
                  {t("form_sale.data_method.cost_summary.shipping_fee")}
                </span>
                <span className="ml-auto font-medium">
                  {t("form_sale.data_method.cost_summary.free")}
                </span>
              </div>
            )}
          </div>

          <div className="border-t md:border-t-0 md:border-l border-green-200 pt-4 md:pt-0 md:pl-4">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                {t("form_sale.data_method.cost_summary.total_amount")}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-green-700">
                {totalPrice.toLocaleString()}{" "}
                {t("form_sale.data_method.cost_summary.bath")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* วิธีรับเสื้อ */}
      <div className="mb-7 rounded-md border border-amber-100 bg-amber-50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-amber-600">
            local_shipping
          </span>
          <h3 className="font-semibold text-lg text-gray-800">
            {t("form_sale.data_method.title")}
          </h3>
        </div>

        {deliveryType === "delivery" ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {t("form_confirm.data_detail.delivery_address")}:
            </p>
            <div className="bg-white p-4 rounded-lg border border-amber-200">
              <div className="flex items-start">
                <span className="material-symbols-outlined text-amber-500 text-sm mr-2 mt-0.5">
                  home_pin
                </span>
                <p className="text-gray-800 whitespace-pre-line">
                  {formData.address}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-amber-700">
            <span className="material-symbols-outlined text-sm mr-2">
              store
            </span>
            <p>{t("form_sale.data_method.pick_up.subtitle")}</p>
          </div>
        )}
      </div>

      {/* สลิปการโอน */}
      {formData.transferFile && (
        <div className="mb-7 rounded-md border border-brand-100 bg-brand-50 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-600">
              receipt
            </span>
            <h3 className="font-semibold text-lg text-gray-800">
              {t("form_confirm.payment_upload.title")}
            </h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white p-4 rounded-lg border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                    description
                  </span>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("form_confirm.payment_upload.file_name")}:
                    </p>
                    <p className="text-gray-800 font-medium">
                      {formData.transferFile.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                    data_object
                  </span>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("form_confirm.payment_upload.file_size")}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {(formData.transferFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="material-symbols-outlined text-blue-500 text-sm mr-2">
                    category
                  </span>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("form_confirm.payment_upload.file_type")}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {formData.transferFile.type
                        .split("/")[1]
                        ?.toUpperCase() || "IMAGE"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="ตัวอย่างสลิป"
                  className="max-w-xs max-h-60 object-contain border border-gray-300 rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full max-w-xs h-60 flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-400 p-4">
                  <span className="material-symbols-outlined text-3xl mb-2">
                    image_not_supported
                  </span>
                  <p className="text-sm text-center">ไม่สามารถแสดงภาพได้</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ข้อตกลง */}
      <div className="mb-7">
        {/* Confirmation Checkboxes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-md border border-gray-200 bg-gray-50 p-5 sm:p-6"
        >
          <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined">verified</span>
            {t("form_confirm.checkbox_confirm.title")}
          </h3>

          <div className="space-y-4">
            {/* Data Confirmation Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="dataConfirmation"
                checked={confirmedData}
                onChange={(e) => setConfirmedData(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="dataConfirmation"
                className="text-sm text-gray-700 flex-1"
              >
                <span className="text-gray-600">
                  {t("form_confirm.checkbox_confirm.subtitle")}
                </span>
              </label>
            </div>

            {/* Refund Policy Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="refundPolicy"
                checked={acceptedRefundPolicy}
                onChange={(e) => setAcceptedRefundPolicy(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="refundPolicy"
                className="text-sm text-gray-700 flex-1"
              >
                <span className="text-gray-600">
                  {t(
                    "form_confirm.checkbox_confirm.refund_policy_description",
                    "คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่ ขอสงวนสิทธิ์ไม่คืนเงินค่าลงทะเบียนหลังจากชำระค่าลงทะเบียนเรียบร้อยแล้ว กรุณาตรวจสอบรายละเอียดการชำระเงินให้ละเอียดก่อนชำระเงิน",
                  )}
                </span>
              </label>
            </div>

            {/* PDPA Consent Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="pdpaConsent"
                checked={acceptedPDPA}
                onChange={(e) => setAcceptedPDPA(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="pdpaConsent"
                className="text-sm text-gray-700 flex-1"
              >
                <span className="text-gray-600">
                  {t("form_confirm.checkbox_confirm.pdpa")}
                </span>
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ปุ่ม */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onEdit}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          {t("form_confirm.button_edit")}
        </motion.button>

        <motion.button
          whileHover={{ scale: agreed && !isLoading ? 1.03 : 1 }}
          whileTap={{ scale: agreed && !isLoading ? 0.97 : 1 }}
          type="button"
          onClick={agreed ? onSubmit : undefined}
          disabled={!agreed || isLoading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all ${
            agreed && !isLoading
              ? "bg-brand-700 shadow-md hover:bg-brand-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{t("loading")}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              <span>{t("form_confirm.button_confirm")}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ConfirmationSale;
