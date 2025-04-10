'use client'
import { useEffect, useState } from 'react';
import ChatRoom from './components/ChatRoom';
import Message from './components/Message';
import MessageInput from './components/MessageInput';

const IndexPage = () => {
  const [rooms, setRooms] = useState([
    { name: 'Room 1', lastMessage: 'Hello', messages: [{ text: 'Hello', time: '10:00', isMine: false }] },
    { name: 'Room 2', lastMessage: 'Hi', messages: [{ text: 'Hi', time: '10:05', isMine: true }] },
  ]);
  const [selectedRoom, setSelectedRoom] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const disableScroll = () => {
      document.body.classList.add("no-scroll");
    };

    const enableScroll = () => {
      document.body.classList.remove("no-scroll");
    };

    // Vô hiệu hóa cuộn khi component được mount
    disableScroll();

    // Bật lại cuộn khi component bị unmount
    return () => {
      enableScroll();
    };
  }, []);

  const handleSendMessage = (text: string) => {
    const newRooms = [...rooms];
    newRooms[selectedRoom].messages.push({ text, time: new Date().toLocaleTimeString(), isMine: true });
    newRooms[selectedRoom].lastMessage = text;
    setRooms(newRooms); // trigger re-render
  };

  return (
    <div className="flex h-screen">
      {/* <ChatRoom rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} /> */}
      <div className="w-3/4 flex flex-col relative">
        <div className="flex-1 p-4 overflow-y-auto mb-16">
          {rooms[selectedRoom].messages.map((message: any, index: number) => (
            <Message key={index} message={message} isMine={message.isMine} />
          ))}
        </div>
        <div className="fixed bottom-0 right-0 w-full">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;