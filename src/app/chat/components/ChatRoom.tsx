"use client"
import Image from 'next/image';
import React from 'react';

const ChatRoom = ({ rooms, selectedRoom, onSelectRoom }: any) => {
    return (
      <div className="w-1/4 h-full border-r border-gray-300 overflow-y-auto">
        {rooms.map((room: any, index: number) => (
          <div
            key={index}
            className={`p-4 cursor-pointer ${selectedRoom === index ? 'bg-gray-200' : 'hover:bg-gray-100'} flex items-center gap-3`}
            onClick={() => onSelectRoom(index)}
          >
            <Image width={40} height={40} className='rounded-full border border-gray-400 ' alt='' src={"/avt.svg"}  />
           <div>
           <div className="font-bold">{room.name}</div>
           <div className="text-gray-500 text-sm">{room.lastMessage}</div>
           </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ChatRoom;