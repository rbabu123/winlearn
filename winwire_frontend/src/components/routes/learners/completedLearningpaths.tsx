import { Card, List, Table, Tag, Typography, Alert, Checkbox, Divider } from "antd";
import { useFetchUserDashboardData } from "../../api/learner";
import { useAuth } from "../../contexts/userContext";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { LearningPath } from "../types";

const { Title } = Typography;

export const CompletedCourses = () => {
  const { userID } = useAuth();
  const { data, isLoading, isError } = useFetchUserDashboardData(userID);

  if (isLoading) return <LoadingIndicator type="page" />;
  if (isError) return <Alert message="Error loading data" type="error" showIcon />;

  // Filter completed learning paths
  const completedPaths = data?.filter((path: LearningPath) => path.Is_Completed) || [];

  return (
    <div style={{ marginLeft: "15rem" }}>
      <Title level={2} className="typography-title">Completed Learning Paths</Title>
      <Divider />
      {completedPaths.length ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={completedPaths}
          renderItem={(path: LearningPath) => (
            <List.Item>
              <Card title={path.Path_Name} extra={<Tag color="green">{path.Is_Completed && "Completed" }</Tag>}>
                <Title level={4} style={{ marginTop: "10px" }}>Courses</Title>
                <Table
                  dataSource={path.Courses.filter(course => course.Is_Completed)}
                  pagination={false}
                  rowKey="Course_ID"
                  columns={[
                    {
                        title: "Completion",
                        dataIndex: "Is_Completed",
                        key: "Is_Completed",
                        render: (isCompleted: boolean) => (
                          <Checkbox checked={isCompleted} />
                        ),
                      },
                    { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
                    { 
                      title: "Score", 
                      dataIndex: "Latest_Score", 
                      key: "Latest_Score", 
                      render: (score: number) => score ? `${score}%` : "-" 
                    },
                    {
                      title: "Assigned Date",
                      dataIndex: "Assigned_Date",
                      key: "Assigned_Date",
                      render: (date) => date || "Not Available",
                     },
                     {
                      title: "Completion Date",
                      dataIndex: "Completion_Date",
                      key: "Completion_Date",
                      render: (date) => date || "Not Completed",
                    },
                  ]}
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Card style={{ backgroundColor: "#FFF5EB", borderRadius: "8px", textAlign: "center", padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "16px" }}>
          </div>
          <Typography.Text>
            No completed learning paths found.
          </Typography.Text>
        </Card>
      )}
    </div>
  );
};
