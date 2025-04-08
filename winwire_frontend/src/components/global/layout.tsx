import React from "react";
import { Layout } from "antd";
import { AppFooter } from "./footer";
import { AppHeader } from "./header";
const { Content } = Layout;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <Content>
        {children}
      </Content>
      <AppFooter />
    </Layout>
  );
};
