import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';


const Cart = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [bilPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.rootReducer);
  const navigate = useNavigate();

  // Date Show

  const showDate = new Date();
  const displayDate = showDate.toLocaleDateString(); // "8/15/2024" (US format)
  const displayTime = showDate.toLocaleTimeString(); // "10:34:11 PM"

  const formattedDateTime = `${displayDate} ${displayTime}`;
  // const dt = showDate.toDateString();

  const handleIncrement = (record) => {
    dispatch({
      type: 'UPDATE_CART',
      payload: { ...record, quantity: record.quantity + 1 }
    })
  }

  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: 'UPDATE_CART',
        payload: { ...record, quantity: record.quantity - 1 }
      });
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Image', dataIndex: 'image',
      render: (image, record) => <img src={image} alt={record.name} height="60" width="60" />
    },
    { title: 'Price', dataIndex: 'price', render: (price) => `Rs. ${price}`, },
    {
      title: 'Quantity', dataIndex: '_id',
      render: (id, record) => <div>
        <PlusCircleOutlined
          className='mx-3'
          style={{
            cursor: 'pointer',
            color: '#0013ff', // Change icon color
            fontSize: '20px', // Change icon size
            transition: 'color 0.3s', // Smooth color transition
          }}
          onMouseEnter={(e) => e.target.style.color = '#0013ff'} // Change color on hover
          onMouseLeave={(e) => e.target.style.color = '#0013ff'} // Revert color on mouse leave
          onClick={() => handleIncrement(record)}
        />
        <b>{record.quantity}</b>
        <MinusCircleOutlined
          className='mx-3'
          style={{
            cursor: 'pointer',
            color: '#0013ff', // Change icon color
            fontSize: '20px', // Change icon size
            transition: 'color 0.3s', // Smooth color transition
          }}
          onMouseEnter={(e) => e.target.style.color = '#0013ff'} // Change color on hover
          onMouseLeave={(e) => e.target.style.color = '#0013ff'} // Revert color on mouse leave
          onClick={() => handleDecrement(record)}
        />
      </div>
    },
    {
      title: 'Actions', dataIndex: '_id', render: (
        (id, record) => <DeleteOutlined style={{
          cursor: 'pointer',
          color: '#ff0000', // Change icon color
          fontSize: '25px', // Change icon size
          transition: 'color 0.3s', // Smooth color transition
        }}
          onMouseEnter={(e) => e.target.style.color = '#c60303'} // Change color on hover
          onMouseLeave={(e) => e.target.style.color = '#ff0000'} // Revert color on mouse leave
          onClick={() =>
            dispatch({
              type: 'DELETE_FROM_CART',
              payload: record,
            })
          }

        />
      ),
    },
  ]

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  const handleSubmit = async (value) => {
    try {
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        discount: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(Number(subTotal) - Number(((subTotal / 100) * 10).toFixed(2))),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      // console.log(newObject);
      await axios.post('api/bills/add-bills', newObject);
      message.success("Bill Generated");
      dispatch({ type: 'CLEAR_CART' });
      navigate('/bills');
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  }




  return (
    <DefaultLayout>
      <div className='bills-list'>
        <h1>Cart List</h1>
      </div>
      <Table className="custom-table" columns={columns} dataSource={cartItems} pagination={{ pageSize: 50 }} scroll={{ y: 420 }} bordered />
      <div className="invoice">
        <h3>Sub Total: Rs. <b>{subTotal}</b> /-</h3>
        <Button
          type="primary"
          className="create-invoice"
          onClick={() => setBillPopup(true)}
        >
          Create Invoice
        </Button>
      </div>

      <Modal
  title='Create Invoice'
  open={bilPopup}
  onCancel={() => setBillPopup(false)}
  footer={false}
>
  <Form
    layout='vertical'
    onFinish={handleSubmit}
    initialValues={{
      date: formattedDateTime, // Set the initial value for the date field
    }}
    className='custom-form'
  >
    <Form.Item
      name='customerName'
      label='Customer Name'
      rules={[{ required: true, message: 'Please enter the Customer Name' }]}
    >
      <Input placeholder="Enter Customer Name" />
    </Form.Item>
    <Form.Item
      name='customerNumber'
      label='Customer Contact Number'
      rules={[
        { required: false, message: 'Please enter the Customer Contact Number' },
        { type: 'number', min: 1, message: 'Contact number must be a positive number', transform: (value) => Number(value) }
      ]}
    >
      <Input placeholder="Enter Customer Contact No" />
    </Form.Item>
    <Form.Item
      name='date'
      label='Date & Time'
    >
      <Input type="text" readOnly />
    </Form.Item>
    <Form.Item
      name='paymentMode'
      label='Payment Method'
      rules={[{ required: true, message: 'Please select a payment method' }]}
    >
      <Select placeholder="Select a payment method">
        <Select.Option value='cash'>Cash</Select.Option>
        <Select.Option value='card'>Card</Select.Option>
      </Select>
    </Form.Item>
    <div className='bill-it'>
      <h5>Sub Total : <b>{subTotal}</b></h5>
      <h4>Discount : <b>{((subTotal / 100) * 10).toFixed(2)}</b></h4>
      <h3>Grand Total : <b>{Number(subTotal) - (Number(((subTotal / 100) * 10).toFixed(2)))}</b></h3>
    </div>
    <div className='form-actions'>
      <Button type='primary' htmlType='submit' className='custom-button'>
        Generate Bill
      </Button>
    </div>
  </Form>
</Modal>

    </DefaultLayout>
  )
}

export default Cart