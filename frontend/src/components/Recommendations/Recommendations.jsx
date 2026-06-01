import React, { useState, useEffect } from 'react';
import { recommendationsAPI } from '../../services/api';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await recommendationsAPI.getUserRecommendations();
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div className="recommendations-container">
      <h2>Recommended for You</h2>
      <div className="recommendations-grid">
        {recommendations.map((item) => (
          <div key={item.id} className="recommendation-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="predicted-rating">
              Predicted: {item.predictedRating} / 5
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;