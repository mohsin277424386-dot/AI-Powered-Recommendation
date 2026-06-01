from flask import Blueprint, request, jsonify
from firebase_admin import auth, firestore
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Get firestore client (will use initialized app)
db = firestore.client()

# Auth decorator
def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get token from header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Invalid token format'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            # Verify token
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 401
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Invalid token format'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            decoded_token = auth.verify_id_token(token)
            # Check if user is admin (custom claim)
            if not decoded_token.get('admin', False):
                return jsonify({'error': 'Admin privileges required'}), 403
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 401
    
    return decorated

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Invalid token format'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        return jsonify({'user': decoded_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401