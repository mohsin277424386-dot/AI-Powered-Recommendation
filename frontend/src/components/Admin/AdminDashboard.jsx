import React, { useState, useEffect } from 'react';
import { adminAPI, itemsAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, items: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        itemsAPI.getAll(100)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setItems(itemsRes.data.items);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      await adminAPI.deleteUser(userId);
      fetchData();
    }
  };

  const updateRole = async (userId, role) => {
    await adminAPI.updateUserRole(userId, role);
    fetchData();
  };

  const deleteItem = async (itemId) => {
    if (window.confirm('Delete this item?')) {
      await itemsAPI.delete(itemId);
      fetchData();
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="stats">
        <div>Users: {stats.users}</div>
        <div>Items: {stats.items}</div>
        <div>Ratings: {stats.ratings}</div>
      </div>

      <div className="admin-section">
        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role || 'user'}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.average_rating?.toFixed(1) || 'N/A'}</td>
                <td>
                  <button onClick={() => deleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;