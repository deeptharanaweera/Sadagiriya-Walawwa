import { Col, Row } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import ItemList from '../components/ItemList';

const Home = () => {

  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('rice'); // Corrected the typo here
  const categories = [
    {
      name: 'rice',
      text: "Rice",
      imageUrl: 'https://www.madewithlau.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F2r0kdewr%2Fproduction%2F2c90f6410d47972d8555dd5ddcbcc47346957d43-1000x668.jpg&w=3840&q=75',
    },
    {
      name: 'kottu',
      text: "Kottu",
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hkCvzHElVJBIj2PW4SFQ_23ozDt01qdC2g&s',
    },
    {
      name: 'noodles',
      text: "Noodles",
      imageUrl: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/veg-noodles-vegetable-noodles-recipe.jpg',
    },
    {
      name: 'biriyani',
      text: "Biriyani",
      imageUrl: 'https://img.freepik.com/premium-photo/chicken-biryani-kerala-style-chicken-dhum-biriyani-made-using-jeera-rice-spices-arranged_667286-4606.jpg'
    },
    {
      name: 'drinks',
      text: "Drinks",
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2r3bM8hs5ZxFUPWwsvR9UQ1JJCjeOeo40LA&s',
    },

  ]
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING"
        })
        const { data } = await axios.get('/api/items/get-item');
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  return (
    <DefaultLayout>
      <div className="navbar">
  {categories.map(category => (
    <div
      key={category.name}
      className={`category ${selectedCategory === category.name ? "selected" : ""}`}
      onClick={() => setSelectedCategory(category.name)}
    >
      <h4>{category.text}</h4>
      <img src={category.imageUrl} alt={category.name} height="60" width="80" />
    </div>
  ))}
</div>

      <Row>
        {itemsData.filter((i) => i.category === selectedCategory).map((item) => (
          <Col xs={24} lg={6} md={12} sm={6} key={item._id}>
            <ItemList item={item} />
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  )
}

export default Home
