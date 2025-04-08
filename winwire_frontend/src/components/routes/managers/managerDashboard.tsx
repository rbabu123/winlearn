import { Layout } from "antd";
import { CustomSider } from "../../global/sider";
import { Outlet } from "react-router-dom";
import {
  UserOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

export const ManagerDashboard = () => {

  const managerMenuItems = [
    { key: "1", icon: <UserOutlined />, label: "Reportees", path: "/manager/dashboard/reportees" },
    { key: "2", icon: <AreaChartOutlined />, label: "Reports", path: "/manager/dashboard/reports" },
  ];

  return (
    <div style={{ padding: "50px" }}>
      <Layout>
        <CustomSider title="Manage" menuItems={managerMenuItems} />

        <Content className="custom-content">
         <Outlet />
        </Content>
      </Layout>
    </div>
  );
};
