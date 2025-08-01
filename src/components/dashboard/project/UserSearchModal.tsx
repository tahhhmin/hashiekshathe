'use client'; // This is crucial for client-side components

import React, { useState, useEffect } from 'react';
import styles from './UserSearchModal.module.css'; // Ensure this path is correct
import { X, Search } from 'lucide-react';

interface User {
  _id: string; // MongoDB's default ID
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface UserSearchModalProps {
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ onSelectUser, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Corrected API endpoint for App Router
        const response = await fetch(`/api/users/search?q=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      // Only fetch if searchTerm length is 2 or more, or if it's empty to clear results
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        fetchUsers();
      } else {
        // If searchTerm is 1 character, clear previous results to avoid showing stale data
        setUsers([]);
      }
    }, 300); // Debounce search to avoid too many requests

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelect = (user: User) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Select a Volunteer</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.userList}>
          {loading && <p className={styles.statusMessage}>Loading users...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {!loading && !error && users.length === 0 && searchTerm.length >= 2 && (
            <p className={styles.statusMessage}>No users found for "{searchTerm}".</p>
          )}
          {!loading && !error && users.length === 0 && searchTerm.length < 2 && (
            <p className={styles.statusMessage}>Type at least 2 characters to search for users.</p>
          )}

          {!loading && !error && users.length > 0 && (
            <ul>
              {users.map((user) => (
                <li key={user._id} className={styles.userListItem}>
                  <div>
                    <p className={styles.userName}>{user.firstName} {user.lastName} ({user.username})</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  <button onClick={() => handleSelect(user)} className={styles.selectButton}>
                    Select
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;