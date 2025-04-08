import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import "./styles.css";
import { useGetLogin } from "../api/login";

export const LoginWidget: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form] = Form.useForm(); 

  const { mutate: loginUser, isPending } = useGetLogin();
  
  const handleSubmit = async () => {
    const values = await form.validateFields();
    loginUser({
      Email: values.email,
      Password: values.password,
    });
  };

  return (
    <div className="login-container">
      <Form
        form={form}
        name="login-form"
        layout="vertical"
        onFinish={handleSubmit}
        className="login-widget"
      >
        <h2 className="login-title">Login</h2>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" }
          ]}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block  loading={isPending}>
            Login
          </Button>
        </Form.Item>
        {/* <Form.Item>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    disabled={isPending} // Disable button when loading
                >
                    Submit
                </Button>
                {isPending && <LoadingIndicator type="inline" />} }
            </div>
        </Form.Item> */}

      </Form>
    </div>
  );
};
