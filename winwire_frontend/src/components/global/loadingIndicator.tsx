import { Spin } from "antd";
import "./styles.css";
import { LoadingOutlined } from "@ant-design/icons";

export type LoadingIndicatorProps = {
  type?: "fill" | "fullScreen" | "inline" | "page";
  color?: string;
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ type = "fill", color }) => {
  let className = `loading-indicator-container`;
  className =
    type === "fullScreen" ? `${className} loading-indicator-container--fullscreen` : className;
  className = type === "fill" ? `${className} loading-indicator-container--fill` : className;
  className = type === "inline" ? `${className} loading-indicator-container--inline` : className;
  className = type === "page" ? `${className} loading-indicator-container--page` : className;

  return (
    <div className={className}>
      <Spin
        className="custom-spin"
        style={{ color: color ? color : undefined }}
        indicator={
          <LoadingOutlined
            spin
            style={{ fontSize: type === "fullScreen" || type === "page" ? 48 : undefined }}
          />
        }
      />
    </div>
  );
};
