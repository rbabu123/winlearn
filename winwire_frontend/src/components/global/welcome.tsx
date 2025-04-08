import React from "react";
import { Typography } from "antd";
import { useAuth } from "../contexts/userContext";
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
const { Title } = Typography;

export const WelcomeMessage: React.FC = () => {
  const { username } = useAuth();

  if (!username) return null;

  return (
    <div style={{  marginBottom: "80px" }}>
      <Title level={3} style={{ color: "var(--primary-color)", marginBottom: 0 }}>
        {getGreeting()}
      </Title>
      <Title level={4} style={{ color: "var(--secondary-color)", marginTop: 4 }}>
        Welcome, {username}!
      </Title>
    </div>
  );
};
