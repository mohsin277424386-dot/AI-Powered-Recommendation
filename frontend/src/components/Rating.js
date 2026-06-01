import React, { useState } from 'react';

function Rating({ itemId, userId, onRatingSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const submitRating = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ratings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: itemId,
          rating: rating
        })
      });
      
      if (response.ok) {
        onRatingSubmit();
        alert('Rating submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hover || rating) ? 'active' : ''}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(rating)}
        >
          ★
        </button>
      ))}
      {rating > 0 && (
        <button onClick={submitRating} className="submit-rating">
          Submit Rating
        </button>
      )}
    </div>
  );
}

export default Rating;