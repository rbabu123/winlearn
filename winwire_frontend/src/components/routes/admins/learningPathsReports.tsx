// import  { useState } from 'react';
// import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
// import { Select, Typography, Card, Alert, Row, Col, Empty, Divider } from 'antd';
// import { useFetchLearningPathsReports } from '../../api/admin';
// import { LoadingIndicator } from '../../global/loadingIndicator';
// import { LearningPath } from '../learners/types';

// const { Option } = Select;

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// export const LearningPathReports = () => {
//     const { data, isLoading, error } = useFetchLearningPathsReports();
//     const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
//     console.log("data", data);

//     if (isLoading){
//         return <LoadingIndicator type='page' />;
//     }
//     if (error) return <Alert message="Error fetching data" type="error" />;

//     const barChartData = data?.map((path: LearningPath) => ({
//         name: path.Path_Name,
//         score: path.Average_Score,
//     })) || [];  
    
//     const selectedPath = data?.find((path: LearningPath) => path.Learning_Path_ID === selectedPathId) 
//                         || data?.[0];

//     const assignedData = [
//         { name: 'Assigned', value: selectedPath?.Total_Users_Assigned || 0 },
//         { name: 'Unassigned', value: Math.max(1, 100 - (selectedPath?.Total_Users_Assigned || 0)) }
//     ];

//     const completedData = [
//         { name: 'Completed', value: selectedPath?.Total_Users_Completed || 0 },
//         { name: 'Incomplete', value: Math.max(1, 100 - (selectedPath?.Total_Users_Completed || 0)) }
//     ];

//     const overdueData = [
//         { name: 'Overdue', value: selectedPath?.Total_Overdue || 0 },
//         { name: 'On Time', value: Math.max(1, 100 - (selectedPath?.Total_Overdue || 0)) }
//     ];

//     return (
//         <div style={{ marginLeft: "15rem" }}>
//             <div style={{ marginBottom: "20px" }}>
//                 <Typography.Title level={2} className='typography-title'>Learning Path Reports</Typography.Title>
//                 <Divider />
//                 <Typography.Paragraph>
//                     View detailed reports for each learning path.
//                 </Typography.Paragraph>
//                 {/* Dropdown Selector */}
//                 <Select
//                     placeholder="Select a Learning Path"
//                     style={{ width: 300, marginBottom: 20 }}
//                     onChange={(value) => setSelectedPathId(value)}
//                 >
//                     {data?.map((path: LearningPath) => (
//                         <Option key={path.Learning_Path_ID} value={path.Learning_Path_ID}>
//                             {path.Path_Name}
//                         </Option>
//                     )) || []}
//                 </Select>

//                 {/* Charts Section */}
//                 <Row gutter={[16, 16]}>
//                     {/* Bar Chart - Average Scores */}
//                     <Col span={8}>
//                         <Card title="Performance Comparison">
//                             {barChartData.length > 0 ? (
//                                 <BarChart width={300} height={300} data={barChartData}>
//                                     <XAxis dataKey="name" />
//                                     <YAxis />
//                                     <Bar dataKey="score" fill="#82ca9d" />
//                                     <Tooltip />
//                                     <Legend />
//                                 </BarChart>
//                             ) : (
//                                 <Empty description="No Data Available" />
//                             )}
//                         </Card>
//                     </Col>

//                     {/* Pie Charts for Assigned, Completed, Overdue */}
//                     <Col span={8}>
//                         <Card title="Assigned Users">
//                             <PieChart width={300} height={300}>
//                                 <Pie
//                                     data={assignedData}
//                                     cx="50%"
//                                     cy="50%"
//                                     dataKey="value"
//                                     label
//                                 >
//                                     {assignedData.map((_, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </Card>
//                     </Col>

//                     <Col span={8}>
//                         <Card title="Completed Users">
//                             <PieChart width={300} height={300}>
//                                 <Pie
//                                     data={completedData}
//                                     cx="50%"
//                                     cy="50%"
//                                     dataKey="value"
//                                     label
//                                 >
//                                     {completedData.map((_, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </Card>
//                     </Col>

//                     <Col span={8}>
//                         <Card title="Overdue Users">
//                             <PieChart width={300} height={300}>
//                                 <Pie
//                                     data={overdueData}
//                                     cx="50%"
//                                     cy="50%"
//                                     outerRadius={100}
//                                     dataKey="value"
//                                     label
//                                 >
//                                     {overdueData.map((_, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </Card>
//                     </Col>
//                 </Row>
//             </div>
//         </div>
//     );
// };


import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Select, Typography, Card, Alert, Row, Col, Empty, Divider } from 'antd';
import { useFetchLearningPathsReports } from '../../api/admin';
import { LoadingIndicator } from '../../global/loadingIndicator';
import { Course, LearningPath } from '../types';

const { Option } = Select;

export const LearningPathReports = () => {
  const { data, isLoading, error } = useFetchLearningPathsReports();
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  if (isLoading) return <LoadingIndicator type='page' />;
  if (error) return <Alert message='Error fetching data' type='error' />;

//   const selectedPath = data?.find((path: LearningPath) => path.Learning_Path_ID === selectedPathId) || data?.[0];
const selectedPath = data?.find((path: LearningPath) => path.Learning_Path_ID === selectedPathId);
  
const courseData = selectedPath?.Courses?.map((course: Course) => ({
    name: course.Course_Name,
    assigned: course.Total_Users_Assigned,
    completed: course.Total_Users_Completed,
    overdue: course.Total_Overdue,
    score: course.Average_Score
  })) || [];

  return (
    <div style={{ marginLeft: '15rem' }}>
        <Typography.Title level={2} className='typography-title'>Learning Path Reports</Typography.Title>
        <Divider />
        <Typography.Paragraph>Select the Learning path to view detailed reports for each learning path and its courses.</Typography.Paragraph>
        
        <Select
            placeholder='Select a Learning Path'
            style={{ width: 300, marginBottom: 20 }}
            onChange={(value) => setSelectedPathId(value)}
        >
            {data?.map((path: LearningPath) => (
            <Option key={path.Learning_Path_ID} value={path.Learning_Path_ID}>
                {path.Path_Name}
            </Option>
            ))}
        </Select>

        {/* Chart Section - Only show when a path is selected */}
        {selectedPath && (
            <Row>
            <Col span={24}>
                <Card title={`Course Progress for ${selectedPath.Path_Name}`}>
                {courseData.length > 0 ? (
                    <BarChart width={800} height={400} data={courseData}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='assigned' fill='#0088FE' name='Assigned' />
                    <Bar dataKey='completed' fill='#00C49F' name='Completed' />
                    <Bar dataKey='overdue' fill='#FFBB28' name='Overdue' />
                    {/* <Bar dataKey='score' fill='#FF8042' name='Average Score' /> */}
                    </BarChart>
                ) : (
                    <Empty description='No Data Available' />
                )}
                </Card>
            </Col>
            </Row>
        )}
    </div>
  );
};
