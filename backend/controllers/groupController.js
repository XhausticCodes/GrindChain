import Group from '../models/Group.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create or join a group
export const createOrJoinGroup = async (req, res) => {
  try {
    const { groupId, groupName } = req.body;
    const userId = req.user.id;

    let group;
    let isNewGroup = false;

    if (groupId) {
      // Try to find existing group by joinCode or name
      let query;
      
      // Check if groupId is a valid ObjectId format
      if (mongoose.Types.ObjectId.isValid(groupId)) {
        // If it's a valid ObjectId, search by both _id and joinCode
        query = {
          $or: [
            { _id: groupId },
            { joinCode: groupId },
            { name: groupId }
          ]
        };
      } else {
        // If it's not a valid ObjectId, search only by joinCode and name
        query = {
          $or: [
            { joinCode: groupId },
            { name: groupId }
          ]
        };
      }
      
      group = await Group.findOne(query);

      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found. Please check the Group ID.'
        });
      }
    } else if (groupName) {
      // Create new group
      const joinCode = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      
      group = new Group({
        name: groupName,
        joinCode: joinCode,
        members: [userId],
        admins: [userId]
      });

      await group.save();
      isNewGroup = true;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either groupId or groupName is required'
      });
    }

    // Convert userId to ObjectId for comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Add user to group if not already a member
    if (!group.members.some(memberId => memberId.equals(userObjectId))) {
      group.members.push(userObjectId);
      await group.save();
    }

    // Update user's current group
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {
        currentGroupId: group.joinCode,
        $addToSet: { groups: group.joinCode }
      },
      { new: true }
    );

    res.json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        avatar: group.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K',
        joinCode: group.joinCode,
        memberCount: group.members.length,
        isAdmin: group.admins.some(adminId => adminId.equals(userObjectId))
      },
      isNewGroup
    });
  } catch (error) {
    console.error('Error in createOrJoinGroup:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update group details
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, avatar, description } = req.body;
    const userId = req.user.id;

    let group;
    
    // Check if groupId is a valid ObjectId format
    if (mongoose.Types.ObjectId.isValid(groupId)) {
      // If it's a valid ObjectId, search by both _id and joinCode
      group = await Group.findOne({
        $or: [
          { _id: groupId },
          { joinCode: groupId }
        ]
      });
    } else {
      // If it's not a valid ObjectId, search only by joinCode
      group = await Group.findOne({ joinCode: groupId });
    }

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Convert userId to ObjectId for comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user is admin or member
    if (!group.members.some(memberId => memberId.equals(userObjectId))) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Update group details
    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (avatar) {
      // Validate avatar is a valid data URL or HTTP URL
      if (avatar.startsWith('data:image/') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
        updateData.avatar = avatar;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid avatar format. Must be a valid image URL or base64 data.'
        });
      }
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      group._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      group: {
        id: updatedGroup._id,
        name: updatedGroup.name,
        avatar: updatedGroup.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K',
        description: updatedGroup.description,
        joinCode: updatedGroup.joinCode,
        memberCount: updatedGroup.members.length,
        isAdmin: updatedGroup.admins.some(adminId => adminId.equals(userObjectId))
      }
    });
  } catch (error) {
    console.error('Error in updateGroup:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    let group;
    
    // Check if groupId is a valid ObjectId format
    if (mongoose.Types.ObjectId.isValid(groupId)) {
      // If it's a valid ObjectId, search by both _id and joinCode
      group = await Group.findOne({
        $or: [
          { _id: groupId },
          { joinCode: groupId }
        ]
      });
    } else {
      // If it's not a valid ObjectId, search only by joinCode
      group = await Group.findOne({ joinCode: groupId });
    }

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Convert userId to ObjectId for comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Remove user from group
    group.members = group.members.filter(memberId => !memberId.equals(userObjectId));
    group.admins = group.admins.filter(adminId => !adminId.equals(userObjectId));

    // If no members left, delete the group
    if (group.members.length === 0) {
      await Group.findByIdAndDelete(group._id);
    } else {
      // If user was the only admin, make the first member an admin
      if (group.admins.length === 0 && group.members.length > 0) {
        group.admins.push(group.members[0]);
      }
      await group.save();
    }

    // Update user's current group
    await User.findByIdAndUpdate(userId, {
      currentGroupId: null,
      $pull: { groups: group.joinCode }
    });

    res.json({
      success: true,
      message: 'Successfully left the group'
    });
  } catch (error) {
    console.error('Error in leaveGroup:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get group details
export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    let group;
    
    // Check if groupId is a valid ObjectId format
    if (mongoose.Types.ObjectId.isValid(groupId)) {
      // If it's a valid ObjectId, search by both _id and joinCode
      group = await Group.findOne({
        $or: [
          { _id: groupId },
          { joinCode: groupId }
        ]
      }).populate('members', 'username email avatar');
    } else {
      // If it's not a valid ObjectId, search only by joinCode
      group = await Group.findOne({ joinCode: groupId })
        .populate('members', 'username email avatar');
    }

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Convert userId to ObjectId for comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user is a member
    if (!group.members.some(member => member._id.equals(userObjectId))) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    res.json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        avatar: group.avatar,
        description: group.description,
        joinCode: group.joinCode,
        memberCount: group.members.length,
        members: group.members,
        isAdmin: group.admins.some(adminId => adminId.equals(userObjectId)),
        createdAt: group.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getGroupDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's current group
export const getCurrentGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('getCurrentGroup called for user:', userId);
    
    const user = await User.findById(userId);
    console.log('User found:', {
      id: user._id,
      username: user.username,
      currentGroupId: user.currentGroupId,
      groups: user.groups
    });
    
    if (!user.currentGroupId) {
      console.log('User has no currentGroupId, returning null');
      return res.json({
        success: true,
        group: null,
        message: 'No current group set for user'
      });
    }

    console.log('Looking for group with joinCode:', user.currentGroupId);
    const group = await Group.findOne({ joinCode: user.currentGroupId })
      .populate('members', 'username email avatar');

    if (!group) {
      console.log('Group not found with joinCode:', user.currentGroupId);
      // Clean up user's current group if group doesn't exist
      await User.findByIdAndUpdate(userId, { currentGroupId: null });
      return res.json({
        success: true,
        group: null,
        message: 'Group not found, cleared invalid group reference'
      });
    }

    console.log('Group found:', {
      id: group._id,
      name: group.name,
      joinCode: group.joinCode,
      memberCount: group.members.length
    });

    // Convert userId to ObjectId for comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    res.json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        avatar: group.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM2YjcyODAiLz4KPHR4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RzwvdHh0Pgo8L3N2Zz4K',
        description: group.description,
        joinCode: group.joinCode,
        memberCount: group.members.length,
        members: group.members,
        isAdmin: group.admins.some(adminId => adminId.equals(userObjectId)),
        createdAt: group.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getCurrentGroup:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Debug: Get all groups (for debugging purposes)
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate('members', 'username email')
      .populate('admins', 'username email');
    
    console.log('All groups in database:', groups.map(g => ({
      id: g._id,
      name: g.name,
      joinCode: g.joinCode,
      memberCount: g.members.length,
      members: g.members.map(m => m.username),
      admins: g.admins.map(a => a.username)
    })));
    
    res.json({
      success: true,
      groups: groups.map(group => ({
        id: group._id,
        name: group.name,
        joinCode: group.joinCode,
        memberCount: group.members.length,
        members: group.members,
        admins: group.admins,
        createdAt: group.createdAt
      }))
    });
  } catch (error) {
    console.error('Error getting all groups:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
