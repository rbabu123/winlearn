import { Form, Input, Button, Typography, InputNumber, Space, message, Select, Spin } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/userContext";
import "./styles.css";
import { useAddLearningPath, useFetchStreams } from "../../api/admin";
import { useNavigate } from "react-router-dom";
import { LearningPath } from "../types";

const { Title } = Typography;

export const AddLearningPaths = () => {
    const [form] = Form.useForm();
    const { userID } = useAuth();
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate("/admin/dashboard/learning-paths");
    };
   
    const { mutate: addLearningPath, isPending } = useAddLearningPath(); // Using isPending for loading state
    // Fetch streams for dropdown
    const { data: streams, isLoading: isStreamsLoading } = useFetchStreams();
    const onFinish = (values: LearningPath) => {
        if (!values.Courses || values.Courses.length === 0) {
            message.error("Please add at least one course to the learning path!");
            return;
        }

        const payload = {
            Creator_Admin_ID: userID,
            Path_Name: values.Path_Name,
            Path_Description: values.Path_Description,
            Path_Category: values.Path_Category,
            Due_Days: values.Due_Days,
            Courses: values.Courses,
        };

        addLearningPath(payload);
        form.resetFields();
    };
    return (
        <div className="add-learning-path-container">
            <Spin spinning={isPending} tip="Saving Learning Path...">
                <div className="add-learning-path-widget">
                    <Title className="add-learning-path-title" level={4}>Add Learning Path</Title>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="add-learning-path-form"
                    >
                        <Form.Item
                            label="Learning Path Name"
                            name="Path_Name"
                            rules={[{ required: true, message: "Please enter the learning path name!" }]}
                        >
                            <Input placeholder="Learning path name" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="Path_Description"
                            rules={[{ required: true, message: "Please enter the description!" }]}
                        >
                            <Input.TextArea placeholder="Learning path description"/>
                        </Form.Item>

                        <Form.Item
                            label="Category"
                            name="Path_Category"
                            rules={[{ required: true, message: "Please select a category!" }]}
                        >
                            <Select
                                placeholder="Select a category"
                                loading={isStreamsLoading}
                                allowClear
                            >
                                {Array.isArray(streams) &&
                                streams.map((stream: string, index: number) => (
                                    <Select.Option key={index} value={stream}>
                                        {stream}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Due Days"
                            name="Due_Days"
                            rules={[{ required: true, message: "Please enter the due days!" }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Due days" />
                        </Form.Item>

                        <Form.List name="Courses">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{ display: 'flex', marginBottom: 8 }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'Course_Name']}
                                                label="Course Name"
                                                rules={[{ required: true, message: 'Missing course name' }]}
                                            >
                                                <Input placeholder="Course Name" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'Course_URL']}
                                                label="Course URL"
                                                rules={[{ required: true, message: 'Missing course URL' }]}
                                            >
                                                <Input placeholder="Course URL" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add Course
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={handleCancel} disabled={isPending}>
                                    Cancel
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={isPending}
                                    loading={isPending}
                                >
                                    Add Learning Path
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </div>
    );
};
