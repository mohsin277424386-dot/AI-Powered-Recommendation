import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import pearsonr

class CollaborativeFiltering:
    def __init__(self, db):
        self.db = db
    
    def fetch_ratings(self):
        ratings = []
        for doc in self.db.collection('ratings').stream():
            r = doc.to_dict()
            ratings.append({
                'userId': r['userId'],
                'itemId': r['itemId'],
                'rating': r['rating']
            })
        return pd.DataFrame(ratings) if ratings else pd.DataFrame()
    
    def generate_recommendations(self, user_id, n=10):
        df = self.fetch_ratings()
        if df.empty:
            return []
        
        # Create user-item matrix
        matrix = df.pivot_table(index='userId', columns='itemId', values='rating').fillna(0)
        
        if user_id not in matrix.index:
            return []
        
        # Cosine similarity
        similarity = cosine_similarity(matrix.values)
        
        # Get unrated items
        user_rated = set(df[df['userId'] == user_id]['itemId'].tolist())
        all_items = set(df['itemId'].unique())
        unrated = all_items - user_rated
        
        # Predict ratings
        user_idx = list(matrix.index).index(user_id)
        predictions = []
        
        for item_id in unrated:
            if item_id not in matrix.columns:
                continue
            item_idx = list(matrix.columns).index(item_id)
            
            weighted_sum = 0
            similarity_sum = 0
            for i, sim in enumerate(similarity[user_idx]):
                if i != user_idx and matrix.iloc[i, item_idx] > 0:
                    weighted_sum += sim * matrix.iloc[i, item_idx]
                    similarity_sum += abs(sim)
            
            if similarity_sum > 0:
                pred = weighted_sum / similarity_sum
                if pred > 0:
                    predictions.append({
                        'itemId': item_id,
                        'predictedRating': round(pred, 2)
                    })
        
        predictions.sort(key=lambda x: x['predictedRating'], reverse=True)
        
        # Get item details
        result = []
        for pred in predictions[:n]:
            doc = self.db.collection('items').document(pred['itemId']).get()
            if doc.exists:
                item = doc.to_dict()
                item['id'] = doc.id
                item['predictedRating'] = pred['predictedRating']
                result.append(item)
        
        return result