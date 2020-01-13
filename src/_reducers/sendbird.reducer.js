import { sendbirdConstants } from '../_constants';

const user = JSON.parse(localStorage.getItem('sendbird_user'));
const initalUserState = {
  loading: false,
  item: user ? user : null,
  error: null
};

export function sendbird_user(state = initalUserState, action) {
  switch (action.type) {
    case sendbirdConstants.LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      };

    case sendbirdConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.user,
        error: null
      };

    case sendbirdConstants.LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        item: null,
        error: action.error
      };

    default:
      return state;
  }
};

const initialChannelState = {
  loading: false,
  item: null,
  error: null
};

export function sendbird_channel(state = initialChannelState, action) {
  switch (action.type) {
    case sendbirdConstants.CHANNEL_CLEAR:
      return initialChannelState
    case sendbirdConstants.CHANNEL_REQUEST:
      return {
        ...initialChannelState,
        loading: true
      };
    case sendbirdConstants.CHANNEL_SUCCESS:
      return {
        loading: false,
        item: action.channel,
        error: null
      };
    case sendbirdConstants.CHANNEL_FAIL:
      return {
        ...initialChannelState,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

const initialMsgState = {
  loading: false,
  items: [],
  error: null,
  typing: ''
};

const uniqueList = list => {
  return list.reduce((uniqList, currentValue) => {
    let ids = uniqList.map(item => {
      return item.messageId;
    });
    if (ids.indexOf(currentValue.messageId) < 0) {
      uniqList.push(currentValue);
    }
    return uniqList;
  }, []);
};

export function sendbird_msg(state = initialMsgState, action) {
  switch (action.type) {
    case sendbirdConstants.INIT_CHAT_SCREEN:
      return initialMsgState;

    case sendbirdConstants.SENDBIRD_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true
      };

    case sendbirdConstants.SENDBIRD_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.message,
        items: uniqueList([...action.message, ...state.items])
      };

    case sendbirdConstants.SENDBIRD_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        items: [],
        error: action.error
      };

    case sendbirdConstants.SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true
      };

    case sendbirdConstants.SEND_MESSAGE_SUCCESS:
      const { new_message }  = action;
      let found_new_msg = false;
      const send_success_list = state.items.map(message => {
        if (message.reqId && new_message.reqId && message.reqId.toString() === new_message.reqId.toString()) {
          found_new_msg = true;
          return new_message;
        } else {
          return message;
        }
      });
      if (found_new_msg) {
        return {
          ...state,
          loading: false,
          items: send_success_list
        };
      } else {
        return {
          ...state,
          loading: false,
          items: [...send_success_list, ...[new_message]]
        };
      }

    case sendbirdConstants.SENDBIRD_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case sendbirdConstants.MESSAGE_RECEIVED:
      return {
        ...state,
        loading: false,
        items: uniqueList([...state.items, ...[action.message]])
      };

    case sendbirdConstants.CREATE_CHAT_HANDLER_SUCCESS:
      return { ...state };

    case sendbirdConstants.CREATE_CHAT_HANDLER_FAIL:
      return { ...state };

    case sendbirdConstants.TYPING_STATUS_UPDATE:
      return {
        ...state,
        typing: action.typing
      };

    default:
      return state;
  }
}
