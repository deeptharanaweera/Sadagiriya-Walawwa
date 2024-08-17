import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (value) => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            const res = await axios.post('/api/users/login', value);

            if (res.status === 200) {
                message.success('User Login Successfully');
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate('/');
            } else {
                message.error(res.data.message || 'Login failed');
            }

        } catch (error) {
            message.error(error.response?.data?.message || 'Something Went Wrong');
        } finally {
            dispatch({ type: "HIDE_LOADING" });
        }
    };


    useEffect(() => {
        const auth = localStorage.getItem("auth");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);


    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0', // light gray background
            }}
        >
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: 480,
                width: '100%'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {/* <img src="your-logo-url.png" alt="Logo" style={{ width: '80px', marginBottom: '10px' }} /> */}
                    <h2 style={{ margin: 0 , fontSize: '35px'}}>Login</h2>
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 500, margin: '0 auto' }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" style={{ fontSize: '18px' }} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" style={{ fontSize: '18px' }} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox style={{ fontSize: '16px' }}>Remember me</Checkbox>
                            </Form.Item>
                            <a href="" style={{ fontSize: '16px' }}>Forgot password</a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit" style={{ fontSize: '22px', width: '100%' }}>
                            Log in
                        </Button>
                        <p style={{ fontSize: '18px', marginTop: '10px' }}>
                            You don't have an account? <Link to='/register'>Register now!</Link>
                        </p>
                    </Form.Item>
                </Form>

            </div>
        </div>
    );
};

export default Login;
