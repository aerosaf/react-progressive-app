import React from 'react';
import { Icon, Image } from 'semantic-ui-react';
import { formatDate, formatTime } from '../_helpers';

const Message = ({chat, userId, prev, readCount}) => (
  (chat.messageType === 'admin') ? (
    <div className={`chat admin ${chat.message.match(/Special/g) ? "request" : ""}`}>{chat.message}</div>
  ) : (
    <div>
      {prev && (formatDate(prev.createdAt, ' ') !== formatDate(chat.createdAt, ' ')) &&
        <div className='chat admin'>{formatDate(chat.createdAt, ' ')}</div>
      }
      <div className={`chat ${userId == chat.sender.userId ? "right" : "left"}`}>
        {(userId == chat.sender.userId) ? (
          <span>
            <li>{chat.message}</li>
            {readCount > 0 &&
              <span><Icon name='checkmark' color='green' />Read by {readCount}, &nbsp;</span>
            }
          </span>
        ) : (
          <span>
            <strong>{chat.sender.nickname}</strong>
            <Image src={chat.sender.profileUrl} />
            <li>{chat.message}</li>
          </span>
        )}
        <span className='time'>{formatTime(chat.createdAt)}</span>
      </div>
    </div>
  )
);

export default Message;
