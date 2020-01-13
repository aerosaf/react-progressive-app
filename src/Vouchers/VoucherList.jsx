import React, { Component } from 'react';
import { List, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import Voucher from './Voucher';
import InfiniteScroll from 'react-infinite-scroller';

class VoucherList extends Component {
  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (event, { voucher }) => {
    const url = `vouchers/${voucher.user_voucher_id}`;
    history.push(url);
  };

  render() {
    const { vouchers, loadMore } = this.props;
    const { items, has_more } = vouchers;
    return (
      <InfiniteScroll
        className='infinite-scroll'
        loadMore={loadMore}
        hasMore={has_more}
        threshold={500}
        loader={<Loader active inline='centered' key={0}>Loading</Loader>}
      >
        <List divided relaxed>
          {items.map((voucher) => (
            <Voucher
              key={voucher.user_voucher_id}
              voucher={voucher}
              handleItemClick={this.handleItemClick}
            />
          ))}
        </List>
      </InfiniteScroll>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, vouchers } = state;
  const { user } = authentication;
  return {
    user,
    vouchers
  };
}

const connectedVoucherList = connect(mapStateToProps)(VoucherList);
export { connectedVoucherList as VoucherList };
