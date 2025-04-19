import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';

const Home = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row h-screen sm:h-full rounded-lg overflow-hidden">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};
65
export default Home;
