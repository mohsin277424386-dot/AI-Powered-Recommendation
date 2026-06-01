import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemsAPI.getAll();
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData?.name || 'User'}!</h2>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="rating">
              Rating: {item.average_rating?.toFixed(1) || 'N/A'} ({item.total_ratings || 0})
            </div>
            <Link to={`/items/${item.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
