import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Mobile View State
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Analytics State
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    topCategories: [],
    ratingDistribution: [],
    dailyActivity: [],
    recommendationAccuracy: 85
  });

  // Social Features
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentShareItem, setCurrentShareItem] = useState(null);

  // Advanced Filters
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 1000,
    year: 'all',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  // AI Chat Assistant
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your AI assistant. Ask me for recommendations!\n\n💡 Try asking: "What can I ask?" to see all options!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // User Reviews
  const [reviews, setReviews] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  });

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // App State
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [popularItems, setPopularItems] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [userRatings, setUserRatings] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [recommendationAlgorithm, setRecommendationAlgorithm] = useState('hybrid');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Mobile View Effect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Data
  useEffect(() => {
    fetchCategories();
    fetchPopularItems();
    fetchTrendingItems();
    loadDefaultRecommendations();
    requestNotificationPermission();
    loadAnalytics();
  }, []);

  // Save recently viewed to localStorage
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Add to recently viewed
  const addToRecentlyViewed = (item) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [item, ...filtered].slice(0, 10);
    });
  };

  // Notifications
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Notifications enabled!', 'success');
      }
    }
  };

  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    setNotifications(prev => [{ id: Date.now(), title, body, time: new Date() }, ...prev].slice(0, 20));
  };

  // Analytics
  const loadAnalytics = async () => {
    setAnalyticsData({
      topCategories: [
        { name: 'Movies', count: 45 },
        { name: 'Books', count: 32 },
        { name: 'Products', count: 28 }
      ],
      ratingDistribution: [
        { stars: 5, count: 120 },
        { stars: 4, count: 85 },
        { stars: 3, count: 40 },
        { stars: 2, count: 15 },
        { stars: 1, count: 8 }
      ],
      dailyActivity: [65, 78, 82, 91, 88, 95, 102],
      recommendationAccuracy: 87
    });
  };

  // Social Share
  const shareItem = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
        showToast('Shared successfully!', 'success');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setCurrentShareItem(item);
      setShareModalOpen(true);
    }
  };

  // Enhanced AI Chat Assistant
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setChatInput('');
    
    setChatMessages(prev => [...prev, { type: 'typing', text: '...' }]);

    setTimeout(() => {
      setChatMessages(prev => prev.filter(msg => msg.type !== 'typing'));
      
      let response = '';
      const input = userMessage.toLowerCase();
      
      if (input.includes('movie') || input.includes('film')) {
        response = '🎬 **Movie Recommendations:**\n\n• **Inception** - Mind-bending thriller (4.8⭐)\n• **The Matrix** - Reality-bending classic (4.9⭐)\n• **Dune** - Epic sci-fi adventure (4.7⭐)\n\n💡 *Click on any movie card for details!*';
      } else if (input.includes('book')) {
        response = '📚 **Book Recommendations:**\n\n• **Atomic Habits** - Transform your life (4.9⭐)\n• **The Midnight Library** - Second chances (4.6⭐)\n• **Project Hail Mary** - Sci-fi adventure (4.8⭐)';
      } else if (input.includes('trending')) {
        response = '🔥 **Trending Now:**\n\n1. Dune - Epic sci-fi\n2. Oppenheimer - Historical drama\n3. The Midnight Library - Bestseller';
      } else if (input.includes('product')) {
        response = '🛍️ **Top Products:**\n\n• Noise Cancelling Headphones (4.8⭐)\n• Smart Watch Pro (4.6⭐)\n• Wireless Earbuds (4.7⭐)';
      } else if (input.includes('what can i ask') || input.includes('help')) {
        response = '🤖 **You can ask me:**\n\n🎬 Movies: "Show me movies", "Action films"\n📚 Books: "Book recommendations", "Self-help books"\n🛍️ Products: "Best headphones", "Top products"\n🔥 Trending: "What\'s trending?", "Popular items"';
      } else {
        response = '🤖 **AI Recommendation Assistant**\n\nI can help with:\n• Movie recommendations\n• Book suggestions\n• Product picks\n• Trending items\n\nTry: "What can I ask?" for all options!';
      }
      
      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 1000);
  };

  // Reviews
  const addReview = async (itemId) => {
    if (!reviewText.trim()) {
      showToast('Please write a review', 'error');
      return;
    }

    const newReview = {
      id: Date.now(),
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      rating: reviewRating,
      text: reviewText,
      date: new Date().toISOString()
    };

    setReviews(prev => ({
      ...prev,
      [itemId]: [newReview, ...(prev[itemId] || [])]
    }));

    showToast('Review added!', 'success');
    setShowReviewModal(false);
    setReviewText('');
    setReviewRating(5);
  };

  // Advanced Filters
  const applyFilters = (items) => {
    let filtered = [...items];
    
    if (filters.minRating > 0) {
      filtered = filtered.filter(item => (item.rating || 0) >= filters.minRating);
    }
    
    if (filters.year !== 'all') {
      filtered = filtered.filter(item => item.year == filters.year);
    }
    
    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return filtered;
  };

  // Email Recommendations
  const sendEmailRecommendations = async () => {
    if (!currentUser?.email) {
      showToast('Please add email to your profile', 'error');
      return;
    }
    
    showToast('Sending weekly digest...', 'info');
    setTimeout(() => {
      showToast('Weekly digest sent to your email!', 'success');
    }, 1500);
  };

  // Auth Functions
  const handleLogin = async (email, password) => {
    setCurrentUser({ id: 'user123', name: 'Demo User', email: email });
    setIsLoggedIn(true);
    setShowAuthModal(false);
    showToast(`Welcome back, ${email}!`, 'success');
  };

  const handleSignup = async (name, email, password) => {
    setCurrentUser({ id: 'user123', name: name, email: email });
    setIsLoggedIn(true);
    setShowAuthModal(false);
    showToast(`Account created! Welcome ${name}!`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setWishlist([]);
    setUserRatings({});
    showToast('Logged out successfully', 'info');
    loadDefaultRecommendations();
  };

  // API Functions
  const loadDefaultRecommendations = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, title: "Inception", description: "A mind-bending thriller", category: "Movies", rating: 4.8, is_trending: true, is_popular: true, year: 2010 },
        { id: 2, title: "The Matrix", description: "Reality is perception", category: "Movies", rating: 4.9, is_popular: true, year: 1999 },
        { id: 3, title: "Atomic Habits", description: "Transform your life", category: "Books", rating: 4.9, is_popular: true, year: 2018 },
        { id: 4, title: "The Midnight Library", description: "A novel about regrets", category: "Books", rating: 4.6, is_trending: true, year: 2020 },
        { id: 5, title: "Noise Cancelling Headphones", description: "Premium audio", category: "Products", rating: 4.5, is_trending: true, year: 2023 }
      ];
      setRecommendations(mockData);
      setLoading(false);
    }, 500);
  };

  const fetchCategories = async () => {
    setCategories(['Movies', 'Books', 'Products']);
  };

  const fetchPopularItems = async () => {
    const mockData = [
      { id: 1, title: "Inception", description: "A mind-bending thriller", rating: 4.8 },
      { id: 2, title: "The Matrix", description: "Reality is perception", rating: 4.9 },
      { id: 3, title: "Atomic Habits", description: "Transform your life", rating: 4.9 }
    ];
    setPopularItems(mockData);
  };

  const fetchTrendingItems = async () => {
    const mockData = [
      { id: 4, title: "Dune", description: "Epic sci-fi adventure", rating: 4.7 },
      { id: 5, title: "The Midnight Library", description: "A novel about regrets", rating: 4.6 }
    ];
    setTrendingItems(mockData);
  };

  const searchItems = async (searchTerm) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = recommendations.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRecommendations(applyFilters(filtered));
      setLoading(false);
    }, 500);
  };

  const filterByCategory = async (category) => {
    setLoading(true);
    setSelectedCategory(category);
    setTimeout(() => {
      const mockData = [
        { id: 1, title: "Inception", description: "A mind-bending thriller", category: "Movies", rating: 4.8 },
        { id: 2, title: "The Matrix", description: "Reality is perception", category: "Movies", rating: 4.9 }
      ];
      setRecommendations(applyFilters(mockData));
      setLoading(false);
    }, 500);
  };

  const getSimilarItems = async (itemId) => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 6, title: "Similar Item 1", description: "Related to your selection", category: "Movies", rating: 4.5 },
        { id: 7, title: "Similar Item 2", description: "Another recommendation", category: "Movies", rating: 4.3 }
      ];
      setRecommendations(mockData);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const rateItem = async (itemId, rating) => {
    if (!isLoggedIn) {
      showToast('Please login to rate items', 'info');
      setShowAuthModal(true);
      return;
    }
    
    setUserRatings({ ...userRatings, [itemId]: rating });
    showToast(`Rated ${rating} stars!`, 'success');
    sendNotification('New Rating', `You rated item ${rating} stars!`);
  };

  const addToWishlist = (itemId) => {
    if (!isLoggedIn) {
      showToast('Please login to add items to wishlist', 'info');
      setShowAuthModal(true);
      return;
    }
    setWishlist([...wishlist, itemId]);
    showToast('Added to wishlist!', 'success');
  };

  const removeFromWishlist = (itemId) => {
    setWishlist(wishlist.filter(id => id !== itemId));
    showToast('Removed from wishlist', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      searchItems(userInput);
    }
  };

  const fetchUserRecommendations = () => {
    loadDefaultRecommendations();
  };

  // Auth Modal Component
  const AuthModal = () => (
    <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          if (authMode === 'login') {
            handleLogin(formData.get('email'), formData.get('password'));
          } else {
            handleSignup(formData.get('name'), formData.get('email'), formData.get('password'));
          }
        }}>
          {authMode === 'signup' && (
            <input type="text" name="name" placeholder="Full Name" required />
          )}
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">{authMode === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        <p onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
        <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast toast-${toastMessage.type}`}>
          {toastMessage.message}
        </div>
      )}
      
      {/* Modals */}
      {showAuthModal && <AuthModal />}
      
      {/* AI Chat Assistant */}
      {showChat && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>🤖 AI Assistant</h3>
            <button onClick={() => setShowChat(false)}>×</button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.type === 'typing' ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  msg.text.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '5px 0' }}>{line}</p>
                  ))
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for recommendations... (Try: 'What can I ask?')"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🤖 AI-Powered Recommendation System</h1>
            <p className="subtitle">Personalized suggestions powered by artificial intelligence</p>
          </div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="chat-toggle" onClick={() => setShowChat(true)}>
              💬
            </button>
            <button className="notifications-toggle" onClick={() => setShowNotifications(!showNotifications)}>
              🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
            </button>
            {isLoggedIn ? (
              <div className="user-profile">
                <div className="user-avatar" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="user-info">
                      <strong>{currentUser?.name}</strong>
                      <small>{currentUser?.email}</small>
                    </div>
                    <button onClick={() => { setActiveTab('wishlist'); setShowProfileMenu(false); }}>
                      ❤️ Wishlist ({wishlist.length})
                    </button>
                    <button onClick={() => { setShowAnalytics(true); setShowProfileMenu(false); }}>
                      📊 Analytics
                    </button>
                    <button onClick={() => { sendEmailRecommendations(); setShowProfileMenu(false); }}>
                      📧 Weekly Digest
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowAuthModal(true)}>
                🔐 Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="notifications-panel">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications yet</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="notification-item">
                <strong>{notif.title}</strong>
                <p>{notif.body}</p>
                <small>{new Date(notif.time).toLocaleTimeString()}</small>
              </div>
            ))
          )}
        </div>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="analytics-dashboard">
          <div className="analytics-header">
            <h2>📊 Recommendation Analytics</h2>
            <button onClick={() => setShowAnalytics(false)}>×</button>
          </div>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Top Categories</h3>
              {analyticsData.topCategories.map(cat => (
                <div key={cat.name} className="analytics-item">
                  <span>{cat.name}</span>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${(cat.count / 45) * 100}%` }}></div>
                  </div>
                  <span>{cat.count} items</span>
                </div>
              ))}
            </div>
            <div className="analytics-card">
              <h3>Recommendation Accuracy</h3>
              <div className="accuracy-meter">
                <div className="accuracy-value" style={{ width: `${analyticsData.recommendationAccuracy}%` }}>
                  {analyticsData.recommendationAccuracy}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Selector */}
      <div className="algorithm-selector">
        <span>🤖 Algorithm:</span>
        <button className={`algo-btn ${recommendationAlgorithm === 'collaborative' ? 'active' : ''}`}
          onClick={() => setRecommendationAlgorithm('collaborative')}>
          🤝 Collaborative
        </button>
        <button className={`algo-btn ${recommendationAlgorithm === 'content-based' ? 'active' : ''}`}
          onClick={() => setRecommendationAlgorithm('content-based')}>
          📝 Content
        </button>
        <button className={`algo-btn ${recommendationAlgorithm === 'hybrid' ? 'active' : ''}`}
          onClick={() => setRecommendationAlgorithm('hybrid')}>
          🧬 Hybrid
        </button>
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          🔍 Filters {Object.values(filters).some(v => v !== 0 && v !== 'all' && v !== 'relevance') && '●'}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <h3>Advanced Filters</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Min Rating</label>
              <select value={filters.minRating} onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}>
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Year</label>
              <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}>
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="recently-viewed">
          <h3>🕒 Recently Viewed</h3>
          <div className="recently-viewed-list">
            {recentlyViewed.map(item => (
              <div key={item.id} className="recent-item" onClick={() => getSimilarItems(item.id)}>
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Bar */}
      <div className="category-bar">
        <button className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => filterByCategory('')}>
          All
        </button>
        {categories.map((cat, index) => (
          <button key={index} className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => filterByCategory(cat)}>
            {cat.name || cat}
          </button>
        ))}
      </div>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSubmit} className="search-form">
          <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}
            placeholder="Search for movies, books, products, or describe what you like..."
            className="search-input" />
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? '🔍 Searching...' : '🔍 Get Recommendations'}
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={fetchUserRecommendations} className="action-btn primary">👤 For You</button>
        <button onClick={fetchTrendingItems} className="action-btn trending">🔥 Trending</button>
        <button onClick={fetchPopularItems} className="action-btn popular">⭐ Most Popular</button>
        {isLoggedIn && (
          <button onClick={() => setActiveTab('wishlist')} className="action-btn wishlist">
            ❤️ Wishlist ({wishlist.length})
          </button>
        )}
        <button onClick={() => setActiveTab('recent')} className="action-btn recent">
          🕒 Recent
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>🔥 Trending Now</h3>
            {trendingItems.slice(0, 5).map(item => (
              <div key={item.id} className="sidebar-item" onClick={() => getSimilarItems(item.id)}>
                <h4>{item.title}</h4>
                <p>{item.description?.substring(0, 60)}...</p>
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <h3>⭐ Popular This Week</h3>
            {popularItems.slice(0, 5).map(item => (
              <div key={item.id} className="sidebar-item" onClick={() => getSimilarItems(item.id)}>
                <h4>{item.title}</h4>
                <div className="rating-stars small">
                  {'★'.repeat(Math.floor(item.rating || 4))}{'☆'.repeat(5 - Math.floor(item.rating || 4))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="recommendations-area">
          <div className="recommendations-header">
            <h2>
              {activeTab === 'wishlist' ? '❤️ My Wishlist' : 
               activeTab === 'recent' ? '🕒 Recently Viewed' :
               '🎯 Recommendations'}
            </h2>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Finding the best recommendations for you...</p>
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="empty-state">
              <p>✨ No recommendations yet</p>
              <p className="empty-subtitle">Try searching for something or check out trending items!</p>
            </div>
          )}

          <div className="recommendations-grid">
            {(activeTab === 'wishlist' ? recommendations.filter(item => wishlist.includes(item.id)) :
              activeTab === 'recent' ? recentlyViewed :
              applyFilters(recommendations)).map((item) => (
              <div key={item.id} className="recommendation-card" onClick={() => addToRecentlyViewed(item)}>
                <div className="card-badge">
                  {item.is_trending && <span className="badge trending">Trending</span>}
                  {item.is_popular && <span className="badge popular">Popular</span>}
                </div>
                
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-category">📁 {item.category}</div>
                
                {/* Rating Stars */}
                <div className="rating-container">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={(e) => { e.stopPropagation(); rateItem(item.id, star); }}
                        className={`star ${star <= (userRatings[item.id] || item.rating || 0) ? 'filled' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Reviews Preview */}
                {reviews[item.id] && reviews[item.id].length > 0 && (
                  <div className="reviews-preview">
                    <strong>Latest Review:</strong>
                    <p>"{reviews[item.id][0].text.substring(0, 60)}..."</p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="card-actions">
                  <button onClick={(e) => { e.stopPropagation(); getSimilarItems(item.id); }} className="similar-btn">
                    🔄 Similar
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); wishlist.includes(item.id) ? removeFromWishlist(item.id) : addToWishlist(item.id); }}
                    className={`wishlist-btn ${wishlist.includes(item.id) ? 'active' : ''}`}>
                    {wishlist.includes(item.id) ? '❤️ Saved' : '🤍 Save'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); shareItem(item); }} className="share-btn">
                    📤 Share
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentReviewItem(item); setShowReviewModal(true); }} className="review-btn">
                    💬 Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Review Modal */}
      {showReviewModal && currentReviewItem && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Review: {currentReviewItem.title}</h2>
            <div className="review-rating">
              <label>Rating:</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => setReviewRating(star)}
                    className={`star ${star <= reviewRating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..." rows="4" />
            <div className="modal-actions">
              <button onClick={() => addReview(currentReviewItem.id)}>Submit Review</button>
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && currentShareItem && (
        <div className="modal-overlay" onClick={() => setShareModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Share {currentShareItem.title}</h2>
            <div className="share-options">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); }}>📋 Copy Link</button>
              <button onClick={() => { window.open(`https://twitter.com/intent/tweet?text=Check out ${currentShareItem.title}`); }}>🐦 Twitter</button>
              <button onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`); }}>📘 Facebook</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;