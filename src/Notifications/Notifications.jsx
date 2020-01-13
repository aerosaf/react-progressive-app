import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notificationActions } from '../_actions';
import { NotificationList } from './NotificationList';
import { LoadingMessage, PageTemplate } from '../App';

class Notifications extends Component {
  constructor(props) {
    super(props);
    let page = 1;

    if (props.notifications.items) {
      page = props.notifications.page;
    }

    this.state = {
      page: page
    };
  }

  componentDidMount() {
    this.setState({ page: 1 }, () => {
      this.props.dispatch(notificationActions.getNotifications(1));
    });
  }

  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.props.dispatch(notificationActions.getNotifications(this.state.page));
    });
  }

  onRefresh = () => {
    return new Promise((resolve) => {
      this.setState({ page: 1 }, () => {
        this.props.dispatch(notificationActions.getNotifications(1, true));
        resolve(true);
      });
    });
  }

  render() {
    const { user, notifications, alert } = this.props;
    
    const sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Notifications', content: 'Notifications', active: true }
    ];

    return (
      <PageTemplate
        sections={sections}
        name={user.name}
        nav='bars'
        alert={alert}
        onRefresh={this.onRefresh}
      >
        {(notifications.loading && !notifications.items) &&
          <LoadingMessage loading={notifications.loading}/>
        }
        {notifications.items &&
          <NotificationList
            type='list'
            loadMore={this.handleLoadMore}
          />
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { notifications, authentication, alert } = state;
  const { user } = authentication;
  return {
    user,
    notifications,
    alert
  };
}

const connectedNotification = connect(mapStateToProps)(Notifications);
export { connectedNotification as Notifications };
