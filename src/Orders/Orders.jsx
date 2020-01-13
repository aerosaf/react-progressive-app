import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { orderActions, venueActions } from '../_actions';
import { OrderList } from './OrderList';
import { LoadingMessage, PageTemplate, NoData } from '../App';
import { debounce } from '../_helpers';
import { DropDown, TextInput } from '../Input';

class Orders extends Component {
  constructor(props) {
    super(props);
    const { orders } = props;

    let search = '',
        venue = parseInt(localStorage.getItem('setVenue')),
        page = 1;

    if (orders.items) {
      search = orders.keyword,
      venue = orders.venue,
      page = orders.page
    }

    this.state = {
      venue: venue,
      search: search,
      page: page
    };
  }

  componentDidMount() {
    const { venues, orders } = this.props;
    let { venue } = this.state;
    let changes = false;

    if (venues.items && !venue) {
      venue = venues.items[0].value;
      changes = true;
    }

    this.setState({ venue: venue }, () => {
      if (!orders.items || changes) {
        this.onLoad();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { orders, venues } = this.props;
    const { venue } = this.state;

    if (!orders.items && !orders.loading && !venue && venues.items) {
      const key = venues.items[0].key;
      localStorage.setItem('setVenue', key);
      this.setState({ venue: key }, () => {
        this.onLoad();
      })
    }
  }

  handleLoadMore = () => {
    const { page } = this.state;
    this.setState({'page': page + 1}, () => {
      this.onLoad();
    });
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      this.handleCallChange();
    });
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = 'set'+name;
    localStorage.setItem(name, value);
  }

  handleCallChange = debounce (() => {
    this.setState({ page: 1 }, () => {
      this.onLoad();
    });
  }, 1000);

  onRefresh = () => {
    return new Promise((resolve) => {
      this.setState({ page: 1 }, () => {
        this.onLoad();
        resolve(true);
      });
    });
  }

  onLoad = () => {
    const { venue, search, page } = this.state;
    this.props.dispatch(orderActions.getOrders(venue, search, page));
  }

  render() {
    const { search, venue } = this.state;
    const { user, orders, venues, alert } = this.props;
    const { items, has_more } = orders;
    const { name } = user;

    const sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Orders', content: 'Orders', active: true }
    ];
    return (
      <PageTemplate
        sections={sections}
        name={name}
        nav='bars'
        alert={alert}
        onRefresh={this.onRefresh}
      >
        {venues.items &&
          <Message>
            <Message.Content>
              <TextInput
                value={search}
                name='search'
                placeholder='Search...'
                onChange={this.handleInputChange}
              />
              {venue !== null &&
                <DropDown
                  placeholder='Venue'
                  value={venue}
                  name='venue'
                  options={venues.items || []}
                  onChange={this.handleInputChange}
                />
              }
            </Message.Content>
          </Message>
        }
        {(orders.loading || venues.loading) &&
          <LoadingMessage loading={true}/>
        }
        {items &&
          <NoData data={items} />
        }
        {items &&
          <OrderList
            type='list'
            orders={items}
            hasMore={has_more}
            loadMore={this.handleLoadMore}
          />
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { orders, venues, authentication, alert } = state;
  const { user } = authentication;
  return {
    user,
    venues,
    orders,
    alert
  };
}

const connectedOrder = connect(mapStateToProps)(Orders);
export { connectedOrder as Orders };
