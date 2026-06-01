from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Sample data
items = [
    {"id": 1, "title": "Inception", "description": "A mind-bending thriller where dreams become reality", "category": "Movies", "rating": 4.8, "is_trending": True, "is_popular": True},
    {"id": 2, "title": "The Matrix", "description": "Reality is perception in this sci-fi classic", "category": "Movies", "rating": 4.9, "is_trending": False, "is_popular": True},
    {"id": 3, "title": "Dune", "description": "Epic sci-fi adventure on the desert planet Arrakis", "category": "Movies", "rating": 4.7, "is_trending": True, "is_popular": False},
    {"id": 4, "title": "The Midnight Library", "description": "A novel about regrets and second chances", "category": "Books", "rating": 4.6, "is_trending": True, "is_popular": True},
    {"id": 5, "title": "Atomic Habits", "description": "Transform your life with tiny changes", "category": "Books", "rating": 4.9, "is_trending": False, "is_popular": True},
    {"id": 6, "title": "Project Hail Mary", "description": "A lone astronaut must save humanity", "category": "Books", "rating": 4.8, "is_trending": True, "is_popular": False},
    {"id": 7, "title": "Noise Cancelling Headphones", "description": "Premium audio with active noise cancellation", "category": "Products", "rating": 4.5, "is_trending": True, "is_popular": True},
    {"id": 8, "title": "Smart Watch Pro", "description": "Track your fitness and stay connected", "category": "Products", "rating": 4.4, "is_trending": False, "is_popular": True},
    {"id": 9, "title": "Oppenheimer", "description": "Historical drama about the atomic bomb", "category": "Movies", "rating": 4.9, "is_trending": True, "is_popular": True},
    {"id": 10, "title": "The Psychology of Money", "description": "Understanding your relationship with money", "category": "Books", "rating": 4.7, "is_trending": True, "is_popular": False},
    # Add these to your items array
{"id": 11, "title": "The Batman", "description": "Dark detective thriller", "category": "Movies", "rating": 4.6, "is_trending": True},
{"id": 12, "title": "Dune: Part Two", "description": "The epic continues", "category": "Movies", "rating": 4.9, "is_trending": True},
{"id": 13, "title": "Sapiens", "description": "Brief history of humankind", "category": "Books", "rating": 4.7, "is_popular": True},
{"id": 14, "title": "Wireless Earbuds Pro", "description": "Crystal clear sound", "category": "Products", "rating": 4.5, "is_trending": True},
]

# Store user ratings (in-memory)
user_ratings = {}

# Helper function to get recommendations based on user history
def get_user_recommendations(user_id):
    # Simple recommendation logic: return items user hasn't rated highly
    rated_items = user_ratings.get(user_id, {})
    high_rated = [item_id for item_id, rating in rated_items.items() if rating >= 4]
    
    # Get similar items based on category
    if high_rated:
        high_rated_categories = []
        for item_id in high_rated:
            item = next((i for i in items if i["id"] == item_id), None)
            if item:
                high_rated_categories.append(item["category"])
        
        # Recommend items from same category
        recommended = [item for item in items if item["category"] in high_rated_categories and item["id"] not in rated_items]
        return recommended[:10]
    
    # Default: return trending items
    return [item for item in items if item["is_trending"]][:10]

@app.route('/api/items/', methods=['GET'])
def get_items():
    category = request.args.get('category')
    if category:
        filtered = [item for item in items if item["category"].lower() == category.lower()]
        return jsonify(filtered)
    return jsonify(items)

@app.route('/api/items/categories', methods=['GET'])
def get_categories():
    categories = list(set(item["category"] for item in items))
    return jsonify(categories)

@app.route('/api/recommendations/popular', methods=['GET'])
def get_popular():
    popular = [item for item in items if item["is_popular"]]
    return jsonify(popular)

@app.route('/api/recommendations/trending', methods=['GET'])
def get_trending():
    trending = [item for item in items if item["is_trending"]]
    return jsonify(trending)

@app.route('/api/recommendations/user/<user_id>', methods=['GET'])
def get_user_recommendations_route(user_id):
    recommendations = get_user_recommendations(user_id)
    return jsonify(recommendations)

@app.route('/api/recommendations/similar/<int:item_id>', methods=['GET'])
def get_similar_items(item_id):
    # Find the item
    item = next((i for i in items if i["id"] == item_id), None)
    if not item:
        return jsonify([])
    
    # Get items from same category (excluding the original)
    similar = [i for i in items if i["category"] == item["category"] and i["id"] != item_id]
    return jsonify(similar)

@app.route('/api/ratings/', methods=['POST'])
def rate_item():
    data = request.json
    user_id = data.get('user_id')
    item_id = data.get('item_id')
    rating = data.get('rating')
    
    if user_id and item_id and rating:
        if user_id not in user_ratings:
            user_ratings[user_id] = {}
        user_ratings[user_id][item_id] = rating
        
        # Update item's average rating (for demo purposes)
        all_ratings = []
        for user, ratings in user_ratings.items():
            if item_id in ratings:
                all_ratings.append(ratings[item_id])
        
        if all_ratings:
            avg_rating = sum(all_ratings) / len(all_ratings)
            # Find and update item
            for item in items:
                if item["id"] == item_id:
                    item["rating"] = round(avg_rating, 1)
                    break
        
        return jsonify({"message": "Rating submitted successfully", "success": True})
    
    return jsonify({"error": "Invalid data"}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "AI-Powered Recommendation System API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "items": "/api/items/",
            "categories": "/api/items/categories",
            "popular": "/api/recommendations/popular",
            "trending": "/api/recommendations/trending",
            "user_recommendations": "/api/recommendations/user/{user_id}",
            "similar": "/api/recommendations/similar/{item_id}",
            "ratings": "/api/ratings/"
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)