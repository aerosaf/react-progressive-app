import React, { Component } from 'react';
import { List, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { notificationActions } from '../_actions';
import Notification from './Notification';
import InfiniteScroll from 'react-infinite-scroller';

class NotificationList extends Component {
  constructor(props) {
    super(props);
  }

  handleItemClick = (e, { notification, index }) => {
    this.props.dispatch(notificationActions.readNotification(notification));

    let notifications = this.props.notifications.items;
    notifications[index].is_read = true;

    this.setState({
      notifications: notifications
    }, () => {
      let url = '';
      let references = notification.reference_id.split('|');
      switch (notification.type) {
        case 'BOOKING_CREATED':
          url = `bookings/${references[1]}`;
          break;
        case 'ORDER_MADE':
        case 'ORDER_DELIVERED':
        case 'SINGLE_ORDER_DELIVERED':
          url = `orders/${references[1]}`;
        case 'SENDBIRD_MESSAGE_RECEIVED':
          url = `chat/${references[1]}`;
        default:
          break;
      }
      history.push(url);
    });
  }

  render() {
    const { notifications, loadMore } = this.props;
    const { items, has_more } = notifications;
    return (
      <InfiniteScroll
        className='infinite-scroll'
        loadMore={loadMore}
        hasMore={has_more}
        threshold={500}
        loader={<Loader active inline='centered' key={0}>Loading</Loader>}
      >
        <List divided relaxed>
          {items.map((notification, index) => (
            <Notification
              key={notification.code}
              notification={notification}
              index={index}
              handleItemClick={this.handleItemClick}
            />
          ))}
        </List>
      </InfiniteScroll>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, notifications } = state;
  const { user } = authentication;
  return {
    user,
    notifications
  };
}

const connectedNotification = connect(mapStateToProps)(NotificationList);
export { connectedNotification as NotificationList };
