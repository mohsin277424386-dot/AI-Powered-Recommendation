import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI, ratingsAPI } from '../../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const itemRes = await itemsAPI.getById(id);
      setItem(itemRes.data);
      
      const ratingsRes = await ratingsAPI.getItemRatings(id);
      setRatings(ratingsRes.data.ratings);
      
      const userRatingRes = await ratingsAPI.getUserRating(id);
      if (userRatingRes.data.rating) {
        setUserRating(userRatingRes.data.rating);
        setNewRating(userRatingRes.data.rating);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  };

  const handleRating = async () => {
    try {
      await ratingsAPI.addRating(id, newRating);
      setUserRating(newRating);
      fetchData();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="item-details">
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <div>
        Average Rating: {item.average_rating?.toFixed(1) || 'N/A'} 
        ({item.total_ratings || 0} ratings)
      </div>
      
      <div className="rating-section">
        <h3>Rate this item</h3>
        <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
          <option value={0}>Select rating</option>
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num} stars</option>
          ))}
        </select>
        <button onClick={handleRating}>Submit Rating</button>
      </div>

      <div className="ratings-list">
        <h3>User Reviews</h3>
        {ratings.map((r, index) => (
          <div key={r.id || index} className="rating-item">
            <strong>{r.userName || 'Anonymous'}</strong>: {r.rating}/5
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDetails;