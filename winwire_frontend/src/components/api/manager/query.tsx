import axios from "axios";
import { API_URL } from "../api";

export const fetchManagerDashboard = async (userId: number) => {
  const response = await axios.get(`${API_URL}/managers/dashboard/${userId}`);
  if (!response.data.success) { 
    throw new Error("Failed to fetch manager dashboard data");
  }
  return response.data;
};

