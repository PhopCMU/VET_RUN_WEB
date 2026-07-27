import axios from "axios";
import { apiUrl } from "../configs/conf";

// import CryptoJS from "crypto-js";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface TrackingParams {
  visitorId: string;
}
// const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
export const FunctionOpenProject = async () => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/role/project/projectId`,
      {
        params: {
          projectId: "d3a154e2-9e0a-48e6-b69b-63f3c7c9f406",
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during search:");

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "ข้อพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const FunctionMenuSizeShirt = async () => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/size/shirt`,
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "ข้อพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const FunctionLimitAnimal = async () => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/limit/animal`,
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "ข้อพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const FunctionGetParticipantAll = async () => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/participant/all`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "ข้อพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const FunctionGetSponsorAll = async () => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/sponsors`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "ข้อพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const FunctionGetTrackingAll = async ({
  visitorId,
}: TrackingParams): Promise<ApiResponse> => {
  // ตรวจสอบ visitorId ก่อน
  if (!visitorId || typeof visitorId !== "string") {
    return {
      success: false,
      message: "ข้อมูลผู้ใช้ไม่สมบูรณ์",
    };
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/tracking`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Visitor-Id": visitorId,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during tracking fetch:", error);

    // กรณีมี response จากเซิร์ฟเวอร์ (เช่น 400, 500)
    if (error.response?.data) {
      return error.response.data as ApiResponse;
    }

    // กรณี network error หรือไม่สามารถติดต่อเซิร์ฟเวอร์ได้
    return {
      success: false,
      message: "ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};
