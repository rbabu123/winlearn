import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
    <div className="error-page-container">
      <Card className="error-card">
        <h1>Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <div style={{marginTop: "20px"}}>
        <Button type="primary" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
        </div>
      </Card>
    </div>
    </div>
  );
};
