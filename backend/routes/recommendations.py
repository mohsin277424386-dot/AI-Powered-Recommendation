from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from firebase_admin import firestore
from .auth import auth_required

# Create blueprint with correct name
recommendations_bp = Blueprint('recommendations', __name__)
db = firestore.client()

@recommendations_bp.route('/user/<user_id>', methods=['GET'])
@cross_origin()
@auth_required
def get_recommendations(user_id):
    """Get personalized recommendations for a user"""
    try:
        # TODO: Implement collaborative filtering
        # For now, return popular items
        
        # Get user's ratings
        user_ratings = list(db.collection('ratings')
            .where('userId', '==', user_id)
            .stream())
        
        # Get items the user hasn't rated
        rated_item_ids = [r.to_dict().get('itemId') for r in user_ratings]
        
        # Get popular items (high average rating)
        items_ref = db.collection('items')
        items = []
        
        for doc in items_ref.stream():
            item = doc.to_dict()
            item['id'] = doc.id
            
            # Skip items user already rated
            if item['id'] not in rated_item_ids:
                items.append(item)
        
        # Sort by average rating
        items.sort(key=lambda x: x.get('average_rating', 0), reverse=True)
        
        return jsonify({
            'user_id': user_id,
            'recommendations': items[:10],  # Top 10 recommendations
            'count': len(items[:10])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/popular', methods=['GET'])
@cross_origin()
def get_popular_items():
    """Get popular items for non-authenticated users"""
    try:
        limit = int(request.args.get('limit', 10))
        
        # Get items sorted by average rating
        items = []
        for doc in db.collection('items').stream():
            item = doc.to_dict()
            item['id'] = doc.id
            items.append(item)
        
        # Sort by average rating
        items.sort(key=lambda x: x.get('average_rating', 0), reverse=True)
        
        return jsonify({
            'recommendations': items[:limit],
            'count': len(items[:limit])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/similar/<item_id>', methods=['GET'])
@cross_origin()
def get_similar_items(item_id):
    """Get items similar to a given item"""
    try:
        # Get the target item
        item_doc = db.collection('items').document(item_id).get()
        if not item_doc.exists:
            return jsonify({'error': 'Item not found'}), 404
        
        target_item = item_doc.to_dict()
        target_category = target_item.get('category', '')
        
        # Find similar items by category
        similar = []
        for doc in db.collection('items').stream():
            item = doc.to_dict()
            item['id'] = doc.id
            
            if doc.id != item_id and item.get('category') == target_category:
                similar.append(item)
        
        return jsonify({
            'item_id': item_id,
            'similar_items': similar[:5],
            'count': len(similar[:5])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/trending', methods=['GET'])
@cross_origin()
def get_trending_items():
    """Get trending items (most rated recently)"""
    try:
        limit = int(request.args.get('limit', 10))
        
        # Get recent ratings
        recent_ratings = list(db.collection('ratings')
            .order_by('timestamp', direction=firestore.Query.DESCENDING)
            .limit(50)
            .stream())
        
        # Count ratings per item
        item_rating_counts = {}
        for rating in recent_ratings:
            item_id = rating.to_dict().get('itemId')
            if item_id:
                item_rating_counts[item_id] = item_rating_counts.get(item_id, 0) + 1
        
        # Get top items
        top_item_ids = sorted(item_rating_counts.items(), 
                            key=lambda x: x[1], 
                            reverse=True)[:limit]
        
        # Fetch item details
        trending = []
        for item_id, count in top_item_ids:
            item_doc = db.collection('items').document(item_id).get()
            if item_doc.exists:
                item = item_doc.to_dict()
                item['id'] = item_id
                item['rating_count_recent'] = count
                trending.append(item)
        
        return jsonify({
            'recommendations': trending,
            'count': len(trending)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500