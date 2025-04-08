import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface CustomSiderProps {
  title: string;
  menuItems: MenuItem[];
}

export const CustomSider: React.FC<CustomSiderProps> = ({ title, menuItems }) => {
  const location = useLocation();

  // Find the active menu key based on current path
  const activeKey = menuItems.find(item => location.pathname.includes(item.path))?.key;

  return (
    <Sider
      width="236px"   // Fixed width
      style={{
        height: "100vh",   // Fixed height to fill the entire viewport
        overflow: "auto",  // Ensures content doesn't overflow
      }}
      theme="light"
      className="custom-sider"
    >
      <div className="sider-header">
        <Typography.Title level={2} className="sider-title">
          {title}
        </Typography.Title>
      </div>
      <Menu
      selectedKeys={[activeKey || "1"]}
      mode="vertical"
      items={menuItems.map(item => ({
        key: item.key,
        icon: item.icon,
        label: <Link to={item.path}>{item.label}</Link>,
      }))}
    />
    </Sider>
  );
};
