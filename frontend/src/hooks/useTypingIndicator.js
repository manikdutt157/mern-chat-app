import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useSettings from '../zustand/useSettings';
import useConversation from '../zustand/useConversation';

const useTypingIndicator = (message) => {
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { showComposingIndicator } = useSettings();

  useEffect(() => {
    if (!socket || !selectedConversation || !showComposingIndicator) return;

    // Only emit typing event if user has enabled the indicator
    if (message.trim() !== '') {
      socket.emit('typing', { 
        recipientId: selectedConversation._id,
        typing: true 
      });
    } else {
      socket.emit('typing', { 
        recipientId: selectedConversation._id,
        typing: false 
      });
    }

    // Cleanup function to stop typing indicator when component unmounts
    return () => {
      socket.emit('typing', { 
        recipientId: selectedConversation._id,
        typing: false 
      });
    };
  }, [message, socket, selectedConversation, showComposingIndicator]);
};

export default useTypingIndicator; 