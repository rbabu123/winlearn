import axios from "axios";
import { API_URL } from "../api";

export const addLearningPath = async (data: any) => {
    const response = await axios.post(`${API_URL}/admins/add_learning_path`, data);
    if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Failed to add learning path");
    }
    return response.data;
};

//fetching the Lps
export const fetchLearningPaths = async () => {
    const response = await axios.get(`${API_URL}/admins/learning_paths`);

    if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Failed to fetch learning paths");
    }
    return response.data?.data.Learning_Paths;
};

export const fetchLearningPathsReports = async () => {
    const response = await axios.get(`${API_URL}/admins/dashboard`);
    if (!response.data.success) {
        throw new Error("Failed to fetch learning paths");
    }
    return response.data?.data.Learning_Paths;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/admins/get_all_users`);
    if (!response.data.success) {
        throw new Error("Failed to fetch users");
    }
    return response.data?.data.Users;
};

// Assign Learning Paths 
export const assignLearningPaths = async (assignmentData: { Users: number[], Learning_Path_ID: number }) => {
    const response = await axios.post(`${API_URL}/admins/assign_learning_paths`, assignmentData);
    if (!response.data.success) {
        throw new Error("Failed to assign learning paths");
    }
    return response.data;
};

// Delete the Learning Path

export const deleteLearningPath = async (Learning_Path_ID: number, User_ID: number) => {
    const response = await axios.delete(`${API_URL}/admins/delete_learning_path`, { data: { Learning_Path_ID, User_ID } });
    if (!response.data.success) {
        throw new Error("Failed to delete learning paths");
    }
    return response.data;
};

export const fetchStreams = async () => {
    const response = await axios.get(`${API_URL}/courses/fetch_streams`);
    if (!response.data.success) {
        throw new Error("Failed to fetch streams");
    }
    return response.data.data.Streams;
};