import { Button, Divider, Popconfirm, Table, Typography } from "antd";
import { useDeleteLearningPath, useFetchLearningPaths } from "../../api/admin";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/userContext";
const { Text } = Typography;

export const LearningPaths = () => {
    const { data, isLoading, error } = useFetchLearningPaths();
    const navigate = useNavigate();
    const { mutate: deleteLearningPath} = useDeleteLearningPath();
    const { userID } = useAuth();

    const handleDelete = (record: { Learning_Path_ID: number }) => {
        deleteLearningPath({ Learning_Path_ID: record.Learning_Path_ID, User_ID: userID });
    };

    const columns = [
        {
            title: "Path Name",
            dataIndex: "Path_Name",
            key: "Path_Name",
        },
        {
            title: "Description",
            dataIndex: "Path_Description",
            key: "Path_Description",
        },
        {
            title: "Category",
            dataIndex: "Path_Category",
            key: "Path_Category",
        },
        {
            title: "Due Days",
            dataIndex: "Due_Days",
            key: "Due_Days",
        },
        // {
        //     title: "Assigned Users",
        //     dataIndex: "Total_Users_Assigned",
        //     key: "Total_Users_Assigned",
        // },
        // {
        //     title: "Completed Users",
        //     dataIndex: "Total_Users_Completed",
        //     key: "Total_Users_Completed",
        // },
        // {
        //     title: "Overdue Users",
        //     dataIndex: "Total_Overdue",
        //     key: "Total_Overdue",
        // },
        {
            title: "Created By",
            dataIndex: "Creator_Admin_Name",
            key: "Creator_Admin_Name",
        },
        {
            title: "Created At",
            dataIndex: "Created_Date",
            key: "Created_Date",
        },
        {
            title: "Actions",
            key: "actions",
            render: ( record: any) => (
                <div>
                    <Popconfirm
                        title="Are you sure you want to delete this learning path?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined 
                            style={{ color: "#ff4d4f", cursor: "pointer" }} 
                        />
                    </Popconfirm>
                </div>
            ),
        }
    ];

    // Expandable row for courses
    const expandableRowRender = (record: any) => {
        const courseColumns = [
            {
                title: "Course Name",
                dataIndex: "Course_Name",
                key: "Course_Name",
            },
            {
                title: "Course URL",
                dataIndex: "Course_URL",
                key: "Course_URL",
                render: (url: any) => (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                    </a>
                )
            },
            // {
            //     title: "Users Assigned",
            //     dataIndex: "Total_Users_Assigned",
            //     key: "Total_Users_Assigned",
            // },
            // {
            //     title: "Users Completed",
            //     dataIndex: "Total_Users_Completed",
            //     key: "Total_Users_Completed",
            // },
            // {
            //     title: "Overdue Users",
            //     dataIndex: "Total_Overdue",
            //     key: "Total_Overdue",
            // }
        ];

        return (
            <Table
                columns={courseColumns}
                dataSource={record.Courses}
                rowKey="Course_ID"
                pagination={false}
            />
        );
    };
    if(!data) {
        return <LoadingIndicator type="page" />;
    }

    if (isLoading) {
        return <LoadingIndicator type="page" />;
    }
    if (error) return <Text type="danger">Error fetching data</Text>;
    const handleCreateNew = () => {
        navigate("/admin/dashboard/add-learning-paths");  // Navigate to AddLearningPaths page
    };
    return (
        <div style={{ marginLeft: "15rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <Typography.Title level={2} className="typography-title">Learning Paths</Typography.Title>
                <Button type="primary" onClick={handleCreateNew}>
                    Create New Learning Path
                </Button>
            </div>
            <Divider />
        <Table
            columns={columns}
            dataSource={data}
            rowKey="Learning_Path_ID"
            expandable={{ expandedRowRender: expandableRowRender, 
                // expandRowByClick: true, // Expand row on click
                // expandIcon: () => null, // Removes the expand icon
                // expandIconColumnIndex: -1, // Removes extra space 
            }}
            pagination={{ pageSize: 5 }}

        />
        </div>
    );
};

