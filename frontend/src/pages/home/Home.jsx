import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';
import useConversation from '../../zustand/useConversation';

const Home = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="w-full flex flex-col sm:flex-row h-screen rounded-lg overflow-hidden">
      {/* Show Sidebar on mobile only when no conversation is selected */}
      <div className={`${selectedConversation ? 'hidden sm:flex' : 'flex'} sm:w-[350px]`}>
        <Sidebar />
      </div>

      {/* Show MessageContainer on mobile only when conversation is selected */}
      <div className={`flex-1 ${!selectedConversation ? 'hidden sm:flex' : 'flex'}`}>
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
