// import { Card, Col, Divider, Row, Statistic, Typography } from "antd";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
// import { useFetchUserDashboardData } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { LoadingIndicator } from "../../global/loadingIndicator";
// import { Alert } from "antd";
// import { Course, LearningPath } from "../types";

// const { Title } = Typography;

// // Colors for pie chart
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export const LearnerReports = () => {
//   const { userID } = useAuth();
//   const { data, isLoading, isError } = useFetchUserDashboardData(userID);

//   if (isLoading) return <LoadingIndicator type="page" />;
//   if (isError) return <Alert message="Error loading reports data" type="error" showIcon />;

//   // Get today's date for overdue calculations
//   const today = new Date();
//   // Process learning paths
//   const learningPaths: LearningPath[] = data || [];
//   // Extract courses from all learning paths
//   const allCourses: Course[] = learningPaths.flatMap((path) => path.Courses);

//   // Filter Courses
//   const completedCourses = allCourses.filter((course) => course.Is_Completed);
//   const assignedCourses = allCourses.filter((course) => !course.Is_Completed);
//   const overdueCourses = assignedCourses.filter((course) => new Date(course.Due_Date) < today);
//   // Count Metrics
//   const totalAssigned = assignedCourses.length;
//   const totalCompleted = completedCourses.length;
//   const totalOverdue = overdueCourses.length;

//   // Data for Bar Chart (Course Scores)
//   const scoreData = completedCourses.map((course) => ({
//     name: course.Course_Name,
//     score: course.Latest_Score,
//   }));

//   // Data for Pie Chart (Completion Status)
//   const completionData = [
//     { name: "Completed", value: totalCompleted },
//     { name: "Assigned", value: totalAssigned },
//     { name: "Overdue", value: totalOverdue },
//   ];

//   return (
//     <div style={{ marginLeft: "15rem" }}>
//       <Title level={2} className="typography-title">Learning Path Reports</Title>
//       <Divider />
//       {/* Summary Stats */}
//       <Row gutter={16} style={{ marginBottom: "20px" }}>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Total Assigned Courses" value={totalAssigned} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Completed Courses" value={totalCompleted} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Overdue Courses" value={totalOverdue} />
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts Section */}
//       <Row gutter={16}>
//         {/* Bar Chart - Scores */}
//         <Col span={12}>
//           <Card title="Course Scores">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={scoreData}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="score" fill="#1890FF" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>

//         {/* Pie Chart - Completion Status */}
//         <Col span={12}>
//           <Card title="Completion Status">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={completionData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label
//                 >
//                   {completionData.map((_entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };


// import { Card, Col, Divider, Row, Statistic, Typography, Collapse, Progress, Alert } from "antd";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { useFetchUserDashboardData } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { LoadingIndicator } from "../../global/loadingIndicator";
// import { Course, LearningPath } from "../types";

// const { Title, Text } = Typography;
// const { Panel } = Collapse;

// // Colors for pie chart
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export const LearnerReports = () => {
//   const { userID } = useAuth();
//   const { data, isLoading, isError } = useFetchUserDashboardData(userID);

//   if (isLoading) return <LoadingIndicator type="page" />;
//   if (isError) return <Alert message="Error loading reports data" type="error" showIcon />;

//   // Get today's date for overdue calculations
//   const today = new Date();
//   // Process learning paths
//   const learningPaths: LearningPath[] = data || [];
//   // Extract courses from all learning paths
//   const allCourses: Course[] = learningPaths.flatMap((path) => path.Courses);

//   // Filter Courses
//   const completedCourses = allCourses.filter((course) => course.Is_Completed);
//   const assignedCourses = allCourses.filter((course) => !course.Is_Completed);
//   const overdueCourses = assignedCourses.filter((course) => new Date(course.Due_Date) < today);
  
//   // Count Metrics
//   const totalAssigned = assignedCourses.length;
//   const totalCompleted = completedCourses.length;
//   const totalOverdue = overdueCourses.length;

//   // Data for Pie Chart (Completion Status)
//   const completionData = [
//     { name: "Completed", value: totalCompleted },
//     { name: "Assigned", value: totalAssigned },
//     { name: "Overdue", value: totalOverdue },
//   ];

//   return (
//     <div style={{ marginLeft: "15rem", paddingBottom: "2rem" }}>
//       <Title level={2} className="typography-title">Learning Path Reports</Title>
//       <Divider />

//       {/* Summary Stats */}
//       <Row gutter={16} style={{ marginBottom: "20px" }}>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Total Assigned Courses" value={totalAssigned} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Completed Courses" value={totalCompleted} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Overdue Courses" value={totalOverdue} />
//           </Card>
//         </Col>
//       </Row>

//       {/* Learning Paths & Courses List */}
//       <Card title="Learning Paths & Courses">
//         <Collapse accordion>
//           {learningPaths.map((path) => (
//             <Panel header={path.Path_Name} key={path.Learning_Path_ID}>
//               {path.Courses.length > 0 ? (
//                 path.Courses.map((course) => (
//                   <div key={course.Course_ID} style={{ padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
//                     <Text>{course.Course_Name}</Text>
//                     <Progress
//                       type="circle"
//                       percent={course.Latest_Score || 0}
//                       width={50}
//                       format={(percent) => `${percent}%`}
//                       status={course.Latest_Score >= 70 ? "success" : "exception"}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <Text type="secondary">No courses assigned</Text>
//               )}
//             </Panel>
//           ))}
//         </Collapse>
//       </Card>

//       <Divider />

//       {/* Charts Section */}
//       <Row gutter={16}>
//         {/* Pie Chart - Completion Status */}
//         <Col span={12}>
//           <Card title="Completion Status">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={completionData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label
//                 >
//                   {completionData.map((_entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };


// import { Card, Col, Divider, Row, Statistic, Typography, Alert } from "antd";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
// import { useFetchUserDashboardData } from "../../api/learner";
// import { useAuth } from "../../contexts/userContext";
// import { LoadingIndicator } from "../../global/loadingIndicator";
// import { Course, LearningPath } from "../types";

// const { Title } = Typography;

// // Colors for charts
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A633FF", "#FF5733"];

// export const LearnerReports = () => {
//   const { userID } = useAuth();
//   const { data, isLoading, isError } = useFetchUserDashboardData(userID);

//   if (isLoading) return <LoadingIndicator type="page" />;
//   if (isError) return <Alert message="Error loading reports data" type="error" showIcon />;

//   // Get today's date for overdue calculations
//   const today = new Date();
//   // Process learning paths
//   const learningPaths: LearningPath[] = data || [];
//   // Extract courses from all learning paths
//   const allCourses: Course[] = learningPaths.flatMap((path) => path.Courses);

//   // Filter Courses
//   const completedCourses = allCourses.filter((course) => course.Is_Completed);
//   const assignedCourses = allCourses.filter((course) => !course.Is_Completed);
//   const overdueCourses = assignedCourses.filter((course) => new Date(course.Due_Date) < today);
  
//   // Count Metrics
//   const totalAssigned = assignedCourses.length;
//   const totalCompleted = completedCourses.length;
//   const totalOverdue = overdueCourses.length;

//   // Data for Pie Chart (Completion Status)
//   const completionData = [
//     { name: "Completed", value: totalCompleted },
//     { name: "Assigned", value: totalAssigned },
//     { name: "Overdue", value: totalOverdue },
//   ];

//   // Data for Bar Chart (Learning Paths with Assigned & Completed Courses)
//   const learningPathData = learningPaths.map((path) => ({
//     name: path. Path_Name,
//     Assigned: path.Courses.length,
//     Completed: path.Courses.filter((c) => c.Is_Completed).length,
//   }));

//   // Data for Radar Chart (Course Scores)
//   const scoreData = completedCourses.map((course) => ({
//     subject: course.Course_Name,
//     Score: course.Latest_Score,
//   }));

//   return (
//     <div style={{ marginLeft: "15rem", paddingBottom: "2rem" }}>
//       <Title level={2} className="typography-title">Learning Path Reports</Title>
//       <Divider />

//       {/* Summary Stats */}
//       <Row gutter={16} style={{ marginBottom: "20px" }}>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Total Assigned Courses" value={totalAssigned} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Completed Courses" value={totalCompleted} />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic title="Overdue Courses" value={totalOverdue} />
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts Section */}
//       <Row gutter={16}>
//         {/* Bar Chart - Learning Path Courses */}
//         <Col span={12}>
//           <Card title="Courses per Learning Path">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={learningPathData} layout="vertical">
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="Assigned" fill="#1890FF" name="Assigned Courses" />
//                 <Bar dataKey="Completed" fill="#52C41A" name="Completed Courses" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>

//         {/* Donut Chart - Completion Status */}
//         <Col span={12}>
//           <Card title="Completion Status">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={completionData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={70}  // Makes it a donut chart
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label
//                 >
//                   {completionData.map((_entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>

//       {/* Radar Chart - Course Scores */}
//       <Row gutter={16} style={{ marginTop: "20px" }}>
//         <Col span={24}>
//           <Card title="Course Performance (Score)">
//             <ResponsiveContainer width="100%" height={300}>
//               <RadarChart outerRadius={100} data={scoreData}>
//                 <PolarGrid />
//                 <PolarAngleAxis dataKey="subject" />
//                 <Tooltip />
//                 <Radar name="Score" dataKey="Score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
//               </RadarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };


import { useState } from "react";
import { Card, Col, Divider, Row, Statistic, Typography, Alert, Table, Select, Modal } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { useFetchUserDashboardData } from "../../api/learner";
import { useAuth } from "../../contexts/userContext";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { Course, LearningPath } from "../types";

const { Title } = Typography;
const { Option } = Select;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A633FF", "#FF5733"];

export const LearnerReports = () => {
  const { userID } = useAuth();
  const { data, isLoading, isError } = useFetchUserDashboardData(userID);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
  if (isLoading) return <LoadingIndicator type="page" />;
  if (isError) return <Alert message="Error loading reports data" type="error" showIcon />;

  const today = new Date();
  const learningPaths: LearningPath[] = data || [];
  const allCourses: Course[] = learningPaths.flatMap((path) => path.Courses);
  
  // const handlePathSelect = (pathName: string) => {
  //   const selected = learningPaths.find((path) => path.Path_Name === pathName) || null;
  //   setSelectedPath(selected);
  //   setIsModalOpen(true);
  // };
  
  const selectedCourses = selectedPath ? selectedPath.Courses : allCourses;
  const completedCourses = selectedCourses.filter((course) => course.Is_Completed);
  const assignedCourses = selectedCourses.filter((course) => !course.Is_Completed);
  const overdueCourses = assignedCourses.filter((course) => new Date(course.Due_Date) < today);

  const completionData = [
    { name: "Completed", value: completedCourses.length },
    { name: "Assigned", value: assignedCourses.length },
    { name: "Overdue", value: overdueCourses.length },
  ];

  const scoreData = completedCourses.slice(0, 10).map((course: Course) => ({
    subject: course.Course_Name,
    Score: course.Latest_Score,
  }));

  const handleCardClick = (type: string) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const getCoursesByType = () => {
    switch (selectedType) {
      case "Completed": return completedCourses;
      case "Assigned": return assignedCourses;
      case "Overdue": return overdueCourses;
      default: return [];
    }
  };
  const getColumnsByType = () => {
    switch (selectedType) {
      case "Completed":
        return [
          { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
          { title: "Status", dataIndex: "Is_Completed", key: "Is_Completed", render: (val: any) => (val ? "Completed" : "Assigned") },
          { title: "Score", dataIndex: "Latest_Score", key: "Latest_Score" },
          { title: "Completion Date", dataIndex: "Completion_Date", key: "Completion"},
        ];
      case "Assigned":
        return [
          { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
          { title: "Score", dataIndex: "Latest_Score", key: "Latest_Score" },
          { title: "Assigned Date", dataIndex: "Assigned_Date", key: "Assigned_Date" },
          { title: "Due Date", dataIndex: "Due_Date", key: "Due_Date" },
        ];
      case "Overdue":
        return [
          { title: "Course Name", dataIndex: "Course_Name", key: "Course_Name" },
          { title: "Score", dataIndex: "Latest_Score", key: "Latest_Score" },
          { title: "Assigned Date", dataIndex: "Assigned_Date", key: "Assigned_Date" },
          { title: "Overdue Date", dataIndex: "Due_Date", key: "Due_Date" },
        ];
      default:
        return [];
    }
  };
  
  return (
    <div style={{ marginLeft: "15rem", paddingBottom: "2rem" }}>
      <Title level={2} className="typography-title">Learning Path Reports</Title>
      <Divider />
      <Select
  style={{ width: "50%", marginBottom: "1rem" }}
  value={selectedPath ? selectedPath.Path_Name : null}
  onChange={(value) => {
    const selected = learningPaths.find((path) => path.Path_Name === value) || null;
    setSelectedPath(selected);
  }}
>
  <Option value={null}>All Courses</Option>
  {learningPaths.map((path) => (
    <Option key={path.Path_Name} value={path.Path_Name}>
      {path.Path_Name}
    </Option>
  ))}
</Select>

      
      {/* <Row gutter={16} style={{ marginBottom: "20px" }}>
        {learningPaths.map((path) => {
          const completedCount = path.Courses.filter((course) => course.Is_Completed).length;
          const assignedCourses = path.Courses.filter((course) => !course.Is_Completed);
          const overdueCount = assignedCourses.filter((course) => new Date(course.Due_Date) < today).length;
          const inProgressCount = assignedCourses.length - overdueCount;

          return (
            <Col span={8} key={path.Path_Name}>
              <Card onClick={() => handlePathSelect(path.Path_Name)}>
                <Statistic title={`Learning Path: ${path.Path_Name}`} value={path.Courses.length} suffix="courses" />
                <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  <li style={{ fontSize: "14px", color: "green" }}>✅ Completed: {completedCount}</li>
                  <li style={{ fontSize: "14px", color: "orange" }}>⏳ In Progress: {inProgressCount}</li>
                  <li style={{ fontSize: "14px", color: "red" }}>⚠️ Overdue: {overdueCount}</li>
                </ul>
              </Card>
            </Col>
          );
        })}
      </Row> */}

{/* <Row gutter={16} style={{ marginBottom: "20px" }}>
        {learningPaths.map((path) => {
          const completedCount = path.Courses.filter((course) => course.Is_Completed).length;
          const assignedCourses = path.Courses.filter((course) => !course.Is_Completed);
          const overdueCount = assignedCourses.filter((course) => new Date(course.Due_Date) < today).length;
          const inProgressCount = assignedCourses.length - overdueCount;

          return (
            <Col span={8} key={path.Path_Name}>
              <Card onClick={() => handlePathSelect(path.Path_Name)}>
                <Statistic title={`Learning Path: ${path.Path_Name}`} value={path.Courses.length} suffix="courses" />
                <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  <li style={{ fontSize: "14px", color: "green" }}>✅ Completed: {completedCount}</li>
                  <li style={{ fontSize: "14px", color: "orange" }}>⏳ In Progress: {inProgressCount}</li>
                  <li style={{ fontSize: "14px", color: "red" }}>⚠️ Overdue: {overdueCount}</li>
                </ul>
              </Card>
            </Col>
          );
        })}
      </Row> */}
      
      {/* Modal for Course Details */}
      {/* <Modal
        title={selectedPath?.Path_Name}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table dataSource={selectedPath?.Courses || []} columns={columns} rowKey="Course_Name" pagination={{ pageSize: 5 }} />
      </Modal> */}

       {/* Summary Cards */}
       <Row gutter={16} style={{ marginBottom: "20px" }}>
        {["Completed", "Assigned", "Overdue"].map((type, index) => (
          <Col span={8} key={type}>
            <Card onClick={() => handleCardClick(type)}>
              <Statistic title={type} value={completionData[index].value} suffix="courses" />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Course Details */}
      <Modal
        title={`${selectedType} Courses`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table  dataSource={getCoursesByType()} 
    columns={getColumnsByType()}  rowKey="Course_Name" pagination={{ pageSize: 5 }} />
      </Modal>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Completion Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={completionData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {completionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="Course Performance (Score)">

            <ResponsiveContainer width="100%" height={300}>
              <RadarChart outerRadius={100} data={scoreData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Tooltip />
                <Radar name="Score" dataKey="Score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Course Details">
            <Table dataSource={selectedCourses} columns={columns} rowKey="Course_Name" pagination={{ pageSize: 10 }} />
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};
