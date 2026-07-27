import axios from "axios";
import { apiUrl } from "../configs/conf";
import CryptoJS from "crypto-js";

// ประเภทของข้อมูลตอบกลับ
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/*
export const RegisterRouterCryptoJS = async (
  formDataToSend: FormData,
  setUploadProgress: (progress: number) => void
): Promise<ApiResponse> => {
  try {
    // 1. แยกไฟล์ออกมาก่อน เพื่อไม่ให้ถูกเข้ารหัส
    const files: Record<string, File> = {};
    const nonFileData: Record<string, any> = {};

    // วน loop ตรวจสอบว่าเป็นไฟล์หรือไม่
    formDataToSend.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value;
      } else {
        nonFileData[key] = value;
      }
    });

    // 2. เข้ารหัสเฉพาะข้อมูลธรรมดา (non-file)
    const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(nonFileData),
      secretKey
    ).toString();

    // 3. สร้าง payload ใหม่: รวม encryptedData + ไฟล์
    const payload = new FormData();
    payload.append("encryptedData", encryptedData);

    // เพิ่มไฟล์ลง payload
    Object.entries(files).forEach(([key, file]) => {
      payload.append(key, file);
    });

    // 4. ส่งไป backend (comment ไว้)
    const response = await axios.post<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/register/participant`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: () => {
          const duration = 10000; // 10 seconds
          const startTime = Date.now();

          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percent = Math.min(
              Math.round((elapsed / duration) * 100),
              100
            );
            setUploadProgress(percent);

            if (percent >= 100) {
              clearInterval(interval);
            }
          }, 50);
        },
      }
    );

    return response.data;
  } catch (error: any) {
    setUploadProgress(0);
    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};
*/

export const RegisterRouterCryptoJS = async (
  formDataToSend: FormData,
  setUploadProgress: (progress: number) => void
): Promise<{ success: boolean; data?: any; message?: string }> => {
  let intervalId: number | null = null;

  // 1. แยกไฟล์และข้อมูลทั่วไป
  const files: Record<string, File> = {};
  const nonFileData: Record<string, any> = {};

  formDataToSend.forEach((value, key) => {
    if (value instanceof File) {
      files[key] = value;
    } else {
      nonFileData[key] = value;
    }
  });

  // 2. เข้ารหัสข้อมูลธรรมดา
  const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(nonFileData),
    secretKey
  ).toString();

  // 3. สร้าง payload
  const payload = new FormData();
  payload.append("encryptedData", encryptedData);
  Object.entries(files).forEach(([key, file]) => {
    payload.append(key, file);
  });

  // 4. ฟังก์ชันจำลอง progress
  const startSimulatedProgress = () => {
    const duration = 10000; // 10 วินาที
    const startTime = Date.now();

    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min(Math.round((elapsed / duration) * 100), 100);
      setUploadProgress(percent);

      if (percent >= 100) {
        clearInterval(intervalId!);
        intervalId = null;
      }
    }, 50);
  };

  const stopSimulatedProgress = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // 5. รอจน progress เต็ม 100%
  const waitForFullProgress = new Promise<void>((resolve) => {
    const check = () => {
      if (!intervalId) {
        resolve();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });

  try {
    // เริ่มโหลด
    startSimulatedProgress();

    // 6. ส่ง request ไป backend
    const requestPromise = axios.post<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/register/participant`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 7. รอทั้ง request และ progress เต็ม
    const [response] = await Promise.all([requestPromise, waitForFullProgress]);

    stopSimulatedProgress();
    setUploadProgress(100);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    stopSimulatedProgress();
    setUploadProgress(0);

    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message || "เกิดข้อผิดพลาด",
      };
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const SalesRouterCryptoJS = async (
  formDataToSend: FormData,
  setUploadProgress: (progress: number) => void
): Promise<{ success: boolean; data?: any; message?: string }> => {
  let intervalId: number | null = null;

  // 1. แยกไฟล์และข้อมูลทั่วไป
  const files: Record<string, File> = {};
  const nonFileData: Record<string, any> = {};

  formDataToSend.forEach((value, key) => {
    if (value instanceof File) {
      files[key] = value;
    } else {
      nonFileData[key] = value;
    }
  });

  // 2. เข้ารหัสข้อมูลธรรมดา
  const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(nonFileData),
    secretKey
  ).toString();

  // 3. สร้าง payload
  const payload = new FormData();
  payload.append("encryptedData", encryptedData);
  Object.entries(files).forEach(([key, file]) => {
    payload.append(key, file);
  });

  // 4. ฟังก์ชันจำลอง progress
  const startSimulatedProgress = () => {
    const duration = 10000; // 10 วินาที
    const startTime = Date.now();

    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min(Math.round((elapsed / duration) * 100), 100);
      setUploadProgress(percent);

      if (percent >= 100) {
        clearInterval(intervalId!);
        intervalId = null;
      }
    }, 50);
  };

  const stopSimulatedProgress = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // 5. รอจน progress เต็ม 100%
  const waitForFullProgress = new Promise<void>((resolve) => {
    const check = () => {
      if (!intervalId) {
        resolve();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });

  try {
    // เริ่มโหลด
    startSimulatedProgress();

    // 6. ส่ง request ไป backend
    const requestPromise = axios.post<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/sale/shirt`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 7. รอทั้ง request และ progress เต็ม
    const [response] = await Promise.all([requestPromise, waitForFullProgress]);

    stopSimulatedProgress();
    setUploadProgress(100);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    stopSimulatedProgress();
    setUploadProgress(0);

    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message || "เกิดข้อผิดพลาด",
      };
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};
