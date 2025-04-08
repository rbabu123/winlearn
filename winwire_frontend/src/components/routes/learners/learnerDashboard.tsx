import { Layout } from "antd";
import { CustomSider } from "../../global/sider";
import { Outlet, useLocation } from "react-router-dom";
import { BookOutlined, FormOutlined, DashboardOutlined } from "@ant-design/icons";

const { Content } = Layout;

export const LearnerDashboard = () => {
  const location = useLocation();
  
  // Hide sidebar on the assessment page
  const isAssessmentPage = location.pathname.includes("/learner/dashboard/assessment");
  const learnerMenuItems = [
    { key: "1", icon: <DashboardOutlined />, label: "Assigned Paths", path: "/learner/dashboard/learning-paths" },
    { key: "2", icon: <BookOutlined />, label: "Completed Paths", path: "/learner/dashboard/completed-paths" },
    { key: "3", icon: <FormOutlined />, label: "Reports", path: "/learner/dashboard/reports" },
  ];

  return (
    <div style={{ padding: isAssessmentPage ? "0px" : "50px" }}> {/* Remove padding for assessment */}
      <Layout>
        {/* Show sidebar only if NOT on assessment page */}
        {!isAssessmentPage && <CustomSider title="Learn" menuItems={learnerMenuItems} />}

        <Content className="custom-content">
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};
