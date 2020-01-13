import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { Input, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { PageTemplate } from '../App';
import Message from './Message';
import { sendbirdChannelActions } from '../_sendbird_actions';
import { sendbirdChannelService } from '../_sendbird_services';
import { history } from '../_helpers';
import { alertActions } from '../_actions';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      channel_url: this.props.match.params.channel_url,
      channel: this.props.sendbird_channel.item,
      previousMsgQueryList: null
    };
  }

  componentDidMount() {
    const { channel_url } = this.state;
    if (channel_url !== null) {
      this.props.dispatch(sendbirdChannelActions.getChannel(channel_url));
      this.init();
    }
  }

  init() {
    const { channel_url } = this.state;
    this.props.dispatch(sendbirdChannelActions.initChatScreen());
    sendbirdChannelService.retrieve(channel_url)
      .then(
        channel => this.setState({ channel: channel }, () => this.componentInit())
      )
      .catch(error => {
        alertActions.error('Senbird Initialisation Failed');
        history.goBack();
      });
  }

  componentInit() {
    const { channel_url } = this.state;
    this.props.dispatch(sendbirdChannelActions.createChatHandler(channel_url));
    this.getMsgList(true);
    sendbirdChannelService.markAsRead(channel_url);
  }

  componentDidUpdate() {
    const { channel_url } = this.state;
    this.state.msg ? this.props.dispatch(sendbirdChannelActions.typingStart(channel_url)) : this.props.dispatch(sendbirdChannelActions.typingEnd(channel_url));
    this.scrollToBottom();
  }

  getMsgList(init) {
    if (!this.state.previousMsgQueryList && !init) {
      return;
    }
    const { channel_url } = this.state;
    if (init) {
      sendbirdChannelService.createPreviousMsgListQuery(channel_url)
        .then(query => {
          query.limit = 100;
          query.reverse = false;
          this.setState({ previousMsgQueryList: query }, () => {
            this.props.dispatch(sendbirdChannelActions.loadMessages(this.state.previousMsgQueryList));
          });
        })
        .catch(error => history.goBack());
    } else {
      this.props.dispatch(sendbirdChannelActions.loadMessages(this.state.previousMsgQueryList));
    }
  }

  scrollToBottom = () => {
    let { chats } = this.refs;
    const scrollHeight = chats.scrollHeight;
    const height = chats.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(chats).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  submitMsg = () => {
    const { channel_url, msg } = this.state;
    this.props.dispatch(sendbirdChannelActions.sendMessage(channel_url, msg));
    this.setState({ msg: '' });
  }

  keyPressed = (e) => {
    if (e.key === "Enter") {
      this.submitMsg();
    }
  }

  render() {
    const { user, sendbird_msg } = this.props;
    const { msg, channel } = this.state;
    const { id } = user;
    const { items } = sendbird_msg;
    let footerForm = {
      clear: 'both',
      margin: '0.5em 0'
    };
    return (
      <PageTemplate
        nav='angle-left'
      >
        <div className="chatroom">
          <ul className="chats" ref="chats">
            {(channel && items) &&
              items.map((item, key) =>
                <Message
                  chat={item}
                  userId={id}
                  key={key}
                  prev={items[key-1]}
                  readCount={channel.getReadMembers(item).length}
                />
              )
            }
            {sendbird_msg.typing &&
              <div className='chat admin'>{sendbird_msg.typing}</div>
            }
          </ul>
        </div>
        <Input
          style={footerForm}
          icon={<Icon name='send' link onClick={this.submitMsg} />}
          placeholder='Type your message...'
          name='msg'
          value={msg}
          onChange={this.handleInputChange}
          onKeyPress={this.keyPressed}
          fluid
        />
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, sendbird_msg, sendbird_channel, alert } = state;
  const { user } = authentication;
  return {
    user,
    sendbird_msg,
    sendbird_channel,
    alert
  };
}

const connectedChat = connect(mapStateToProps)(Chat);
export { connectedChat as Chat }