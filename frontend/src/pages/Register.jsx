import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (value) => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            await axios.post('/api/users/register', value);
            message.success('Register Successfully');
            navigate('/login')
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            message.error('Something Went Wrong');
            dispatch({ type: "HIDE_LOADING" });
            console.error('Error:', error.response?.data || error.message);
        }
    }

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
                maxWidth: 380,
                width: '100%'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {/* <img src="your-logo-url.png" alt="Logo" style={{ width: '80px', marginBottom: '10px' }} /> */}
                    <h2 style={{ margin: 0, fontSize: '35px' }}>Register</h2>
                </div>
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 500, margin: '0 auto' }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Name" style={{ fontSize: '18px' }}/>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" style={{ fontSize: '18px' }}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" style={{ fontSize: '18px' }}/>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit" style={{ fontSize: '22px', width: '100%' }}>
                            Register
                        </Button>
                        <p style={{ fontSize: '18px', marginTop: '10px' }}>Already Register Pleace <Link to='/login'>Login now!</Link></p>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register