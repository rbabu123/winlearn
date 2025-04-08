import { useManagerDashboard } from "../../api/manager";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { Divider, Table, Tag, Typography } from "antd";
import { useAuth } from "../../contexts/userContext";
import { LearningPath, Reportee } from "../types";

export const Reportees = () => {
    const {userID} = useAuth();
  const { data, isLoading } = useManagerDashboard(userID);

  if (isLoading) {
    return <LoadingIndicator type="page" />;
  }

  if (!data || !data.data?.Reportees || data.data.Reportees.length === 0) {
    return <p>No reportees found.</p>;
  }

  const reportees: Reportee[] = data.data.Reportees;

  const columns = [
    { title: "Name", dataIndex: "Name", key: "Name" },
    { title: "Email", dataIndex: "Email", key: "Email" },
    { title: "Designation", dataIndex: "Designation", key: "Designation" },
    {
      title: "Stream",
      dataIndex: "Stream",
      key: "Stream",
      render: (stream: string) => <Tag color={stream === "AppDev" ? "blue" : "green"}>{stream}</Tag>,
    },
    {
      title: "Learning Paths",
      dataIndex: "Learning_Paths",
      key: "Learning_Paths",
      render: (paths: LearningPath[]) =>
        paths.length > 0
          ? paths.map((path) => (
              <div key={path.Learning_Path_ID}>
                <strong>{path.Path_Name}</strong>
              </div>
            ))
          : "No Learning Paths",
    },    
  ];

  return (
    <div style={{ marginLeft: "15rem" }}>
      <Typography.Title level={2} className="typography-title">Reportees</Typography.Title>
      <Divider />
      <Table
        columns={columns}
        dataSource={reportees.map((reportee) => ({ ...reportee, key: reportee.User_ID }))}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};
