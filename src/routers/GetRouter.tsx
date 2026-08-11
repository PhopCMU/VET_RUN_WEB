import axios from "axios";
import { apiUrl } from "../configs/conf";

// import CryptoJS from "crypto-js";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
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

export const FunctionGetParticipantByEmail = async (email: string) => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/participant/email`,
      {
        params: { email },
      },
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

export const FunctionGetTrackingAll = async (
  email: string,
): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${apiUrl.URL_API}/vetrun/tracking`,
      {
        params: { email },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};
