import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLearningPath, assignLearningPaths, deleteLearningPath, fetchLearningPaths, fetchLearningPathsReports, fetchStreams, getAllUsers } from "./query";
import { message } from "antd";

//fteching the learning paths
export const useFetchLearningPaths = () => {
    return useQuery({
        queryKey: ["learningPaths", "all"],
        queryFn: () => fetchLearningPaths(),
    });
};

export const useAddLearningPath = () => {
    const queryClient = useQueryClient();
    // Add a new learning path
    return useMutation({
        mutationFn: addLearningPath,
        onSuccess: (data) => {
            // Display the success message from the response
            message.success(data.message || "Learning path added successfully!");
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["learningPaths", "all"] })
        },
        onError: (error: any) => {
            message.error(`Error adding learning path: ${error.message}`);
        },
    });
};

export const useFetchLearningPathsReports = () => {
    return useQuery({
        queryKey: ['learningPaths', "reports"],
        queryFn: fetchLearningPathsReports,
    });
};

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: ["users", "all"],
        queryFn: getAllUsers,
    });
};

// Assign Learning Paths Mutation
export const useAssignLearningPaths = () => {
    return useMutation({
        mutationFn: assignLearningPaths,
        onSuccess: (data) => {
            if (data.success) {
                message.success(data.message || "Learning path assigned successfully!");
            } else if (data.data?.Already_Assigned_Users?.length > 0) {
    
                const assignedUsers = data.data.Already_Assigned_Users.map((user: { Name: any; }) => user.Name).join(", ");
                message.warning(`${data.message} Already assigned users: ${assignedUsers}`);
            } else {
                message.error(data.message || "Failed to assign learning path.");
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
            message.error(`Error assigning learning path: ${errorMessage}`);
        },
    });
};



//delete learning paths

export const useDeleteLearningPath = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { Learning_Path_ID: number, User_ID: number }) => deleteLearningPath(data.Learning_Path_ID, data.User_ID),
        onSuccess: (data) => {
            message.success(data.message || "Learning path deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["learningPaths", "all"] });
        },
        onError: (error) => {
            message.error(`Error deleting learning path: ${error.message}`);
        },
    });
};


export const useFetchStreams = () => {
    return useQuery({
        queryKey: ["streams", "all"],
        queryFn: fetchStreams,
    });
}