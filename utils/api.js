// utils/api.js

// Function to fetch all users from the Laravel API
export const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };
  
  // Function to fetch a specific user by ID from the Laravel API
  export const fetchUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };
    