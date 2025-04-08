// import { Card, List, Table, Tag, Typography, Alert, Button, Checkbox, Divider } from "antd";
// import { useFetchUserDashboardData } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { LoadingIndicator } from "../../global/loadingIndicator";
// import { MailOutlined } from "@ant-design/icons";
// import { Course, LearningPath } from "./types";
// import { useNavigate } from "react-router-dom";

// const { Title, Text, Link } = Typography;

// export const LearnerLearningPaths = () => {
//   const { userID } = useAuth();
//   const { data, isLoading, isError } = useFetchUserDashboardData(userID);
//   const navigate = useNavigate();
//   // Filter Assigned learning paths
//   const AssignedPaths = data?.filter((path: LearningPath) => !path.Is_Completed) || [];
//   const handleAssessment = (courseID: number) => {
//     navigate(`/learner/dashboard/assessment/${courseID}`);
//   };

//   if (isLoading) return <LoadingIndicator type="page" />;
//   if (isError) return <Alert message="Error loading dashboard data" type="error" showIcon />;
//   const isOverdue = (dueDate: string) => {
//     const now = new Date();
//     const endOfDay = new Date(dueDate);
//     endOfDay.setHours(23, 59, 59, 999);
//     return now > endOfDay;
//   };
//   return (
//     <div style={{ marginLeft: "15rem" }}>
//       <Title level={2} className="typography-title">Assigned Learning Paths - {AssignedPaths.length}</Title>
//       <Divider />
//       {AssignedPaths?.length ? (
//         <List
//           grid={{ gutter: 16, column: 1 }}
//           dataSource={AssignedPaths}
//           renderItem={(path: LearningPath) => (
//             <List.Item>
//               <Card title={path.Path_Name}  
//                 extra={
//                     <Tag
//                     color={
//                         path.Is_Completed
//                         ? "green"
//                         : isOverdue(path.Due_Date)
//                         ? "red"
//                         : "blue"
//                     }
//                     >
//                     {path.Is_Completed
//                         ? "Completed"
//                         : isOverdue(path.Due_Date)
//                         ? "Overdue"
//                         : "In Progress"}
//                     </Tag>
//                     }
//                 >
//                 <Title level={4} style={{ marginTop: "10px" }}>Courses</Title>
//                 <Table
//                   dataSource={path.Courses}
//                   pagination={false}
//                   rowKey="Course_ID"
//                   columns={[
//                     {
//                         title: "Completion",
//                         dataIndex: "Is_Completed",
//                         key: "Is_Completed",
//                         render: (isCompleted: boolean) => (
//                           <Checkbox  checked={isCompleted} />
//                         ),
//                       },
//                     { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
//                     {
//                       title: "Course URL",
//                       dataIndex: "Course_URL",
//                       key: "Course_URL",
//                       render: (url: string) => (
//                         url ? (
//                           <Link href={url} target="_blank" rel="noopener noreferrer">
//                             {url}
//                           </Link>
//                         ) : "-"
//                       ),
//                     },
//                     {
//                       title: "Assigned Date",
//                       dataIndex: "Assigned_Date",
//                       key: "Assigned_Date",
//                       render: (date: string) => date || "Not Available",
//                     },
//                     {
//                       title: "Due Date",
//                       dataIndex: "Due_Date",
//                       key: "Due_Date",
//                       render: (date: string) => date || "Not Available",
//                     },

//                     // {
//                     //   title: "Actions",
//                     //   key: "actions",
//                     //   render: (record: Course) => (
//                     //     <Button 
//                     //       type="primary" 
//                     //       onClick={() => handleAssessment(record.Course_ID)}
//                     //     >
//                     //       Take Assessment
//                     //     </Button>
//                     //   ),
//                     // },
//                     {
//                       title: "Actions",
//                       key: "actions",
//                       render: (record: Course) => (
//                         !record.Is_Completed ? (
//                           <Button 
//                             type="primary" 
//                             onClick={() => handleAssessment(record.Course_ID)}
//                           >
//                             Take Assessment
//                           </Button>
//                         ) : <Text strong>Assessment Completed</Text>
//                       ),
//                     },
//                   ]}
//                 />
//               </Card>
//             </List.Item>
//           )}
//         />
//       ) : (
//         <Card style={{ backgroundColor: "#FFF5EB", borderRadius: "8px", textAlign: "center", padding: "40px" }}>
//           <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "16px" }}>
//             <MailOutlined style={{ fontSize: "64px", color: "#FA8C16" }} />
//           </div>
//           <Typography.Text>
//             Training will help you upskill in technology. You don't have any training to complete right now, but keep an eye on your inbox for upcoming assignments.
//           </Typography.Text>
//         </Card>
//       )}
//     </div>
//   );
// };


// import { Card, List, Table, Tag, Typography, Alert, Button, Checkbox, Divider } from "antd";
// import { useFetchUserDashboardData } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { LoadingIndicator } from "../../global/loadingIndicator";
// import { MailOutlined } from "@ant-design/icons";
// import { Course, LearningPath } from "./types";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const { Title, Text, Link } = Typography;

// export const LearnerLearningPaths = () => {
//   const { userID } = useAuth();
//   const { data, isLoading, isError } = useFetchUserDashboardData(userID);
//   const navigate = useNavigate();
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

//   const AssignedPaths = data?.filter((path: LearningPath) => !path.Is_Completed) || [];

//   const handleAssessment = (courseID: number) => {
//     navigate(`/learner/dashboard/assessment/${courseID}`);
//   };

//   const handleViewResults = (course: Course) => {
//     setSelectedCourse(course);
//   };

//   const isOverdue = (dueDate: string) => {
//     const now = new Date();
//     const endOfDay = new Date(dueDate);
//     endOfDay.setHours(23, 59, 59, 999);
//     return now > endOfDay;
//   };

//   if (isLoading) return <LoadingIndicator type="page" />;
//   if (isError) return <Alert message="Error loading dashboard data" type="error" showIcon />;

//   return (
//     <div style={{ marginLeft: "15rem" }}>
//       <Title level={2} className="typography-title">Assigned Learning Paths - {AssignedPaths.length}</Title>
//       <Divider />
//       {AssignedPaths?.length ? (
//         <List
//           grid={{ gutter: 16, column: 1 }}
//           dataSource={AssignedPaths}
//           renderItem={(path: LearningPath) => (
//             <List.Item>
//               <Card title={path.Path_Name}  
//                 extra={
//                     <Tag
//                     color={
//                         path.Is_Completed
//                         ? "green"
//                         : isOverdue(path.Due_Date)
//                         ? "red"
//                         : "blue"
//                     }
//                     >
//                     {path.Is_Completed
//                         ? "Completed"
//                         : isOverdue(path.Due_Date)
//                         ? "Overdue"
//                         : "In Progress"}
//                     </Tag>
//                     }
//                 >
//                 <Title level={4} style={{ marginTop: "10px" }}>Courses</Title>
//                 <Table
//                   dataSource={path.Courses}
//                   pagination={false}
//                   rowKey="Course_ID"
//                   columns={[
//                     {
//                         title: "Completion",
//                         dataIndex: "Is_Completed",
//                         key: "Is_Completed",
//                         render: (isCompleted: boolean) => (
//                           <Checkbox checked={isCompleted} />
//                         ),
//                       },
//                     { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
//                     {
//                       title: "Course URL",
//                       dataIndex: "Course_URL",
//                       key: "Course_URL",
//                       render: (url: string) => (
//                         url ? (
//                           <Link href={url} target="_blank" rel="noopener noreferrer">
//                             {url}
//                           </Link>
//                         ) : "-"
//                       ),
//                     },
//                     {
//                       title: "Assigned Date",
//                       dataIndex: "Assigned_Date",
//                       key: "Assigned_Date",
//                       render: (date: string) => date || "Not Available",
//                     },
//                     {
//                       title: "Due Date",
//                       dataIndex: "Due_Date",
//                       key: "Due_Date",
//                       render: (date: string) => date || "Not Available",
//                     },
//                     {
//                         title: "Actions",
//                         key: "actions",
//                         render: (record: Course) => (
//                           record.Is_Completed ? (
//                             <div>
//                               <Text strong>Assessment Completed</Text>
//                               {record.Latest_Score !== null && (
//                                 <Button 
//                                   style={{ marginLeft: 8 }} 
//                                   onClick={() => handleViewResults(record)}
//                                 >
//                                   View Results
//                                 </Button>
//                               )}
//                             </div>
//                           ) : (
//                             <Button type="primary" onClick={() => handleAssessment(record.Course_ID)}>
//                               Take Assessment
//                             </Button>
//                           )
//                         ),
//                       },
//                   ]}
//                 />

//                 {selectedCourse && selectedCourse.Course_ID === path.Courses.find(c => c.Course_ID === selectedCourse.Course_ID)?.Course_ID && (
//                   <div>
//                     <Divider />
//                     <Title level={4}>Course Results</Title>
//                     <Table
//                       dataSource={[selectedCourse]}
//                       pagination={false}
//                       rowKey="Course_ID"
//                       columns={[
//                         { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
//                         { title: "Latest Score", dataIndex: "Latest_Score", key: "Latest_Score" },
//                         { title: "Completion Date", dataIndex: "Completion_Date", key: "Completion_Date" },
//                       ]}
//                     />
//                   </div>
//                 )}
//               </Card>
//             </List.Item>
//           )}
//         />
//       ) : (
//         <Card style={{ backgroundColor: "#FFF5EB", borderRadius: "8px", textAlign: "center", padding: "40px" }}>
//           <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "16px" }}>
//             <MailOutlined style={{ fontSize: "64px", color: "#FA8C16" }} />
//           </div>
//           <Typography.Text>
//             Training will help you upskill in technology. You don't have any training to complete right now, but keep an eye on your inbox for upcoming assignments.
//           </Typography.Text>
//         </Card>
//       )}
//     </div>
//   );
// };


import { Card, List, Table, Tag, Typography, Alert, Button, Checkbox, Divider, Modal } from "antd";
import { useFetchUserDashboardData } from "../../api/learner";
import { useAuth } from "../../contexts/userContext";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { MailOutlined } from "@ant-design/icons";
import { Course, LearningPath } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title, Text, Link } = Typography;

export const LearnerLearningPaths = () => {
  const { userID } = useAuth();
  const { data, isLoading, isError } = useFetchUserDashboardData(userID);
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const AssignedPaths = data?.filter((path: LearningPath) => !path.Is_Completed) || [];

  const handleAssessment = (courseID: number) => {
    navigate(`/learner/dashboard/assessment/${courseID}`);
  };

  const handleViewResults = (course: Course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCourse(null);
  };

  const isOverdue = (dueDate: string) => {
    const now = new Date();
    const endOfDay = new Date(dueDate);
    endOfDay.setHours(23, 59, 59, 999);
    return now > endOfDay;
  };

  if (isLoading) return <LoadingIndicator type="page" />;
  if (isError) return <Alert message="Error loading dashboard data" type="error" showIcon />;

  return (
    <div style={{ marginLeft: "15rem" }}>
      <Title level={2} className="typography-title">Assigned Learning Paths - {AssignedPaths.length}</Title>
      <Divider />
      {AssignedPaths?.length ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={AssignedPaths}
          renderItem={(path: LearningPath) => (
            <List.Item>
              <Card title={path.Path_Name}  
                extra={
                  <Tag
                    color={
                      path.Is_Completed
                        ? "green"
                        : isOverdue(path.Due_Date)
                        ? "red"
                        : "blue"
                    }
                  >
                    {path.Is_Completed
                      ? "Completed"
                      : isOverdue(path.Due_Date)
                      ? "Overdue"
                      : "In Progress"}
                  </Tag>
                }
              >
                <Title level={4} style={{ marginTop: "10px" }}>Courses</Title>
                <Table
                  dataSource={path.Courses}
                  pagination={false}
                  rowKey="Course_ID"
                  columns={[
                    {
                      title: "Completion",
                      dataIndex: "Is_Completed",
                      key: "Is_Completed",
                      render: (isCompleted: boolean) => (
                        <Checkbox checked={isCompleted} disabled={!isCompleted}  />
                      ),
                    },
                    { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
                    {
                      title: "Course URL",
                      dataIndex: "Course_URL",
                      key: "Course_URL",
                      render: (url: string) => (
                        url ? (
                          <Link href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                          </Link>
                        ) : "-"
                      ),
                    },
                    {
                      title: "Assigned Date",
                      dataIndex: "Assigned_Date",
                      key: "Assigned_Date",
                      render: (date: string) => date || "Not Available",
                    },
                    {
                      title: "Due Date",
                      dataIndex: "Due_Date",
                      key: "Due_Date",
                      render: (date: string) => date || "Not Available",
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (record: Course) => (
                        record.Is_Completed ? (
                          <div>
                            <Text strong>Assessment Completed</Text>
                            {record.Latest_Score !== null && (
                              <Button 
                                style={{ marginLeft: 8 }} 
                                onClick={() => handleViewResults(record)}
                              >
                                View Results
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button type="primary" onClick={() => handleAssessment(record.Course_ID)}>
                            Take Assessment
                          </Button>
                        )
                      ),
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
            <MailOutlined style={{ fontSize: "64px", color: "#FA8C16" }} />
          </div>
          <Typography.Text>
            Training will help you upskill in technology. You don't have any training to complete right now, but keep an eye on your inbox for upcoming assignments.
          </Typography.Text>
        </Card>
      )}

      {/* Modal for Course Results */}
      <Modal
        title="Course Results"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedCourse && (
          <Table
            dataSource={[selectedCourse]}
            pagination={false}
            rowKey="Course_ID"
            columns={[
              { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
              { title: "Score", dataIndex: "Latest_Score", key: "Latest_Score" },
              { title: "Completion Date", dataIndex: "Completion_Date", key: "Completion_Date" },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};