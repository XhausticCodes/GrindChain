import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as groupApi from '../API/groupApi';

const JoinGroupPage = () => {
  const { groupId: paramGroupId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupInfo, setGroupInfo] = useState(null);

  // Get group ID from either URL params or search params
  const groupId = paramGroupId || searchParams.get('id');

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      const redirectPath = paramGroupId ? `/join/${paramGroupId}` : `/join-group?id=${searchParams.get('id')}`;
      navigate('/login', { 
        state: { 
          redirectTo: redirectPath,
          message: 'Please log in to join the group' 
        }
      });
      return;
    }

    // Attempt to join the group automatically
    handleJoinGroup();
  }, [groupId, user, paramGroupId, searchParams]);

  const handleJoinGroup = async () => {
    if (!groupId) {
      setError('Invalid group link');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First try to get group details
      const result = await groupApi.createOrJoinGroup(groupId, false);
      
      if (result && result.success) {
        // Update user state
        setUser(prev => ({
          ...prev,
          currentGroupId: result.group.joinCode,
          groupID: result.group.joinCode
        }));

        setGroupInfo(result.group);
        
        // Show success message and redirect
        setTimeout(() => {
          navigate('/chatroom', {
            state: { message: `Successfully joined "${result.group.name}"!` }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to join group:', error);
      setError(error.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    handleJoinGroup();
  };

  const handleGoBack = () => {
    navigate('/create-group');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Joining Group...
          </h2>
          <p className="text-white/70 text-center">
            Please wait while we add you to the group.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
        <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Failed to Join Group
          </h2>
          <p className="text-white/70 text-center mb-6">
            {error}
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleRetry}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-3 rounded-xl font-semibold shadow hover:from-yellow-600 hover:to-amber-600 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl font-semibold shadow hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen w-full flex items-center justify-center blur-theme rounded-tl-3xl">
      <div className="bg-black/60 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md border border-yellow-400/30 backdrop-blur-md">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-green-400 mb-4">
          Welcome to the Group!
        </h2>
        {groupInfo && (
          <div className="bg-white/10 rounded-lg p-4 mb-6 w-full">
            <div className="flex items-center gap-3">
              <img
                src={groupInfo.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                alt={groupInfo.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
              />
              <div>
                <h3 className="font-semibold text-white">{groupInfo.name}</h3>
                <p className="text-white/70 text-sm">
                  {groupInfo.memberCount || 0} members
                </p>
              </div>
            </div>
          </div>
        )}
        <p className="text-white/70 text-center mb-6">
          You've successfully joined the group! Redirecting to chat...
        </p>
        <div className="w-full bg-yellow-400/20 rounded-full h-2">
          <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage;
