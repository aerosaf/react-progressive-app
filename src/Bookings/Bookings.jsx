import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { LoadingMessage, PageTemplate, NoData } from '../App';
import { reservationActions } from '../_actions';
import { BookingList } from './BookingList';
import { formatDate, debounce } from '../_helpers';
import { sendbirdChannelActions } from '../_sendbird_actions';
import { DropDown, DatePicker, TextInput } from '../Input';

class Bookings extends Component {
  constructor(props) {
    super(props);

    props.dispatch(reservationActions.clearBooking());
    props.dispatch(sendbirdChannelActions.clearChannel());

    let date = ('setDate' in localStorage) ? localStorage.getItem('setDate') : formatDate(new Date()),
        venue = parseInt(localStorage.getItem('setVenue')),
        is_gem = 1,
        status = 'all',
        search = localStorage.getItem('setSearch');

    if (props.reservations.items) {
      date = props.reservations.date;
      venue = props.reservations.venue_id;
      is_gem = props.reservations.is_gem;
      status = props.reservations.status;
      search = props.reservations.keyword;
    }

    this.state = {
      venue: venue,
      date: date,
      is_gem: is_gem,
      status: status,
      search: search,
      page: 1
    };
  }

  componentDidMount() {
    const { venues, reservations } = this.props;
    let { venue } = this.state;
    let changes = false;
    if (venues.items && !venue) {
      venue = venues.items[0].value;
      changes = true;
    }

    this.setState({ venue: venue }, () => {
      if (!reservations.items || changes) {
        this.onLoad();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { venues } = this.props;
    const { venue, date } = this.state;

    if (!venue && venues.items) {
      const key = venues.items[0].key;
      localStorage.setItem('setVenue', key);
      localStorage.setItem('setDate', date);
      this.setState({ venue: key, page: 1 }, () => {
        this.onLoad();
      });
    }
  }

  handleCallChange = debounce (() => {
    this.setState({ page: 1 }, () => {
      this.onLoad();
    });
  }, 1000);

  handleLoadMore = () => {
    const { page } = this.state;
    this.setState({'page': page + 1}, () => {
      this.onLoad();
    });
  };

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      this.handleCallChange();
    });
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = 'set'+name;
    localStorage.setItem(name, value);
  }

  onRefresh = () => {
    return new Promise((resolve) => {
      this.setState({ page: 1 }, () => {
        this.onLoad();
        resolve(true);
      });
    });
  }

  onLoad = () => {
    const { venue, date, is_gem, search, status, page } = this.state;
    if (venue) {
      this.props.dispatch(reservationActions.getBookings(venue, date, is_gem, search, status, page));
    }
  }

  render() {
    const { venue, is_gem, date, status, search } = this.state;
    const { user, reservations, venues, alert } = this.props;

    const sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Bookings', content: 'Bookings', active: true }
    ];

    const types = [
      { text: 'GEM RESERVATION', value: 1, key: 1 },
      { text: 'WALK-IN RESERVATION', value: 0, key: 0 }
    ];

    const statuses = [
      { text: 'ALL', value: 'all', key: 0 },
      { text: 'PENDING', value: 'pending', key: 1 },
      { text: 'CONFIRMED', value: 'confirmed', key: 2 },
      { text: 'CHECKED_IN', value: 'checked_in', key: 3 },
      { text: 'CANCELLED', value: 'cancelled', key: 4 }
    ];

    return (
      <PageTemplate
        sections={sections}
        name={user.name}
        nav='bars'
        alert={alert}
        onRefresh={this.onRefresh}
      >
        {venues.items &&
          <Message>
            <Message.Content>
              <TextInput
                value={search ? search : ''}
                name='search'
                placeholder='Search...'
                onChange={this.handleInputChange}
              />
              <DropDown
                placeholder='Venue'
                value={venue}
                name='venue'
                options={venues.items || []}
                onChange={this.handleInputChange}
              />
              <DatePicker
                placeholder='Date'
                name='date'
                value={date}
                onChange={this.handleInputChange}
              />
              <DropDown
                placeholder='Customer Type'
                value={is_gem}
                name='is_gem'
                options={types}
                onChange={this.handleInputChange}
              />
              <DropDown
                placeholder='Status'
                value={status}
                name='status'
                options={statuses}
                onChange={this.handleInputChange}
              />
            </Message.Content>
          </Message>
        }
        {(reservations.loading || venues.loading) &&
          <LoadingMessage loading={true} />
        }
        {reservations.items &&
          <NoData data={reservations.items} />
        }
        {reservations.items &&
          <BookingList
            type='list'
            loadMore={this.handleLoadMore}
          ></BookingList>
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { reservations, authentication, venues, alert } = state;
  const { user } = authentication;
  return {
    user,
    reservations,
    venues,
    alert
  };
}

const connectedBooking = connect(mapStateToProps)(Bookings);
export { connectedBooking as Bookings };
