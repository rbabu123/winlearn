import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { evaluateAnswers, fetchQuestions, fetchUserDashboardData } from "./query";
import { message } from "antd";

export const useFetchUserDashboardData = (userId: number) => {
    return useQuery({
      queryKey: ["dashboardData", userId],
      queryFn: () => fetchUserDashboardData(userId),
    });
  };

export const useFetchQuestions = (courseID: number) => {
  const queryClient = useQueryClient();

  // Check if data is cached
  const isCached = !!queryClient.getQueryData(['fetchQuestions', courseID]);
  console.log('Is data cached:', isCached);
    return useQuery({
      queryKey: ['fetchQuestions', courseID],
      queryFn: () => fetchQuestions(courseID),
      enabled: !!courseID, // Only fetch if courseID is valid
      staleTime: 1000 * 60 * 5, // Keep cached for 5 minutes
    });
};

export const useEvaluateAnswers = () => {
    return useMutation({
      mutationFn: (submission: any) => evaluateAnswers(submission), // Pass submission argument
      onSuccess: () => {
        message.success("Answers submitted successfully!");
      },
      onError: (error) => {
        console.error("Submission failed:", error);
        message.error("Submission failed. Please try again.");
      },
    });
  };
  