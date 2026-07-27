import { useEffect, useRef, useState } from "react";
import Step1SelectType from "../components/Step1SelectType";
import Step2SubOptions from "../components/Step2SubOptions";
import Step3Form from "../components/Step3Form";
import ConfirmationModal from "../components/ConfirmationModal";
import { AlertModal } from "../components/AlertModal";
import { RegisterRouterCryptoJS } from "../routers/PostRouter";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ProcressLoadingModal } from "../components/ProcessLoadingModal";
import { FunctionLimitAnimal } from "../routers/GetRouter";
import type { limitAnimal } from "../types/OpenProject";
import { useNavigate } from "react-router-dom";

const Page = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [checkLimitAnimal, setCheckLimitAnimal] = useState<limitAnimal>();
  const navigate = useNavigate();
  const hasanimal = useRef(false);

  const fetchLimitAnimal = async () => {
    const response: any = await FunctionLimitAnimal();
    if (response.success) {
      setCheckLimitAnimal(response);
    }
  };

  useEffect(() => {
    if (!hasanimal.current) {
      hasanimal.current = true;

      fetchLimitAnimal();
    }
  }, []);

  const [formData, setFormData] = useState({
    eventType: "",
    subOption: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: "",
    age: "",
    sizeId: "", // ID ของ Size_shirt
    address: "",
    needReceipt: false,
    transferFile: null, // หรือใช้ File object ถ้า upload
    payment: false,

    // Animal fields (ถ้ามีสุนัข)
    animal: {
      name: "",
      breed: "",
      weight: "",
      gender: "",
      fancys: false,
    },

    // UI states
    hasDog: false,
    prevStep: 1,
  });

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

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const clearStepData = (stepToClear: number) => {
    const newFormData: any = {};

    // กำหนด field ที่ควร clear ตามแต่ละ step
    if (stepToClear === 2) {
      newFormData.subOption = "";
      newFormData.hasDog = false;
    }

    if (stepToClear >= 3) {
      newFormData.subOption = "";
      newFormData.firstName = "";
      newFormData.lastName = "";
      newFormData.email = "";
      newFormData.phone = "";
      newFormData.sex = "";
      newFormData.age = "";
      newFormData.sizeId = "";
      newFormData.needReceipt = false;
      newFormData.hasDog = false;
      newFormData.address = "";
      newFormData.transferFile = null;
      newFormData.animal = {
        name: "",
        breed: "",
        weight: "",
        sex: "",
        fancys: false,
      };
    }

    updateFormData(newFormData);
  };

  useEffect(() => {
    if (step === 1) {
      setFormData({
        eventType: "",
        subOption: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        sex: "",
        age: "",
        address: "",
        sizeId: "",
        needReceipt: false,
        transferFile: null,
        payment: false,
        animal: {
          name: "",
          breed: "",
          weight: "",
          gender: "",
          fancys: false,
        },
        hasDog: false,
        prevStep: 1,
      });
    }
  }, [step]);

  const handleNext = () => {
    setStep((prev) => {
      updateFormData({ prevStep: prev });
      return prev + 1;
    });
  };

  const handleBack = () => {
    setStep((prev) => {
      // กรณีพิเศษ: MARATHON จาก Step 3 → Step 1
      if (formData.eventType === "MARATHON" && prev === 3) {
        clearStepData(3); // Clear ข้อมูล Step 3
        clearStepData(2); // Clear ข้อมูล Step 2 เพิ่มเติม (optional)
        return 1;
      }

      // กรณีทั่วไป: ลบข้อมูลของ step ที่ออกจาก
      clearStepData(prev);
      return prev - 1;
    });
  };

  const isValid = () => {
    const { firstName, lastName, email, phone, sex, sizeId } = formData;
    if (!firstName || !lastName || !email || !phone || !sex || !sizeId) {
      showCustomAlert(t("page.validation.required_fields"), {
        title: t("page.modal.warning"),
        type: "warning",
      });
      return false;
    }

    if (formData.phone.length !== 10) {
      showCustomAlert(t("step3.form_personal.validation.phone_invalid"), {
        title: t("page.modal.warning"),
        type: "warning",
      });
      return false;
    }

    if (formData.subOption === "MINI MARATHON (11 KM)") {
      const { firstName, lastName, email, phone, sex, age, sizeId } = formData;
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !sex ||
        !age ||
        !sizeId
      ) {
        showCustomAlert(t("page.validation.required_fields"), {
          title: t("page.modal.warning"),
          type: "warning",
        });
        return false;
      }
    }

    if (!formData.address && formData.needReceipt) {
      showCustomAlert(t("page.validation.receipt_address"), {
        title: t("page.modal.warning"),
        type: "warning",
      });
      return false;
    }

    if (
      formData.hasDog &&
      (!formData.animal.name ||
        !formData.animal.breed ||
        !formData.animal.weight ||
        !formData.animal.gender)
    ) {
      showCustomAlert(t("page.validation.dog_info"), {
        title: t("page.modal.warning"),
        type: "warning",
      });
      return false;
    }

    if (formData.transferFile === null) {
      showCustomAlert(t("page.validation.transfer_file"), {
        title: t("page.modal.warning"),
        type: "warning",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    setIsLoading(true);
    setUploadProgress(0);
    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
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
      const response = await RegisterRouterCryptoJS(
        dataToSend,
        setUploadProgress
      );

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
    } catch (error: any) {
      console.error("Error during registration:", error);
      showCustomAlert(error.message, {
        title: t("page.modal.error"),
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const stepTitles = [
    t("page.steps.select_event"),
    t("page.steps.select_option"),
    t("page.steps.personal_info"),
    t("page.steps.confirmation"),
  ];

  const handleNextFromStep1 = (type: string) => {
    let subOption = "";

    if (type === "MARATHON") {
      subOption = "MINI MARATHON (11 KM)";
    }

    updateFormData({
      eventType: type,
      subOption, // ✅ set subOption อัตโนมัติ
    });

    if (type === "MARATHON") {
      setStep(3); // ✅ กระโดดไป step 3 เลย
    } else {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-brfrom-[#a66941] via-[#c6895a] to-[#d79b65] flex flex-col justify-center items-center p-4 md:p-8">
      {/* Custom Alert Modal */}
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
              navigate("/list/participants?id=participant");
            } else {
              setAlertState((prev) => ({ ...prev, isOpen: false }));
            }
          } else {
            setAlertState((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      />

      {/* Loading Modal - Responsive sizing */}
      {/* <LoadingModal isOpen={isLoading} progress={uploadProgress} /> */}
      <ProcressLoadingModal
        isOpen={isLoading}
        progress={uploadProgress}
        isError={false}
        onClose={() => setIsLoading(false)}
      />

      {/* Header Section */}
      <motion.div
        className="w-full max-w-4xl mb-4 md:mb-6 "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          {t("page.title")}
        </h1>

        {/* Progress Bar - Hidden on mobile */}
        <div className="hidden sm:block relative pt-1 mb-4 md:mb-8 mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 bg-[#f0e6d9] rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#a66941] via-[#c6895a] to-[#d79b65] rounded-full shadow-md"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between px-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <motion.div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative z-10 border-2 ${
                    step > stepNumber
                      ? "bg-[#a66941] border-[#a66941] text-white shadow-md"
                      : step === stepNumber
                      ? "bg-white border-[#d79b65] text-[#a66941] shadow-lg"
                      : "bg-white border-[#f0e6d9] text-[#c6895a]"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step > stepNumber ? (
                    <span className="material-symbols-outlined text-xs md:text-sm">
                      check
                    </span>
                  ) : (
                    <span className="font-medium">{stepNumber}</span>
                  )}
                </motion.div>
                <motion.span
                  className={`text-xs mt-1 md:mt-2 text-center font-medium ${
                    step >= stepNumber ? "text-[#a66941]" : "text-[#c6895a]"
                  }`}
                >
                  {stepTitles[stepNumber - 1]}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Step Indicator - Only show current step */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700">
              {t("page.steps.step")} {step}: {stepTitles[step - 1]}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <div className="w-full max-w-4xl flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step > formData.prevStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step > formData.prevStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 md:mb-6"
          >
            {step === 1 && (
              <Step1SelectType
                selected={formData.eventType}
                onSelect={handleNextFromStep1}
              />
            )}

            {step === 2 && (
              <Step2SubOptions
                type={formData.eventType}
                selected={formData.subOption}
                checkLimitAnimal={checkLimitAnimal}
                onSelect={(option) => {
                  updateFormData({ subOption: option });
                  handleNext();
                }}
                onBack={handleBack}
              />
            )}

            {step === 3 && (
              <Step3Form
                type={formData.eventType}
                subOption={formData.subOption}
                formData={formData}
                checkLimitAnimal={checkLimitAnimal}
                updateFormData={updateFormData}
                onNext={() => isValid() && handleNext()}
                onBack={handleBack}
              />
            )}

            {step === 4 && (
              <ConfirmationModal
                formData={formData}
                onConfirm={handleSubmit}
                onEdit={() => setStep(3)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
