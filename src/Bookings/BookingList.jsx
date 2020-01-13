import React, { Component } from 'react';
import { List, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import Booking from './Booking';
import InfiniteScroll from 'react-infinite-scroller';

class BookingList extends Component {
  constructor(props) {
    super(props);
  }

  handleItemClick = (e, { booking }) => {
    history.push(`/bookings/${booking.id}`);
  };

  render() {
    const { reservations, loadMore } = this.props;
    const { items, has_more } = reservations;

    return (
      <InfiniteScroll
        className='infinite-scroll'
        loadMore={loadMore}
        hasMore={has_more}
        threshold={500}
        loader={<Loader active inline='centered' key={0}>Loading</Loader>}
      >
        <List divided relaxed>
          {items.map((booking) => (
            <Booking
              key={booking.id}
              booking={booking}
              handleItemClick={this.handleItemClick}
            />
          ))}
        </List>
      </InfiniteScroll>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, reservations } = state;
  const { user } = authentication;
  return {
    user,
    reservations
  };
}

const connectedBooking = connect(mapStateToProps)(BookingList);
export { connectedBooking as BookingList };
