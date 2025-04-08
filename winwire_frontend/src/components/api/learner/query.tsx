import axios from "axios";
import { API_URL } from "../api";

export const fetchUserDashboardData = async (userId: number) => {
    const response = await axios.get(`${API_URL}/users/dashboard/${userId}`);
    if (!response.data.success) {
      throw new Error("Failed to fetch dashboard data");
    }
    return response.data.data.Learning_Paths;
};

// API call to fetch questions
export const fetchQuestions = async (courseID: number) => {
    const response = await axios.get(`${API_URL}/courses/fetch_questions/${courseID}`);
    if (!response.data.success) {
        throw new Error("Failed to fetch questions");
    }
    return response.data;
};

export const evaluateAnswers = async (submission: any) => {
  const response = await axios.post(`${API_URL}/courses/evaluate_answers`, submission);
    if (!response.data.success) {
        throw new Error("Failed to evaluate answers");
    }
  return response.data;
};
