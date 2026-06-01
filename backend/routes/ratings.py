from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from firebase_admin import firestore
from .auth import auth_required

# Create ratings blueprint
ratings_bp = Blueprint('ratings', __name__)
db = firestore.client()

def update_item_rating(item_id):
    """Update average rating for an item"""
    ratings = [r.to_dict().get('rating', 0) for r in 
               db.collection('ratings').where('itemId', '==', item_id).stream()]
    if ratings:
        avg = sum(ratings) / len(ratings)
        db.collection('items').document(item_id).update({
            'average_rating': round(avg, 2),
            'total_ratings': len(ratings)
        })

@ratings_bp.route('/', methods=['POST'])
@cross_origin()
@auth_required
def add_rating():
    """Add or update a rating for an item"""
    try:
        data = request.get_json()
        user_id = request.user['uid']
        item_id = data.get('itemId')
        rating = data.get('rating')
        
        # Validate input
        if not item_id or not rating:
            return jsonify({'error': 'itemId and rating are required'}), 400
        
        if not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Check if rating exists
        existing = list(db.collection('ratings')
            .where('userId', '==', user_id)
            .where('itemId', '==', item_id)
            .limit(1).stream())
        
        if existing:
            # Update existing rating
            db.collection('ratings').document(existing[0].id).update({
                'rating': rating,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
        else:
            # Add new rating
            db.collection('ratings').add({
                'userId': user_id,
                'itemId': item_id,
                'rating': rating,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
        
        # Update item's average rating
        update_item_rating(item_id)
        
        return jsonify({'success': True, 'message': 'Rating saved successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ratings_bp.route('/item/<item_id>', methods=['GET'])
@cross_origin()
def get_item_ratings(item_id):
    """Get all ratings for a specific item"""
    try:
        ratings = []
        for doc in db.collection('ratings').where('itemId', '==', item_id).stream():
            r = doc.to_dict()
            r['id'] = doc.id
            
            # Get user name if available
            user_doc = db.collection('users').document(r['userId']).get()
            if user_doc.exists:
                r['userName'] = user_doc.to_dict().get('name', 'Anonymous')
            else:
                r['userName'] = 'Anonymous'
            
            ratings.append(r)
        
        return jsonify({'ratings': ratings, 'count': len(ratings)}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ratings_bp.route('/user/<item_id>', methods=['GET'])
@cross_origin()
@auth_required
def get_user_rating(item_id):
    """Get current user's rating for an item"""
    try:
        user_id = request.user['uid']
        docs = list(db.collection('ratings')
            .where('userId', '==', user_id)
            .where('itemId', '==', item_id)
            .limit(1).stream())
        
        rating = docs[0].to_dict().get('rating') if docs else None
        return jsonify({'rating': rating}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ratings_bp.route('/user', methods=['GET'])
@cross_origin()
@auth_required
def get_user_ratings():
    """Get all ratings by current user"""
    try:
        user_id = request.user['uid']
        ratings = []
        
        for doc in db.collection('ratings').where('userId', '==', user_id).stream():
            r = doc.to_dict()
            r['id'] = doc.id
            
            # Get item details
            item_doc = db.collection('items').document(r['itemId']).get()
            if item_doc.exists:
                r['itemName'] = item_doc.to_dict().get('name', 'Unknown')
            
            ratings.append(r)
        
        return jsonify({'ratings': ratings, 'count': len(ratings)}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500