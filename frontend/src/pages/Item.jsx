import { DeleteOutlined, EditOutlined, FilterFilled } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import '../App.css';
import DefaultLayout from '../components/DefaultLayout';

const Item = () => {

  const [itemsData, setItemsData] = useState([]);
  const dispatch = useDispatch();
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get('/api/items/get-item');
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post('/api/items/delete-item', { itemId: record._id });
      message.success('Item Deleted Successfully');
      getAllItems();
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      message.error('Something Went Wrong');
      dispatch({ type: "HIDE_LOADING" });
      console.error('Error:', error.response?.data || error.message);
    }
  }

  // Define your filters
  const filters = [
    { text: 'Rice', value: 'rice' },
    { text: 'Kottu', value: 'kottu' },
    { text: 'Noodles', value: 'noodles' },
    { text: 'Drinks', value: 'drinks' },
    { text: 'Biriyani', value: 'biriyani' },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: filters,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.category === value,
      width: '30%',
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: filtered ? '#0078ff' : '#ffffff',
            fontSize: '20px',
          }}
        />
      ),
    },
    {
      title: 'Image', dataIndex: 'image',
      render: (image, record) => <img src={image} alt={record.name} height="60" width="60" />
    },
    { title: 'Price', dataIndex: 'price', render: (price) => `Rs. ${price}`, },
    {
      title: 'Person', dataIndex: 'person',
      render: (person) => {
        // Render different icons based on person
        if (person === 'one') {
          return <span style={{ fontSize: '20px' }}>👤</span>; // Icon for person one
        } else if (person === 'two') {
          return <span style={{ fontSize: '20px' }}>👥</span>; // Icon for person two
        }
        return null;
      }
    },
    {
      title: 'Actions', dataIndex: '_id', render: (
        (id, record) => <div>
          <EditOutlined
            style={{
              cursor: 'pointer',
              color: '#00ff36',
              fontSize: '25px',
              transition: 'color 0.3s',
              marginRight: '17px'
            }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
            onMouseEnter={(e) => e.target.style.color = '#20ea00'}
            onMouseLeave={(e) => e.target.style.color = '#00ff36'}
          />
          <DeleteOutlined
            onClick={() => {
              handleDelete(record);
            }}
            style={{
              cursor: 'pointer',
              color: '#ff0000',
              fontSize: '25px',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.color = '#c60303'}
            onMouseLeave={(e) => e.target.style.color = '#ff0000'}
          />
        </div>
      )
    },
  ];

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      if (editItem === null) {
        await axios.post('/api/items/add-item', value);
        message.success('Item Added Successfully');
      } else {
        await axios.put('/api/items/edit-item', { ...value, itemId: editItem._id });
        message.success('Item Updated Successfully');
      }
      getAllItems();
      dispatch({ type: "HIDE_LOADING" });
      setPopupModal(false);
      setEditItem(null);
    } catch (error) {
      message.error('Something Went Wrong');
      dispatch({ type: "HIDE_LOADING" });
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <DefaultLayout>
      <div className='header'>
        <div className='bills-list'>
          <h1>Items List</h1>
          <hr />
        </div>
        <div className='button'>
          <Button
            type="primary"
            onClick={() => setPopupModal(true)}
            className="add-item-button"
          >
            Add Item
          </Button>
        </div>
      </div>

      <Table className="custom-table" columns={columns} dataSource={itemsData} pagination={{ pageSize: 50 }} scroll={{ y: 500 }} bordered />

      {
        popupModal && (
          <Modal 
            open={popupModal}
            onCancel={() => {
              setEditItem(null);
              setPopupModal(false);
            }}
            footer={false}
            centered
            className='custom-modal'>
            <div className='form-container'>
              <div className='item-add'>
                <h1>{editItem !== null ? 'Edit Item' : 'Add New Item'}</h1>
              </div>
              <Form
                layout='vertical'
                initialValues={editItem}
                onFinish={handleSubmit}
                className='custom-form'
              >
                <Form.Item
                  name='name'
                  label='Name'
                  rules={[{ required: true, message: 'Please enter the item name' }]}
                >
                  <Input placeholder="Enter item name" />
                </Form.Item>
                <Form.Item
                  name='price'
                  label='Price Rs.'
                  rules={[
                    { required: true, message: 'Please enter the item price' },
                    { type: 'number', min: 1, message: 'Price must be a positive number', transform: (value) => Number(value) }
                  ]}
                >
                  <Input placeholder="Enter price" />
                </Form.Item>
                <Form.Item
                  name='image'
                  label='Image'
                  rules={[
                    { required: true, message: 'Please enter the image link' },
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                >
                  <Input placeholder="Enter image URL" />
                </Form.Item>
                <Form.Item
                  name='category'
                  label='Category'
                  rules={[{ required: true, message: 'Please select a category' }]}
                >
                  <Select placeholder="Select a category">
                    <Select.Option value='rice'>Rice</Select.Option>
                    <Select.Option value='kottu'>Kottu</Select.Option>
                    <Select.Option value='noodles'>Noodles</Select.Option>
                    <Select.Option value='drinks'>Drinks</Select.Option>
                    <Select.Option value='biriyani'>Biriyani</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name='person'
                  label='Person'
                  rules={[{ required: true, message: 'Please select a person' }]}
                >
                  <Select placeholder="Select a person">
                    <Select.Option value='one'>One Person</Select.Option>
                    <Select.Option value='two'>Two Person</Select.Option>
                  </Select>
                </Form.Item>
                <div className='form-actions'>
                  <Button type='primary' htmlType='submit' className='custom-button'>
                    {editItem !== null ? 'Update' : 'Save'}
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        )
      }
    </DefaultLayout>
  )
}

export default Item;
