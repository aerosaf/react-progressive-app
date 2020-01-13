import React, { Component } from 'react';
import { List, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { orderActions } from '../_actions';
import OrderDetail from './OrderDetail';
import InfiniteScroll from 'react-infinite-scroller';

class OrderList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: this.props.orders
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { orders } = nextProps;
    let state_orders = prevState.orders;
    orders.map(function(item) {
      if (!state_orders.find(function(data) {
        return item.receipt_id == data.receipt_id;
      })) {
        state_orders.push(item);
      }
    });
    return { orders: state_orders };
  }

  handleItemClick = (event, { order, index }) => {
    history.push(`/orders/${order.receipt_id}`);
  }

  render() {
    return (
      <InfiniteScroll
        className='infinite-scroll'
        loadMore={this.props.loadMore}
        hasMore={this.props.hasMore}
        threshold={500}
        loader={<Loader active inline='centered' key={0}>Loading</Loader>}
      >
        <List divided relaxed>
          {this.state.orders.map((order, index) => (
            <OrderDetail
              key={order.receipt_id}
              order={order}
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
  const { authentication } = state;
  const { user } = authentication;
  return {
    user
  };
}

const connectedOrderList = connect(mapStateToProps)(OrderList);
export { connectedOrderList as OrderList };
