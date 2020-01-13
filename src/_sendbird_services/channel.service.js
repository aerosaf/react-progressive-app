import Sendbird from 'sendbird';

const APP_ID = process.env.SENDBIRD_APP_ID;

export const sendbirdChannelService = {
  retrieve,
  createPreviousMsgListQuery,
  loadMessages,
  sendMessage,
  markAsRead,
  typingStart,
  typingEnd,
  getUnreadMsg
};

function retrieve(channel_url) {
  return new Promise((resolve, reject) => {
    const sendbird = new Sendbird({ appId: APP_ID });
    sendbird.GroupChannel.getChannel(channel_url)
      .then(channel => resolve(channel))
      .catch(error => reject(error));
  });
}

function createPreviousMsgListQuery(channel_url) {
  return new Promise((resolve, reject) => {
    retrieve(channel_url)
      .then(channel => resolve(channel.createPreviousMessageListQuery()))
      .catch(error => reject(error));
  });
}

function loadMessages(query) {
  return new Promise((resolve, reject) => {
    query.load((messages, error) => {
      if (error) {
        reject(error);
      } else {
        localStorage.setItem('sendbird_msg', JSON.stringify(messages));
        resolve(messages);
      }
    });
  });
}

function sendMessage(channel_url, msg, callback) {
  return new Promise((resolve) => {
    retrieve(channel_url).then(channel => {
      channel.sendUserMessage(msg, (message, error) => {
        resolve(callback(message, error));
      });
    });
  });
}

function markAsRead(channel_url) {
  retrieve(channel_url).then(channel => {
    channel.markAsRead();
  });
}

function typingStart(channel_url) {
  return new Promise((resolve, reject) => {
    retrieve(channel_url).then(channel => {
      channel.startTyping();
      resolve(channel);
    })
    .catch(error => reject(error));
  });
}

function typingEnd(channel_url) {
  return new Promise((resolve, reject) => {
    retrieve(channel_url).then(channel => {
      channel.endTyping();
      resolve(channel);
    })
    .catch(error => reject(error));
  });
}

function getUnreadMsg(channel_url) {
  return new Promise((resolve) => {
    retrieve(channel_url).then(channel => {
      resolve(channel.unreadMessageCount)
    });
  });
}
