import React from "react";
import { Layout, Switch, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../contexts/userContext";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const { isAdmin, isManager, logout, token, viewMode, setAuthDetails, resetViewMode, username } = useAuth();
  const navigate = useNavigate();

  // Handle switch logic
  const handleModeChange = (mode: "admin" | "manager" | "learner") => {
    setAuthDetails({ viewMode: mode });
    navigate(`/${mode}/dashboard`);
  };

  const handleLogout = () => {
    resetViewMode();  // Reset viewMode on logout
    logout();         // Logout logic
    navigate("/");    // Redirect to Login page
  };

  return (
    <Header className="custom-header">
      <div className="header-content">
        <img src={logo} alt="Company Logo" className="header-logo" />

        {token && (
          <Space style={{ marginRight: "20px" }}>
            {isAdmin && (
            <>
                <Switch
                checked={viewMode === "admin"}
                checkedChildren="Admin Mode"
                unCheckedChildren="Admin Mode"
                onChange={() => handleModeChange("admin")}
                />
                {/* Show Manager Mode switch only if the user is also a Manager */}
                {isManager && (
                <Switch
                    checked={viewMode === "manager"}
                    checkedChildren="Manager Mode"
                    unCheckedChildren="Manager Mode"
                    onChange={() => handleModeChange("manager")}
                />
                )}
                <Switch
                checked={viewMode === "learner"}
                checkedChildren="Learner Mode"
                unCheckedChildren="Learner Mode"
                onChange={() => handleModeChange("learner")}
                />
            </>
            )}

            {isManager && !isAdmin && (
              <>
                <Switch
                  checked={viewMode === "manager"}
                  checkedChildren="Manager Mode"
                  unCheckedChildren="Manager Mode"
                  onChange={() => handleModeChange("manager")}
                />
                <Switch
                  checked={viewMode === "learner"}
                  checkedChildren="Learner Mode"
                  unCheckedChildren="Learner Mode"
                  onChange={() => handleModeChange("learner")}
                />
              </>
            )}
          </Space>
        )}

        {token && (
        <Space size={8}>
            <span style={{color: "white", fontSize: "20px"}}>{username ? username : "User"}</span>
            <span style={{color: "white", fontSize: "20px"}}>|</span> 
            <Button
            type="link"
            onClick={handleLogout}
            style={{color: "red", fontSize: "20px", fontWeight: "bold"}}
            >
            Logout
            </Button>
        </Space>
        )}
      </div>
    </Header>
  );
};
