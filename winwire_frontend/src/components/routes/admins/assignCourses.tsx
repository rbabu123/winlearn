import { Button, Card, Divider, Select, Table, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAssignLearningPaths, useFetchLearningPaths, useGetAllUsers } from "../../api/admin";
import { LoadingIndicator } from "../../global/loadingIndicator";
import { useState } from "react";
import { ColumnFilterItem } from "antd/es/table/interface";
import "./styles.css";
import { LearningPath, User } from "../types";

const { Option } = Select;

export const AssignCourses = () => {
    const { data: users, isLoading: usersLoading } = useGetAllUsers();
    const { data: learningPaths, isLoading: pathsLoading } = useFetchLearningPaths();
    const assignLearningPathsMutation = useAssignLearningPaths();

    const [selectedLearningPath, setSelectedLearningPath] = useState<number | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    // Filter configurations for the Ant Design table
    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
            filters: users
                ? Array.from(
                    new Set(users.map((user: User) => user.Name))
                ).map((name) => ({ text: name, value: name })) as ColumnFilterItem[]
                : [],
            filterSearch: true,
            onFilter: (value, record) => record.Name.includes(value as string),
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            key: 'Email',
            filters: users
                ? Array.from(
                    new Set(users.map((user: User) => user.Email))
                ).map((email) => ({ text: email, value: email })) as ColumnFilterItem[]
                : [],
            filterSearch: true,
            onFilter: (value, record) => record.Email.includes(value as string),
        },
        {
            title: 'Stream',
            dataIndex: 'Stream',
            key: 'Stream',
            filters: users
                ? Array.from(new Set(users.map((user: User) => user.Stream)))
                    .map((stream) => ({ text: stream, value: stream })) as ColumnFilterItem[]
                : [],
            filterSearch: true,
            onFilter: (value, record) => record.Stream === (value as string),
        },
        {
            title: 'Designation',
            dataIndex: 'Designation',
            key: 'Designation',
            filters: users
                ? Array.from(new Set(users.map((user: User) => user.Designation)))
                    .map((designation) => ({ text: designation, value: designation })) as ColumnFilterItem[]
                : [],
            filterSearch: true,
            onFilter: (value, record) => record.Designation === (value as string),
        }
    ];

    if (usersLoading || pathsLoading || !users || !learningPaths) {
        return <LoadingIndicator type="page" />;
    }

    const handleSubmit = async () => {
        if (!selectedLearningPath || !selectedUsers.length) {
            message.error("Please select both users and a learning path.");
            return;
        }

        try {
            await assignLearningPathsMutation.mutateAsync({
                Users: selectedUsers,
                Learning_Path_ID: selectedLearningPath
            });

             // Reset selections
            setSelectedLearningPath(null);
            setSelectedUsers([]);
        } catch (error) {
            console.log("Error assigning learning paths:", error);
        }
    };

    return (
        <div style={{ marginLeft: "15rem" }}>
            <Typography.Title level={2} className="typography-title">Assign Learning Paths</Typography.Title>
            <Divider />
            {/* Learning Path Selection */}
            <Card title="Select Learning Path">
                <Select
                    placeholder="Choose Learning Path"
                    style={{ width: '100%' }}
                    onChange={(value) => setSelectedLearningPath(value)}
                    value={selectedLearningPath}
                    loading={pathsLoading}
                    >
                    {learningPaths?.map((path: LearningPath) => (
                        <Option key={path.Learning_Path_ID} value={path.Learning_Path_ID}>
                        {path.Path_Name}
                        </Option>
                    ))}
                </Select>
            </Card>
            {/* Users List with Filtered Table */}
            <Table
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedUsers,
                    onChange: (selectedRowKeys) => setSelectedUsers(selectedRowKeys as number[]),
                }}
                dataSource={users}
                columns={columns}
                rowKey="User_ID"
                loading={usersLoading}
                pagination={{ pageSize: 5 }}
                style={{ marginTop: 20 }}
            />

            {/* Submission Button */}
            <Button type="primary" style={{ marginTop: 20 }} loading={assignLearningPathsMutation.isPending} disabled={assignLearningPathsMutation.isPending} onClick={handleSubmit}>
                Assign Learning Paths
            </Button>
        </div>
    );
};
