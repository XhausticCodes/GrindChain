// Mock data service for offline development
export const mockGroupData = {
  success: true,
  group: {
    id: 'mock-group-id',
    _id: 'mock-group-id',
    name: 'Demo Group',
    joinCode: 'DEMO123',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K',
    description: 'A demo group for testing',
    memberCount: 3,
    members: [
      { _id: 'user1', username: 'Alice', avatar: 'https://via.placeholder.com/48' },
      { _id: 'user2', username: 'Bob', avatar: 'https://via.placeholder.com/48' },
      { _id: 'user3', username: 'Charlie', avatar: 'https://via.placeholder.com/48' }
    ],
    admin: 'user1', // Assuming current user is admin
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
};

export const mockUser = {
  _id: 'user1',
  username: 'DemoUser',
  email: 'demo@example.com',
  avatar: 'https://via.placeholder.com/48',
  groupID: 'DEMO123'
};

// Mock API endpoints for offline mode
export const mockApiEndpoints = {
  '/api/groups/current': (req, res) => {
    res.json(mockGroupData);
  },
  
  '/api/groups/update': (req, res) => {
    const { name, avatar } = req.body;
    res.json({
      success: true,
      group: {
        ...mockGroupData.group,
        name: name || mockGroupData.group.name,
        avatar: avatar || mockGroupData.group.avatar
      }
    });
  },
  
  '/api/groups/leave': (req, res) => {
    res.json({
      success: true,
      message: 'Successfully left the group'
    });
  },
  
  '/api/auth/check': (req, res) => {
    res.json({
      success: true,
      user: mockUser
    });
  }
};
