import axios from "axios";
import { apiUrl } from "../configs/conf";
import type {
  OpenProject,
  Participant,
  Sponsor,
  TrackingOrder,
  limitAnimal,
} from "../types/OpenProject";

// import CryptoJS from "crypto-js";

export interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
}

function getErrorResponse<TData>(error: unknown): ApiResponse<TData> {
  if (axios.isAxiosError<ApiResponse<TData>>(error) && error.response?.data) {
    return error.response.data;
  }

  return { success: false, message: "ข้อพลาดในการเชื่อมต่อเซิร์ฟเวอร์" };
}

export interface ShirtMenuResponse {
  size: Array<{
    shirtId: string;
    size: string;
    s_width: number;
    s_high: number;
    point: number | string;
  }>;
  shirtModel: Array<{
    shirtmodelId: string;
    name: string;
    name_en?: string;
    price: number | string;
  }>;
  shirtColor: Array<{
    shirtcolorId: string;
    name: string;
    name_en?: string;
  }>;
}

// const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
export const FunctionOpenProject = async () => {
  try {
    const response = await axios.get<ApiResponse<OpenProject>>(
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
  } catch (error) {
    console.error("Error during search:");
    return getErrorResponse<OpenProject>(error);
  }
};

export const FunctionMenuSizeShirt = async () => {
  try {
    const response = await axios.get<ApiResponse<ShirtMenuResponse>>(
      `${apiUrl.URL_API}/vetrun/size/shirt`,
    );

    return response.data;
  } catch (error) {
    console.error("Error during search:", error);
    return getErrorResponse<ShirtMenuResponse>(error);
  }
};

export const FunctionLimitAnimal = async () => {
  try {
    const response = await axios.get<ApiResponse<limitAnimal>>(
      `${apiUrl.URL_API}/vetrun/limit/animal`,
    );

    return response.data;
  } catch (error) {
    console.error("Error during search:", error);
    return getErrorResponse<limitAnimal>(error);
  }
};

export const FunctionGetParticipantByEmail = async (email: string) => {
  try {
    const response = await axios.get<ApiResponse<Participant[] | Participant>>(
      `${apiUrl.URL_API}/vetrun/participant/email`,
      {
        params: { email },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error during search:", error);
    return getErrorResponse<Participant[] | Participant>(error);
  }
};

export const FunctionGetSponsorAll = async () => {
  try {
    const response = await axios.get<ApiResponse<Sponsor[]>>(
      `${apiUrl.URL_API}/vetrun/sponsors`,
    );
    return response.data;
  } catch (error) {
    console.error("Error during search:", error);
    return getErrorResponse<Sponsor[]>(error);
  }
};

export const FunctionGetTrackingAll = async (
  email: string,
): Promise<ApiResponse<TrackingOrder[] | TrackingOrder>> => {
  try {
    const response = await axios.get<ApiResponse<TrackingOrder[] | TrackingOrder>>(
      `${apiUrl.URL_API}/vetrun/tracking`,
      {
        params: { email },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    return getErrorResponse<TrackingOrder[] | TrackingOrder>(error);
  }
};
