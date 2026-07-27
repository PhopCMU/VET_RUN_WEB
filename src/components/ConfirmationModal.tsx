import { motion } from "framer-motion";
import { useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  formData: any;
  onConfirm: () => void;
  onEdit: () => void;
}

const ConfirmationModal: FC<Props> = ({ formData, onConfirm, onEdit }) => {
  // สร้าง URL สำหรับแสดงรูปภาพ
  const [paymentImagePreview, setPaymentImagePreview] = useState<string | null>(
    null
  );
  const [confirmedData, setConfirmedData] = useState(false);
  const [acceptedRefundPolicy, setAcceptedRefundPolicy] = useState(false);
  const [acceptedPDPA, setAcceptedPDPA] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (formData.transferFile instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(formData.transferFile);
    }
  }, [formData.transferFile]);

  const getCategoryFromAge = (age: string | number): string => {
    const numAge = typeof age === "string" ? parseInt(age, 10) : age;

    if (isNaN(numAge)) return "";

    if (numAge < 20) return "Y19";
    if (numAge < 30) return "Y20";
    if (numAge < 40) return "Y30";
    if (numAge < 50) return "Y40";

    return "Y50";
  };

  const isConfirmButtonDisabled =
    !confirmedData || !acceptedRefundPolicy || !acceptedPDPA;

  const handleConfirm = () => {
    if (!isConfirmButtonDisabled) {
      onConfirm();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-xl p-6 w-full mx-auto"
    >
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
        <span className="material-symbols-outlined text-3xl text-blue-600">
          check_circle
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {t("step4.title")}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined">person</span>
            {t("step4.personal_info")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <InfoItem
              icon="category"
              label={t("step4.category")}
              value={formData.eventType}
            />
            <InfoItem
              icon="list_alt"
              label={t("step4.model")}
              value={formData.subOption}
            />
            <InfoItem
              icon="badge"
              label={t("step4.name")}
              value={`${formData.firstName} ${formData.lastName}`}
            />
            <InfoItem
              icon="mail"
              label={t("step4.email")}
              value={formData.email}
            />
            <InfoItem
              icon="call"
              label={t("step4.phone")}
              value={formData.phone}
            />
            <InfoItem
              icon="person"
              label={t("step4.sex.sex_title")}
              value={
                formData.sex === "M"
                  ? t("step4.sex.male")
                  : t("step4.sex.female")
              }
            />
            {formData.age && (
              <>
                <InfoItem
                  icon="cake"
                  label={t("step4.age")}
                  value={formData.age}
                />
                <InfoItem
                  icon="flag"
                  label={t("step4.category")}
                  value={t(
                    `table_list.select_category.marathon.${getCategoryFromAge(
                      formData.age
                    )}`
                  )}
                />
              </>
            )}
            <InfoItem
              icon="checkroom"
              label={t("step4.size_shrit")}
              value={formData.shirtSizeLabel}
            />
          </div>
        </div>

        {/*Select Reward */}
        {formData.items && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-rose-50 p-4 rounded-xl"
          >
            <h3 className="font-bold text-rose-700 flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined">trophy</span>
              {t("step4.reward")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {formData.items === "trophy" && (
                <InfoItem
                  icon="trophy"
                  label={t("step3.form_personal.select_trophy")}
                  value={formData.items === "trophy" && ""}
                />
              )}
              {formData.items === "shirt_2" && (
                <>
                  <InfoItem
                    icon="apparel"
                    label={t("step3.form_personal.select_shirt_2")}
                    value={
                      formData.model_shirt === "Shirt4KM" ? "4 KM" : "11 KM"
                    }
                  />
                  <InfoItem
                    icon="checkroom"
                    label={t("step4.size_shrit")}
                    value={formData.shirtSizeLabel_2}
                  />
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Dog Information */}
        {formData.hasDog && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-purple-50 p-4 rounded-xl"
          >
            <h3 className="font-bold text-purple-700 flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined">pets</span>
              {t("step4.animal_info")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <InfoItem
                icon="badge"
                label={t("step4.animal.name")}
                value={formData.animal?.name}
              />
              <InfoItem
                icon="pets"
                label={t("step4.animal.breed")}
                value={formData.animal?.breed}
              />
              <InfoItem
                icon="monitor_weight"
                label={t("step4.animal.weight")}
                value={`${formData.animal?.weight} กก.`}
              />
              <InfoItem
                icon="female"
                label={t("step4.animal.gender")}
                value={
                  formData.animal?.gender === "DM"
                    ? t("step4.animal_sex.male")
                    : t("step4.animal_sex.female")
                }
              />
              <InfoItem
                icon="wand_stars"
                label={t("step4.animal.fancys")}
                value={
                  formData.animal.fancys
                    ? t("step4.animal.yes")
                    : t("step4.animal.no")
                }
              />
            </div>
          </motion.div>
        )}

        {/* Receipt Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 p-4 rounded-xl"
        >
          <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined">receipt</span>
            {t("step4.receipt_info")}
          </h3>

          <div className="space-y-3 text-sm">
            <InfoItem
              icon="receipt"
              label={t("step4.need_receipt")}
              value={
                formData.needReceipt
                  ? t("step4.animal.yes")
                  : t("step4.animal.no")
              }
            />

            {formData.needReceipt && (
              <InfoItem
                icon="home"
                label={t("step4.address")}
                value={formData.address}
              />
            )}
          </div>
        </motion.div>

        {/* Payment Proof */}
        {paymentImagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow-50 p-4 rounded-xl"
          >
            <h3 className="font-bold text-yellow-700 flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined">payments</span>
              {t("step4.payment_title")}
            </h3>

            <div className="flex justify-center">
              <img
                src={paymentImagePreview}
                alt="หลักฐานการชำระเงิน"
                className="max-w-full h-96 object-contain rounded-lg border-2 border-dashed border-yellow-300"
              />
            </div>
          </motion.div>
        )}

        {/* Confirmation Checkboxes */}

        {/* ข้อตกลง */}
        <div className="mb-7">
          {/* Confirmation Checkboxes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200"
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
                      "คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่ ขอสงวนสิทธิ์ไม่คืนเงินค่าลงทะเบียนหลังจากชำระค่าลงทะเบียนเรียบร้อยแล้ว กรุณาตรวจสอบรายละเอียดการชำระเงินให้ละเอียดก่อนชำระเงิน"
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
      </div>

      <motion.div
        className="flex flex-col sm:flex-row justify-between gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-gray-300"
        >
          <span className="material-symbols-outlined">edit</span>
          {t("step4.button.edit_data")}
        </motion.button>

        <motion.button
          onClick={handleConfirm}
          disabled={isConfirmButtonDisabled}
          whileHover={!isConfirmButtonDisabled ? { scale: 1.05 } : {}}
          whileTap={!isConfirmButtonDisabled ? { scale: 0.95 } : {}}
          className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm ${
            isConfirmButtonDisabled
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
          }`}
        >
          <span className="material-symbols-outlined">check</span>
          {t("step4.button.confrim_send")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Helper component for consistent info items
const InfoItem = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-2">
    <span className="material-symbols-outlined text-gray-500 mt-0.5">
      {icon}
    </span>
    <div>
      <div className="font-medium text-gray-600">{label}</div>
      <div className="text-gray-800 font-medium">{value}</div>
    </div>
  </div>
);

export default ConfirmationModal;
