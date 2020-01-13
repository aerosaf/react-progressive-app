import Sendbird from 'sendbird';
import { sendbirdConstants } from '../_constants';
import { sendbirdChannelService } from '../_sendbird_services';

const APP_ID = process.env.SENDBIRD_APP_ID;

export const sendbirdChannelActions = {
  getChannel,
  clearChannel,
  initChatScreen,
  createChatHandler,
  loadMessages,
  sendMessage,
  registerChannelHandler,
  sendbirdIsTyping,
  typingStart,
  typingEnd
};

function getChannel(channel_url) {
  return dispatch => {
    dispatch({ type: sendbirdConstants.CHANNEL_REQUEST });
    return sendbirdChannelService.retrieve(channel_url)
      .then(channel => dispatch({ type: sendbirdConstants.CHANNEL_SUCCESS, channel: channel }))
      .catch(error => dispatch({ type: sendbirdConstants.CHANNEL_FAIL, error: error }));
  };
}

function clearChannel() {
  const sendbird = new Sendbird({ appId: APP_ID });
  sendbird.removeAllChannelHandlers();
  return dispatch => {
    dispatch({ type: sendbirdConstants.CHANNEL_CLEAR });
  };
}

function initChatScreen() {
  const sendbird = new Sendbird({ appId: APP_ID });
  sendbird.removeAllChannelHandlers();
  return {
    type: sendbirdConstants.INIT_CHAT_SCREEN
  };
}

function createChatHandler(channel_url) {
  return dispatch => {
    return sendbirdChannelService.retrieve(channel_url)
      .then(channel => {
        registerChannelHandler(channel_url, dispatch);
        dispatch({ type: sendbirdConstants.CREATE_CHAT_HANDLER_SUCCESS, channel: channel });
      })
      .catch(error => dispatch({ type: sendbirdConstants.CREATE_CHAT_HANDLER_FAIL, error: error }));
  };
}

function loadMessages(query) {
  return dispatch => {
    dispatch({ type: sendbirdConstants.SENDBIRD_MESSAGE_REQUEST });

    if (query.hasMore) {
      return sendbirdChannelService.loadMessages(query)
        .then(messages => {
          dispatch({
            type: sendbirdConstants.SENDBIRD_MESSAGE_SUCCESS,
            message: messages
          });
        })
        .catch(error => dispatch({ type: sendbirdConstants.SENDBIRD_MESSAGE_FAIL, error: error }));
    } else {
      dispatch({ type: sendbirdConstants.SENDBIRD_MESSAGE_FAIL, error: 'Unable to fetch messages' });
      return Promise.resolve(true);
    }
  };
}

function sendMessage(channel_url, msg) {
  return dispatch => {
    dispatch({ type: sendbirdConstants.SEND_MESSAGE_REQUEST });

    sendbirdChannelService.sendMessage(channel_url, msg, (message, error) => {
      if (error) {
        dispatch({
          type: sendbirdConstants.SEND_MESSAGE_FAIL,
          error: error
        });
      } else {
        dispatch({
          type: sendbirdConstants.SEND_MESSAGE_SUCCESS,
          new_message: message
        });
      }
    });
  };
}

function registerChannelHandler(channel_url, dispatch) {
  const sendbird = new Sendbird({ appId: APP_ID });
  let handler = new sendbird.ChannelHandler();
  handler.onMessageReceived = (channel, message) => {
    if (channel.url === channel_url) {
      dispatch({
        type: sendbirdConstants.MESSAGE_RECEIVED,
        message: message
      });
    }
  };
  handler.onMessageUpdated = (channel, message) => {
    if (channel.url === channel_url) {
      dispatch({
        type: sendbirdConstants.MESSAGE_UPDATED,
        message: message
      });
    }
  };
  handler.onMessageDeleted = (channel, message_id) => {
    if (channel.url === channel_url) {
      dispatch({
        type: sendbirdConstants.MESSAGE_DELETED,
        message_id: message_id
      });
    }
  };
  handler.onReadReceiptUpdated = channel => {
    if (channel.url === channel_url) {
      dispatch({
        type: sendbirdConstants.READ_RECEIPT_UPDATE,
        channel: channel
      });
    }
  };
  handler.onTypingStatusUpdated = channel => {
    const typing = sendbirdIsTyping(channel);
    dispatch({
      type: sendbirdConstants.TYPING_STATUS_UPDATE,
      typing: typing
    });
  };
  sendbird.addChannelHandler(channel_url, handler);
}

function sendbirdIsTyping(channel) {
  if (channel.isTyping()) {
    const typingMembers = channel.getTypingMembers();
    if (typingMembers.length == 1) {
      return `${typingMembers[0].nickname} is typing...`;
    } else {
      return `Some members are typing...`
    }
  } else {
    return '';
  }
}

function typingStart(channel_url) {
  sendbirdChannelService.markAsRead(channel_url);
  return dispatch => {
    return sendbirdChannelService.typingStart(channel_url)
      .then(response => dispatch({ type: sendbirdConstants.SEND_TYPING_START_SUCCESS, response: response }))
      .catch(error => dispatch({ type: sendbirdConstants.SEND_TYPING_START_FAIL, error: error }))
  }
}

function typingEnd(channel_url) {
  return dispatch => {
    return sendbirdChannelService.typingEnd(channel_url)
      .then(response => dispatch({ type: sendbirdConstants.SEND_TYPING_END_SUCCESS, response: response }))
      .catch(error => dispatch({ type: sendbirdConstants.SEND_TYPING_END_FAIL, error: error }))
  }
}
