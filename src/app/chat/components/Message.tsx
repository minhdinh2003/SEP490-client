'use client'
import Image from 'next/image';
import React from 'react';

const Message = ({ message, isMine }: any) => {
    return (
      <div className={`p-2 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start ${isMine ? 'flex-row-reverse' : ''}`}>
          <div className="ml-2">
        {!isMine &&  <Image width={35} height={35} className='rounded-full border border-gray-400 mr-1 ' alt='' src={"/avt.svg"}  />}
          </div>
          <div>
            <div className={`p-2 rounded-lg ${isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.text}
            </div>
            <div className="text-gray-500 text-xs mt-1">{message.time}</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Message;