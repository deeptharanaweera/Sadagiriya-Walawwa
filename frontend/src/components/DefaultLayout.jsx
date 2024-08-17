import {
    AppstoreAddOutlined,
    FileTextOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShoppingCartOutlined,
    UsergroupDeleteOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../images/logo2.png';
import Spinner from './Spinner';

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
    const navigate = useNavigate();
    const { cartItems, loading } = useSelector((state) => state.rootReducer);
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();

    const toggle = () => {
        setCollapsed(
            !collapsed
        );
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Layout style={{ padding: 10, height: '100vh', width: '100%', background: '#ddd8d8' }}>
            {loading && <Spinner />}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={350}
                style={{ background: '#0F054B', borderBottomRightRadius: '20px', borderTopRightRadius: '20px' }}
            >
                {/* Icon at the top of the menu */}
                <div style={{ padding: '26px', textAlign: 'center' }}>
                    <img
                        src={logo2}
                        alt="Logo"
                        style={{ width: !collapsed ? '150px' : '50px', height: !collapsed ? '150px' : '50px' }}
                    />

                    {/* <h1 style={{ maxWidth: '100%', height: '40px', color: '#0017ff',fontSize: '65px', marginRight:80 }}>{!collapsed && 'සඳගිරිය'}</h1>
                    <h2 style={{ maxWidth: '100%', height: '20px', color: '#FFFFFF', fontSize: '40px', marginLeft:100, paddingTop:5 }}>{!collapsed && 'වලව්ව'}</h2> */}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[window.location.pathname]}
                    style={{
                        background: '#0F054B',
                        color: '#ffffff',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyItems: 'center',
                        alignItems: 'center',
                        height: '65vh',
                        gap: 5,
                    }}
                >
                    <Menu.Item key="/" icon={<HomeOutlined style={{ fontSize: '30px' }} />} style={{ height: '70px' }}>
                        <Link to="/" style={{ fontSize: '30px', fontFamily: 'poppins-medium' }}>Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/bills" icon={<FileTextOutlined style={{ fontSize: '30px' }} />} style={{ height: '70px' }}>
                        <Link to="/bills" style={{ fontSize: '30px', fontFamily: 'poppins-medium' }}>Bills</Link>
                    </Menu.Item>
                    <Menu.Item key="/items" icon={<AppstoreAddOutlined style={{ fontSize: '30px' }} />} style={{ height: '70px' }}>
                        <Link to="/items" style={{ fontSize: '30px', fontFamily: 'poppins-medium' }}>Items List</Link>
                    </Menu.Item>
                    <Menu.Item key="/customers" icon={<UsergroupDeleteOutlined style={{ fontSize: '30px' }} />} style={{ height: '70px' }}>
                        <Link to="/customers" style={{ fontSize: '30px', fontFamily: 'poppins-medium' }}>Customers</Link>
                    </Menu.Item>
                </Menu>

                {/* Logout Button */}
                <div style={{ padding: '0px', textAlign: 'center' }}>
                    <Button
                        type="primary"
                        icon={<LogoutOutlined style={{ fontSize: '30px' }} />}  // Custom icon size
                        style={{
                            width: '100%',
                            height: '50px',
                            background: '#f5222d',
                            borderColor: '#f5222d',
                            fontSize: '20px',  // Custom text size
                            fontWeight: 'bold', // Custom text style
                            fontFamily: 'poppins-medium',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => {
                            localStorage.removeItem("auth");
                            navigate('/login')
                        }}
                    >
                        {!collapsed && 'Logout'}
                    </Button>
                </div>
            </Sider>
            <Layout style={{ background: '#ddd8d8' }}>
                <Header style={{ padding: 0, background: '#FFFFFF', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '30px' }} /> : <MenuFoldOutlined style={{ fontSize: '30px' }} />}
                        onClick={toggle}
                        style={{
                            fontSize: '30px',
                            width: 64,
                            height: 64,
                            color: '#000000',
                        }}
                    />
                    <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => navigate('/cart')}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            marginRight: -30,
                            marginTop: 6,
                            borderRadius: '50%',
                            background: '#FF0000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF', // Change text color to white
                            fontWeight: 'bold',
                            fontSize: '12px', // Adjust font size to fit inside the circle
                            fontWeight: 'bold',
                        }}>
                            {cartItems.length}
                        </div>

                        <ShoppingCartOutlined style={{
                            fontSize: '30px',
                            width: 64,
                            height: 64,
                            color: '#000000',
                        }} />
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'auto',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
