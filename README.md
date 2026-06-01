AI-Powered Recommendation System

An intelligent recommendation system that provides personalized suggestions for movies, books and products using multiple AI algorithms.

Features

Core Features
- Multiple Recommendation Algorithms - Collaborative, Content-Based and Hybrid AI
- Personalized Suggestions - Tailored recommendations based on user ratings
- Real-time Ratings - Rate items with 1 to 5 stars
- Wishlist - Save favorite items for later
- Recently Viewed - Track your browsing history

AI Assistant
- Interactive chat bot for recommendations
- Natural language processing
- Genre-based suggestions
- Trending items alerts

UI/UX
- Dark and Light mode toggle
- Fully responsive design
- Smooth animations
- Toast notifications
- Loading skeletons

Analytics
- Recommendation accuracy tracking
- Category popularity metrics
- User rating patterns
- Daily activity charts

User Features
- Authentication with Login and Signup
- User profiles
- Personalized dashboard
- Email digests

Tech Stack

Frontend
- React 18
- CSS3 with animations
- LocalStorage for persistent data

Backend
- Flask Python web framework
- Flask-CORS for cross-origin support
- REST API with JSON endpoints

Project Structure

AI-Powered-Recommendation/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── __pycache__/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── node_modules/
├── .gitignore
└── README.md

Installation

Prerequisites
- Node.js version 14 or higher
- Python version 3.8 or higher
- npm or yarn
- pip

Backend Setup

1. Go to backend directory:
cd backend

2. Create virtual environment:
python -m venv venv

3. Activate virtual environment:
Windows: venv\Scripts\activate
Mac or Linux: source venv/bin/activate

4. Install dependencies:
pip install -r requirements.txt

5. Run backend server:
python app.py

Backend runs at: http://localhost:5000

Frontend Setup

1. Go to frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Run frontend server:
npm start

Frontend runs at: http://localhost:3000

Usage

Browse Recommendations
- View trending and popular items on the sidebar
- Click on categories to filter Movies, Books or Products
- Search for specific items using the search bar

Rate Items
- Click on star ratings from 1 to 5 for any item
- Your ratings help improve recommendations
- View your rated items in profile

Use AI Assistant
- Click the chat button with message icon
- Ask questions for recommendations
- Get instant personalized suggestions

Save to Wishlist
- Click Save on any item
- View saved items in Wishlist section
- Remove items from wishlist anytime

Advanced Filters
- Click Filters button
- Filter by minimum rating
- Filter by year
- Sort by relevance, rating or popularity

Dark Mode
- Click the sun or moon button in header
- Theme preference is saved automatically

Write Reviews
- Click Review on any item
- Write your thoughts and rate
- See latest reviews on items

API Endpoints

GET / - API information
GET /api/items/ - Get all items
GET /api/items/categories - Get categories
GET /api/recommendations/popular - Get popular items
GET /api/recommendations/trending - Get trending items
GET /api/recommendations/user/user_id - Personalized recommendations
GET /api/recommendations/similar/item_id - Similar items
POST /api/ratings/ - Submit rating
GET /api/wishlist/user_id - Get user wishlist
POST /api/wishlist - Add to wishlist
GET /health - Health check

Example API Calls

Get all items:
curl http://localhost:5000/api/items/

Get recommendations for user:
curl http://localhost:5000/api/recommendations/user/user123

Rate an item:
curl -X POST http://localhost:5000/api/ratings/ -H "Content-Type: application/json" -d "{\"user_id\":\"user123\",\"item_id\":1,\"rating\":5}"

Building for Production

Build Frontend:
cd frontend
npm run build

Deploy Backend:
cd backend
pip install gunicorn
gunicorn app:app

Troubleshooting

Backend won't start
- Port 5000 might be in use
- Change port in app.py to app.run(port=5001)
- Update frontend API_BASE_URL accordingly

Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API_BASE_URL in App.js

Ratings not saving
- Check if user is logged in
- Verify localStorage permissions
- Clear browser cache

Dark mode not working
- Check localStorage permissions
- Refresh the page
- Clear site data

Quick Start Commands

Backend setup:
cd backend
pip install -r requirements.txt
python app.py

Frontend setup in new terminal:
cd frontend
npm install
npm start

Open browser:
Frontend: http://localhost:3000
Backend API: http://localhost:5000

License

This project is for educational purposes.

Made with React and Flask
