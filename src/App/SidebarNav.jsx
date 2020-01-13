import React, { Component, createRef } from 'react';
import { Menu, Sidebar, Icon, Ref, Sticky } from 'semantic-ui-react';
import { history } from '../_helpers';

class SidebarNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: history.location.pathname
    }
  }

  handleItemClick = (e, { name, url }) => {
    this.setState({ activeItem: url });
    history.push(`/${url}`);
  };
  
  checkPermission = (type) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return type.includes(user.type);
  };

  contextRef = createRef();

  render() {
    const { activeItem } = this.state;
    const { visible } = this.props;

    const urls = [
      { url: 'bookings', icon: 'calendar', name: 'Bookings' },
      { url: 'vouchers', icon: 'ticket', name: 'Vouchers' },
      { url: 'notifications', icon: 'bell', name: 'Notifications' },
      { url: 'closing_info', icon: 'book', name: 'Closing Info', type: ['manager', 'venue_owner'] }
    ];

    return (
      <Ref innerRef={this.contextRef}>
        <Sticky context={this.contextRef}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            onHide={this.props.handleSidebarHide}
            vertical
            visible={visible}
            className='mainBackgroundColor'
          >
            {urls.map((url, key) => (
              !url.type || (url.type && this.checkPermission(url.type)) ? (
                <Menu.Item key={key} as='a' onClick={this.handleItemClick} active={activeItem === `/${url.url}`} url={url.url}>
                  <Icon name={url.icon} />{url.name}
                </Menu.Item>
              ) : (null)
            ))}
          </Sidebar>
        </Sticky>
      </Ref>
    );
  }
}

export { SidebarNav };
