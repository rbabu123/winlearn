import axios from "axios";
import { API_URL } from "../api";

interface LoginPayload {
  Email: string;
  Password: string;
}

interface LoginResponse {
  status_code: number;
  data: {
    user: {
      Name: string;
      User_ID: number;
      Is_LD_Admin?: boolean;
      Is_Manager?: boolean;
    };
  };
  token: string;
}

export const getLogin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  return response.data;
};
