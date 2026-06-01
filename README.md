# 🤖 AI-Powered Recommendation System

An intelligent recommendation system that provides personalized suggestions for movies, books, and products using multiple AI algorithms.

## Features

### Core Features
- Multiple Recommendation Algorithms - Collaborative, Content-Based, and Hybrid AI
- Personalized Suggestions - Tailored recommendations based on user ratings
- Real-time Ratings - Rate items with 1-5 stars
- Wishlist - Save favorite items for later
- Recently Viewed - Track your browsing history

### AI Assistant
- Interactive chat bot for recommendations
- Natural language processing
- Genre-based suggestions
- Trending items alerts

### UI/UX
- Dark/Light mode toggle
- Fully responsive design
- Smooth animations
- Toast notifications
- Loading skeletons

### Analytics
- Recommendation accuracy tracking
- Category popularity metrics
- User rating patterns
- Daily activity charts

### User Features
- Authentication (Login/Signup)
- User profiles
- Personalized dashboard
- Email digests

## Tech Stack

### Frontend
- React 18 - UI Framework
- CSS3 - Styling with animations
- LocalStorage - Persistent data

### Backend
- Flask - Python web framework
- Flask-CORS - Cross-origin support
- REST API - JSON endpoints

## Project Structure
Perfect! Here are the cleaned versions of both files without any comments or extra formatting:

## **`.gitignore`** (Root directory):

```
node_modules/
/.pnp
.pnp.js
.yarn/install-state.gz
/coverage/
/build
/dist
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
.env
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.vscode/
.idea/
*.swp
*.swo
*~
.project
.classpath
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/
.python-version
instance/
.webassets-cache
*.db
*.sqlite
*.sqlite3
logs/
*.log
server.log
.env.local
backend/__pycache__/
backend/venv/
backend/env/
backend/.venv
frontend/node_modules/
frontend/build/
frontend/.env.local
Thumbs.db
ehthumbs.db
Desktop.ini
*.tgz
*.gz
*.pem
*.key
*.crt
```

## **`README.md`** (Root directory):

```markdown
# 🤖 AI-Powered Recommendation System

An intelligent recommendation system that provides personalized suggestions for movies, books, and products using multiple AI algorithms.

## Features

### Core Features
- Multiple Recommendation Algorithms - Collaborative, Content-Based, and Hybrid AI
- Personalized Suggestions - Tailored recommendations based on user ratings
- Real-time Ratings - Rate items with 1-5 stars
- Wishlist - Save favorite items for later
- Recently Viewed - Track your browsing history

### AI Assistant
- Interactive chat bot for recommendations
- Natural language processing
- Genre-based suggestions
- Trending items alerts

### UI/UX
- Dark/Light mode toggle
- Fully responsive design
- Smooth animations
- Toast notifications
- Loading skeletons

### Analytics
- Recommendation accuracy tracking
- Category popularity metrics
- User rating patterns
- Daily activity charts

### User Features
- Authentication (Login/Signup)
- User profiles
- Personalized dashboard
- Email digests

## Tech Stack

### Frontend
- React 18 - UI Framework
- CSS3 - Styling with animations
- LocalStorage - Persistent data

### Backend
- Flask - Python web framework
- Flask-CORS - Cross-origin support
- REST API - JSON endpoints

## Project Structure

```
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
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
Windows: venv\Scripts\activate
Mac/Linux: source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
python app.py
```

Backend runs at: http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend server:
```bash
npm start
```

Frontend runs at: http://localhost:3000

## Usage

### Browse Recommendations
- View trending and popular items on the sidebar
- Click on categories to filter (Movies, Books, Products)
- Search for specific items using the search bar

### Rate Items
- Click on star ratings (1-5) for any item
- Your ratings help improve recommendations
- View your rated items in profile

### Use AI Assistant
- Click the 💬 chat button
- Ask questions for recommendations
- Get instant personalized suggestions

### Save to Wishlist
- Click Save on any item
- View saved items in Wishlist section
- Remove items from wishlist anytime

### Advanced Filters
- Click Filters button
- Filter by minimum rating
- Filter by year
- Sort by relevance, rating, or popularity

### Dark Mode
- Click the theme toggle button in header
- Theme preference is saved automatically

### Write Reviews
- Click Review on any item
- Write your thoughts and rate
- See latest reviews on items

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| / | GET | API information |
| /api/items/ | GET | Get all items |
| /api/items/categories | GET | Get categories |
| /api/recommendations/popular | GET | Get popular items |
| /api/recommendations/trending | GET | Get trending items |
| /api/recommendations/user/<user_id> | GET | Personalized recommendations |
| /api/recommendations/similar/<item_id> | GET | Similar items |
| /api/ratings/ | POST | Submit rating |
| /api/wishlist/<user_id> | GET | Get user wishlist |
| /api/wishlist | POST | Add to wishlist |
| /health | GET | Health check |

## Example API Calls

Get all items:
```bash
curl http://localhost:5000/api/items/
```

Get recommendations for user:
```bash
curl http://localhost:5000/api/recommendations/user/user123
```

Rate an item:
```bash
curl -X POST http://localhost:5000/api/ratings/ \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user123","item_id":1,"rating":5}'
```

## Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Backend
```bash
cd backend
pip install gunicorn
gunicorn app:app
```

## Troubleshooting

### Backend won't start
- Port 5000 might be in use
- Change port in app.py: app.run(port=5001)
- Update frontend API_BASE_URL accordingly

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API_BASE_URL in App.js

### Ratings not saving
- Check if user is logged in
- Verify localStorage permissions
- Clear browser cache

### Dark mode not working
- Check localStorage permissions
- Refresh the page
- Clear site data

## Quick Start Commands

```bash
Backend setup:
cd backend
pip install -r requirements.txt
python app.py

Frontend setup (new terminal):
cd frontend
npm install
npm start

Open browser:
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

## License

This project is for educational purposes.

---

Made with React and Flask
```


