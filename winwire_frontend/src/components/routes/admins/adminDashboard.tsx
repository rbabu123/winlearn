import {  Layout } from "antd";
import {
  BookOutlined,
  AreaChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import "./styles.css";
import { CustomSider } from "../../global/sider";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export const AdminDashboard = () => {
  const adminMenuItems = [
    { key: '1', icon: <BookOutlined />, label: 'Learning Paths', path: "/admin/dashboard/learning-paths" },
    { key: '2', icon: <AreaChartOutlined />, label: 'Assign Paths', path: "/admin/dashboard/assign-courses" },
    { key: '3', icon: <SettingOutlined />, label: 'Reports', path: "/admin/dashboard/reports" },
  ];

  return (
    <div style={{ padding: "50px" }}>
      <Layout>
        <CustomSider title="Manage" menuItems={adminMenuItems} />
        <Content className="custom-content">
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};
