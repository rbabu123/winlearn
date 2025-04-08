import { Layout } from "antd";

const { Footer } = Layout;

export const AppFooter: React.FC = () => {
  return (
    <Footer className="custom-footer">
      <span className="footer-left">WinWire Technologies © 2025</span>
      <span className="footer-right">
        Site owned and managed by HR, L&D Departments
      </span>
    </Footer>
  );
};

