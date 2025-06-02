import React from 'react'
import Conversation from './Conversation'
import useGetConversation from '../../hooks/useGetConversation';
import { getRandomEmoji } from '../../utils/emojis';

const Conversations = () => {
  const { loading, conversations } = useGetConversation();

  return (
    <div className="py-2 flex flex-col overflow-y-auto
                    max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)] md:max-h-full
                    gap-2 px-1 sm:px-2">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}

      {loading && (
        <span className="loading loading-spinner mx-auto mt-4 w-8 h-8"></span>
      )}
    </div>
  );
}

export default Conversations;
