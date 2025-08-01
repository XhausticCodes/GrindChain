import React, { useState } from 'react';
import { 
  ClipboardDocumentIcon, 
  CheckIcon,
  QrCodeIcon,
  ShareIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import InviteModal from './InviteModal';

const GroupInfoCard = ({ group, onInviteClick }) => {
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Copy group ID to clipboard
  const copyGroupId = async () => {
    try {
      await navigator.clipboard.writeText(group.joinCode || group.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = group.joinCode || group.id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share group (if Web Share API is available)
  const shareGroup = async () => {
    const shareData = {
      title: `Join ${group.name} on GrindChain`,
      text: `You've been invited to join "${group.name}" chat room on GrindChain!`,
      url: `${window.location.origin}/join/${group.joinCode || group.id}`
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copying the invite link
        copyGroupId();
      }
    } else {
      // Fallback: copy to clipboard
      copyGroupId();
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 space-y-3">
      {/* Group Header */}
      <div className="flex items-center gap-3">
        <img
          src={group.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt={group.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {group.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UsersIcon className="w-4 h-4" />
            <span>{group.memberCount || 0} members</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 dark:text-green-400">Active</span>
          </div>
        </div>
      </div>

      {/* Group ID Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Group ID (Share with others)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={group.joinCode || group.id || 'Loading...'}
            readOnly
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 text-gray-900 dark:text-white font-mono"
          />
          <button
            onClick={copyGroupId}
            className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
            title="Copy Group ID"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ClipboardDocumentIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={shareGroup}
            className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            title="Share Group"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
        
        {copied && (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            Group ID copied to clipboard!
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-2 border-t border-yellow-200 dark:border-yellow-800">
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex-1 px-3 py-2 text-sm rounded-lg bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/30 transition-colors"
        >
          Invite Friends
        </button>
        <button
          onClick={() => {
            // Generate QR code or show QR modal
            alert('QR Code feature coming soon!');
          }}
          className="px-3 py-2 text-sm rounded-lg bg-gray-500/20 text-gray-700 dark:text-gray-300 hover:bg-gray-500/30 transition-colors"
          title="Generate QR Code"
        >
          <QrCodeIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 rounded-lg p-2">
        💡 <strong>Tip:</strong> Share this Group ID with friends so they can join your chat room. 
        They can use it in the "Join Group" section.
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        group={group}
      />
    </div>
  );
};

export default GroupInfoCard;
