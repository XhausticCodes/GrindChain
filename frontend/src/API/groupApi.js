const API_BASE_URL = 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Create headers without content-type for requests without body
const createHeadersNoBody = () => {
  const token = getAuthToken();
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Create or join a group
export const createOrJoinGroup = async (groupIdOrName, isCreating = false) => {
  try {
    // Prepare request body based on whether we're creating or joining
    const requestBody = isCreating 
      ? { groupName: groupIdOrName }
      : { groupId: groupIdOrName };

    console.log('createOrJoinGroup called with:', {
      groupIdOrName,
      isCreating,
      requestBody
    });

    const response = await fetch(`${API_BASE_URL}/groups/join`, {
      method: 'POST',
      headers: createHeaders(),
      credentials: 'include',
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    console.log('createOrJoinGroup response:', {
      status: response.status,
      ok: response.ok,
      data
    });
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create/join group');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating/joining group:', error);
    throw error;
  }
};

// Update group details
export const updateGroup = async (groupId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'PUT',
      headers: createHeaders(),
      credentials: 'include',
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update group');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

// Leave group
export const leaveGroup = async (groupId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave`, {
      method: 'DELETE',
      headers: createHeadersNoBody(),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to leave group');
    }
    
    return data;
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

// Get group details
export const getGroupDetails = async (groupId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'GET',
      headers: createHeadersNoBody(),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get group details');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting group details:', error);
    throw error;
  }
};

// Get current user's group
export const getCurrentGroup = async () => {
  try {
    console.log('getCurrentGroup API call started');
    
    const response = await fetch(`${API_BASE_URL}/groups/current`, {
      method: 'GET',
      headers: createHeadersNoBody(),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    console.log('getCurrentGroup API response:', {
      status: response.status,
      ok: response.ok,
      data
    });
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get current group');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting current group:', error);
    throw error;
  }
};

// Clear current group (for debugging/cleanup)
export const clearCurrentGroup = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/clear-group`, {
      method: 'POST',
      headers: createHeadersNoBody(),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to clear current group');
    }
    
    return data;
  } catch (error) {
    console.error('Error clearing current group:', error);
    throw error;
  }
};

// Debug: Get all groups
export const getAllGroups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/debug/all`, {
      method: 'GET',
      headers: createHeadersNoBody(),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get all groups');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting all groups:', error);
    throw error;
  }
};
