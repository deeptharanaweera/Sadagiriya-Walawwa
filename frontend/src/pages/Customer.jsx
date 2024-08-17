import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';

const Customer = () => {
    const [billsData, setBillsData] = useState([]);
    const dispatch = useDispatch();


    const getAllBills = async () => {
        try {
            dispatch({
                type: "SHOW_LOADING"
            })
            const { data } = await axios.get('/api/bills/get-bills');
            setBillsData(data);
            dispatch({ type: "HIDE_LOADING" });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBills();
    }, []);

    const columns = [
        { title: 'ID', dataIndex: '_id' },
        { title: 'Customer Name', dataIndex: 'customerName' },
        { title: 'Contact No', dataIndex: 'customerNumber' },
    ]

    return (
        <DefaultLayout>
            <div className='bills-list'>
                <h1>Customer Details</h1>
                <hr />
            </div>
            <Table className="custom-table" columns={columns} dataSource={billsData} pagination={{ pageSize: 50 }} scroll={{ y: 500 }} bordered />
        </DefaultLayout>
    )
}

export default Customer