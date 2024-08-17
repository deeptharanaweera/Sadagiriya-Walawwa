import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Modal, Row, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Barcode from 'react-barcode'; // Import the Barcode component
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import '../App.css';
import DefaultLayout from '../components/DefaultLayout';
import logo from '../images/logo.png';

const Bills = () => {
    const [billsData, setBillsData] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const componentRef = useRef();
    const dispatch = useDispatch();
    const [popupModal, setPopupModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const getAllBills = async () => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            const { data } = await axios.get('/api/bills/get-bills');
            // Sort the billsData by date in descending order
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBillsData(sortedData);
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllBills();
    }, []);

    useEffect(() => {
        const filteredData = billsData.filter((bill) => {
            const matchesName = bill.customerName.toLowerCase().includes(searchName.toLowerCase());
            const matchesDate = !searchDate || moment(bill.date).isSame(searchDate, 'day');
            return matchesName && matchesDate;
        });
        // Sort the filteredData by date in descending order
        const sortedFilteredData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredBills(sortedFilteredData);
    }, [searchName, searchDate, billsData]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const columns = [
        { title: 'Customer Name', dataIndex: 'customerName' },
        { title: 'Contact No', dataIndex: 'customerNumber' },
        { title: 'Date', dataIndex: 'date' },
        {
            title: 'Subtotal',
            dataIndex: 'subTotal',
            render: (text) => `Rs. ${text}`,
        },
        { title: 'Discount', dataIndex: 'discount' },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            render: (text) => <span style={{ color: 'red' }}>Rs. {text}</span>,
        },
        {
            title: 'Actions', dataIndex: '_id', render: (
                (id, record) => <div>
                    <EyeOutlined
                        style={{
                            cursor: 'pointer',
                            color: '#1890ff',
                            fontSize: '20px',
                            transition: 'color 0.3s',
                        }}
                        onClick={() => {
                            setSelectedBill(record);
                            setPopupModal(true);
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#40a9ff'}
                        onMouseLeave={(e) => e.target.style.color = '#1890ff'}
                    />
                </div>
            )
        },
    ];

    return (
        <DefaultLayout>
            <div className='bills-list'>
                <h1>Bills List</h1>
                <hr />

                <div className='search-filters'>
                    <Row gutter={65}>
                        <Col span={12} className='custom-col'>
                            <Input
                                placeholder="Search by Customer Name"
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePicker className='date-picker'
                                onChange={(date, dateString) => setSearchDate(dateString)}
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            <Table
                className="custom-table"
                columns={columns}
                dataSource={filteredBills.length ? filteredBills : billsData}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 500 }}
                bordered
            />

            {
                popupModal && (
                    <Modal title="Invoice Details"
                        open={popupModal}
                        onCancel={() => {
                            setPopupModal(false);
                        }}
                        footer={false}
                        style={{ textAlign: 'center', color: '#0F054B', marginBottom: 0 }}
                        centered
                    >
                        <div id='invoice-POS' ref={componentRef}>
                            <center id='top'>
                                <div className='logo'>
                                    <img src={logo} alt="" />
                                </div>
                                <div className='info'>
                                    <h2>සඳගිරිය වලව්ව</h2>
                                    <p>Contact : 0768302810 | Balangoda</p>
                                </div>
                            </center>
                            <div id='mid'>
                                <div className='mt-2'>
                                    <p>
                                        Customer Name : <b>{selectedBill.customerName}</b>
                                        <br />
                                        Phone No : <b>{selectedBill.customerNumber}</b>
                                        <br />
                                        Date : <b>{selectedBill.date}</b>
                                        <br />
                                    </p>
                                </div>
                            </div>
                            <div id='bot'>
                                <div id='table'>
                                    <table>
                                        <tbody>
                                            <tr className='tabletitle'>
                                                <td className='item'>
                                                    <h2>Item</h2>
                                                </td>
                                                <td className='item'>
                                                    <h2>Qty</h2>
                                                </td>
                                                <td className='item'>
                                                    <h2>Price</h2>
                                                </td>
                                                <td className='item'>
                                                    <h2>Total</h2>
                                                </td>
                                            </tr>
                                            {selectedBill.cartItems.map((item) => (
                                                <tr className='service' key={item.id}>
                                                    <td className='tableitem'>
                                                        <p className='itemtext'>{item.name}</p>
                                                    </td>
                                                    <td className='tableitem'>
                                                        <p className='itemtext'>{item.quantity}</p>
                                                    </td>
                                                    <td className='tableitem'>
                                                        <p className='itemtext'>{item.price}</p>
                                                    </td>
                                                    <td className='tableitem'>
                                                        <p className='itemtext'>{item.quantity * item.price}</p>
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className='tabletitle'>
                                                <td />
                                                <td />
                                                <td className='Discount'>
                                                    <h2>Discount  : </h2>
                                                </td>
                                                <td className='discount'>
                                                    <h2>Rs.{selectedBill.discount}</h2>
                                                </td>
                                            </tr>
                                            <tr className='tabletitle'>
                                                <td />
                                                <td />
                                                <td className='Discount'>
                                                    <h2>Grand Total :</h2>
                                                </td>
                                                <td className='payment'>
                                                    <h2><b>Rs.{selectedBill.totalAmount}</b></h2>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Barcode Generation */}
                                <div style={{ marginTop: '20px' }}>
                                <Barcode 
                                    value={selectedBill._id} 
                                    width={0.7} // Adjust the width of the barcode lines
                                    height={50} // Adjust the height of the barcode
                                    displayValue={true} // Display the text below the barcode
                                    fontSize={14} // Adjust the font size of the text
                                />
                                </div>

                                <div id='legalcopy' className='d-flex'>
                                    <p className='legal'>
                                        <strong>Thank you for your order!</strong>
                                        <b>deeptharanaweera26@gmail.com</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <Button style={{
                                background: '#0F054B',
                                color: '#FFFFFF',
                                width: '100px',
                                fontSize: '18px',
                                borderRadius: '5px',
                                marginTop: '10px',
                            }} onClick={handlePrint}>Print</Button>
                        </div>
                    </Modal>
                )
            }
        </DefaultLayout>
    );
};

export default Bills;
