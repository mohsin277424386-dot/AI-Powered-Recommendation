from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from firebase_admin import firestore
from .auth import admin_required

# Create items blueprint
items_bp = Blueprint('items', __name__)
db = firestore.client()

@items_bp.route('/', methods=['GET'])
@cross_origin()
def get_items():
    """Get all items with optional filtering"""
    try:
        limit = int(request.args.get('limit', 20))
        category = request.args.get('category', None)
        min_rating = request.args.get('min_rating', None)
        
        # Start query
        query = db.collection('items')
        
        # Apply filters
        if category:
            query = query.where('category', '==', category)
        
        if min_rating:
            query = query.where('average_rating', '>=', float(min_rating))
        
        # Apply limit
        items = []
        for doc in query.limit(limit).stream():
            item = doc.to_dict()
            item['id'] = doc.id
            items.append(item)
        
        return jsonify({
            'items': items,
            'count': len(items),
            'filters': {'category': category, 'min_rating': min_rating}
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/<item_id>', methods=['GET'])
@cross_origin()
def get_item(item_id):
    """Get a single item by ID"""
    try:
        doc = db.collection('items').document(item_id).get()
        if not doc.exists:
            return jsonify({'error': 'Item not found'}), 404
        
        item = doc.to_dict()
        item['id'] = doc.id
        
        # Get rating count
        rating_count = len(list(db.collection('ratings')
            .where('itemId', '==', item_id).stream()))
        item['rating_count'] = rating_count
        
        return jsonify(item), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/', methods=['POST'])
@cross_origin()
@admin_required
def create_item():
    """Create a new item (admin only)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'name is required'}), 400
        
        # Prepare item data
        item_data = {
            'name': data['name'],
            'description': data.get('description', ''),
            'category': data.get('category', 'uncategorized'),
            'image_url': data.get('image_url', ''),
            'average_rating': 0.0,
            'total_ratings': 0,
            'created_at': firestore.SERVER_TIMESTAMP,
            'created_by': request.user.get('uid', 'admin')
        }
        
        # Add optional fields
        if data.get('price'):
            item_data['price'] = float(data['price'])
        
        if data.get('tags'):
            item_data['tags'] = data['tags']
        
        # Add to Firestore
        doc_ref = db.collection('items').add(item_data)
        item_data['id'] = doc_ref[1].id
        
        return jsonify(item_data), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/<item_id>', methods=['PUT'])
@cross_origin()
@admin_required
def update_item(item_id):
    """Update an existing item (admin only)"""
    try:
        data = request.get_json()
        
        # Check if item exists
        doc_ref = db.collection('items').document(item_id)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({'error': 'Item not found'}), 404
        
        # Prepare update data (only allow certain fields)
        allowed_fields = ['name', 'description', 'category', 'image_url', 'price', 'tags']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if update_data:
            update_data['updated_at'] = firestore.SERVER_TIMESTAMP
            doc_ref.update(update_data)
        
        # Get updated item
        updated_doc = doc_ref.get()
        item = updated_doc.to_dict()
        item['id'] = updated_doc.id
        
        return jsonify(item), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/<item_id>', methods=['DELETE'])
@cross_origin()
@admin_required
def delete_item(item_id):
    """Delete an item (admin only)"""
    try:
        # Check if item exists
        doc_ref = db.collection('items').document(item_id)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({'error': 'Item not found'}), 404
        
        # Delete all ratings for this item
        ratings = db.collection('ratings').where('itemId', '==', item_id).stream()
        for rating in ratings:
            rating.reference.delete()
        
        # Delete the item
        doc_ref.delete()
        
        return jsonify({'success': True, 'message': 'Item and associated ratings deleted'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/categories', methods=['GET'])
@cross_origin()
def get_categories():
    """Get all unique categories"""
    try:
        items = db.collection('items').stream()
        categories = set()
        
        for item in items:
            category = item.to_dict().get('category', 'uncategorized')
            categories.add(category)
        
        return jsonify({'categories': sorted(list(categories))}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500