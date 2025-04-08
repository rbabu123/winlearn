import { useManagerDashboard } from "../../api/manager";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { Table, Tag, Typography, Collapse, Divider, Select } from "antd";
import { useAuth } from "../../contexts/userContext";
import { useState } from "react";
import { Reportee } from "../types";

const { Panel } = Collapse;
const { Option } = Select;

export const Reports = () => {
  const { userID } = useAuth();
  const { data, isLoading } = useManagerDashboard(userID);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReportee, setSelectedReportee] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingIndicator type="page" />;
  }

  if (!data || !data.data?.Reportees || data.data.Reportees.length === 0) {
    return <p>No reportees found.</p>;
  }

  const reportees: Reportee[] = data.data.Reportees;

  // Filter reportees based on search query or dropdown selection
  const filteredReportees = reportees.filter((reportee) =>
    selectedReportee
      ? reportee.User_ID.toString() === selectedReportee
      : reportee.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ marginLeft: "15rem" }}>
      <Typography.Title level={2} className="typography-title">Reports</Typography.Title>
      <Divider />

      {/* Search and Dropdown Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

        <Select
          placeholder="Select a reportee"
          allowClear
          onChange={(value) => {
            setSearchQuery(""); // Clear search query
            setSelectedReportee(value);
          }}
          style={{ width: 300 }}
        >
          {reportees.map((reportee) => (
            <Option key={reportee.User_ID} value={reportee.User_ID.toString()}>
              {reportee.Name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Display Reportees */}
      {filteredReportees.length === 0 ? (
        <p>No matching reportees found.</p>
      ) : (
        filteredReportees.map((reportee) => (
          <div key={reportee.User_ID} style={{ marginBottom: "20px" }}>
            <Typography.Title level={4}>{reportee.Name}</Typography.Title>
            {reportee.Learning_Paths.length === 0 ? (
              <p>No learning paths assigned.</p>
            ) : (
              <Collapse>
                {reportee.Learning_Paths.map((path) => (
                  <Panel
                    header={`Learning Path: ${path.Path_Name} - ${path.Is_Completed ? "Completed" : "Assigned"}`}
                    key={path.Learning_Path_ID}
                    extra={
                      <Tag color={path.Is_Completed ? "green" : path.Due_Date && new Date(path.Due_Date) < new Date() ? "red" : "blue"}>
                        {path.Is_Completed ? "Completed" : path.Due_Date && new Date(path.Due_Date) < new Date() ? "Overdue" : "Assigned"}
                      </Tag>
                    }
                  >
                    <Table
                      dataSource={path.Courses.map((course) => ({ ...course, key: course.Course_ID }))}
                      pagination={false}
                      columns={[
                        { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
                        { title: "Completion Date", dataIndex: "Completion_Date", key: "Completion_Date", render: (date) => date || "Not Completed" },
                        { title: "Score", dataIndex: "Latest_Score", key: "Latest_Score", render: (score) => score !== null ? score : "N/A" },
                        { title: "Status", key: "Is_Completed", render: (_, course) => <Tag color={course.Is_Completed ? "green" : "orange"}>{course.Is_Completed ? "Completed" : "Pending"}</Tag> },
                        ...(path.Is_Completed ? [] : [
                          { title: "Assigned Date", dataIndex: "Assigned_Date", key: "Assigned_Date", render: (date: any) => date || "Not Available" },
                          { title: "Due Date", dataIndex: "Due_Date", key: "Due_Date", render: (date: any) => date || "Not Available" },
                        ])
                      ]}
                    />
                  </Panel>
                ))}
              </Collapse>
            )}
          </div>
        ))
      )}
    </div>
  );
};
