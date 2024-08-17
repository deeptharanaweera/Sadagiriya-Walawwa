import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const ItemList = ({ item }) => {

    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...item, quantity: 1 },
        });
    }

    const { Meta } = Card;
    const [isHovered, setIsHovered] = useState(false);

    // Determine which icon to display based on item.person
    const personIcon = item.person === 'one'
        ? <UserOutlined style={{ color: '#1890ff', fontSize: '25px', backgroundColor: '#e6f7ff', padding: '5px', borderRadius: '50%' }} />
        : item.person === 'two'
        ? <UsergroupAddOutlined style={{ color: '#1890ff', fontSize: '25px', backgroundColor: '#e6f7ff', padding: '5px', borderRadius: '50%' }} />
        : null;

    return (
        <div>
            <Card
                style={{ width: 250, marginBottom: 20, background: '#EEEEEE', padding: '5px' }}
                cover={<img alt={item.name} src={item.image} style={{ height: 200 }} />}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                    <span style={{ fontSize: '25px', fontFamily: 'poppins-semibold' }}>{item.name}</span>
                    {personIcon && (
                        <div style={{ marginLeft: '8px' }}>
                            {personIcon}
                        </div>
                    )}
                </div>
                
                <Meta
                    title={<span style={{ fontSize: '20px', color: '#FF3D00' }}>{`Rs. ${item.price}`}</span>}
                    style={{ paddingBottom: 10 }}
                />
                
                <Button
                    style={{
                        background: isHovered ? '#008805' : '#00EF0A',
                        color: isHovered ? '#FFFFFF' : '#515151',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '600',
                        padding: '10px 60px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease',
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleAddToCart}
                >
                    Add to cart
                </Button>
            </Card>
        </div>
    );
}

export default ItemList;
