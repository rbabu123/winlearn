// import { useMutation } from "@tanstack/react-query";
// import { getLogin } from "./query";
// import { message } from "antd";

// export const useGetLogin = () => {
//   return useMutation({
//     mutationFn: getLogin,
//     onSuccess: () => {
//       message.success("Login successful!");
//     },
//     onError: (error: any) => {
//       message.error(error?.response?.data?.detail || "Login failed. Please try again.");
//     },
//   });
// };

import { useMutation } from "@tanstack/react-query";
import { getLogin } from "./query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/userContext";

export const useGetLogin = () => {
  const navigate = useNavigate();
  const { setAuthDetails } = useAuth();

  return useMutation({
    mutationFn: getLogin,
    onSuccess: (response) => {
      const userData = response.data.user;
      const token = response.token;

      const isAdmin = userData.Is_LD_Admin || false;
      const isManager = userData.Is_Manager || false;

      // Determine initial viewMode
      let initialViewMode: "admin" | "manager" | "learner" = "learner";
      if (isAdmin) initialViewMode = "admin";
      else if (isManager) initialViewMode = "manager";

      // Set authentication details in context
      setAuthDetails({
        username: userData.Name,
        userID: Number(userData.User_ID),
        isAdmin,
        isManager,
        token: token,
        viewMode: initialViewMode,
      });

      // Persist authentication details in localStorage
      localStorage.setItem(
        "authData",
        JSON.stringify({
          username: userData.Name,
          userID: userData.User_ID,
          isAdmin,
          isManager,
          token: token,
          viewMode: initialViewMode,
        })
      );

      message.success("Login successful!");
      navigate(`/${initialViewMode}/dashboard`);
    },
    onError: (error: any) => {
      console.error("Login failed!", error?.response?.data?.detail);
      message.error(error?.response?.data?.detail || "Login failed. Please try again.");
    },
  });
};
