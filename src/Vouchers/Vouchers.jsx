import React, { Component } from 'react';
import { connect } from 'react-redux';
import { voucherActions } from '../_actions';
import { VoucherList } from './VoucherList';
import { Message, Grid } from 'semantic-ui-react';
import { LoadingMessage, PageTemplate, NoData } from '../App';
import { debounce } from '../_helpers';
import { DropDown, DatePicker } from '../Input';

class Vouchers extends Component {
  constructor(props) {
    super(props);
    const { vouchers } = props;

    const venue = parseInt(localStorage.getItem('setVenue')),
      date = ('setDate' in localStorage) ? localStorage.getItem('setDate') : formatDate(new Date());

    this.state = {
      venue: venue,
      from: vouchers.items ? vouchers.from : date,
      to: vouchers.items ? vouchers.to : date,
      page: vouchers.items ? vouchers.page : 1
    };
  }

  componentDidMount() {
    const { venues, vouchers } = this.props;
    let { venue } = this.state;
    let changes = false;

    if (venues.items && !venue) {
      venue = venues.items[0].value;
      changes = true;
    }

    this.setState({ venue: venue }, () => {
      if (!vouchers.items || changes) {
        this.onLoad();
      }
    });
  }

  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.onLoad();
    });
  }

  onRefresh = () => {
    return new Promise((resolve) => {
      this.setState({ page: 1 }, () => {
        this.onLoad();
        resolve(true);
      });
    });
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      this.handleCallChange();
    });
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = 'set'+name;
    localStorage.setItem(name, value);
  };

  handleCallChange = debounce (() => {
    this.onLoad();
  }, 1000);

  onLoad = () => {
    const { venue, page, from, to } = this.state;
    if (venue) {
      this.props.dispatch(voucherActions.getVouchers(venue, from, to, page));
    }
  };

  render() {
    const { user, vouchers, alert, venues } = this.props;
    const { venue, from, to } = this.state;
    const { items, total_price, total_transactions } = vouchers;
    const { name } = user;
    
    const sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Vouchers', content: 'Vouchers', active: true }
    ];

    let infoStyle = {
      marginTop: '5px',
      marginLeft: '0',
      marginRight: '0'
    }

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
              {venue !== null &&
                <DropDown
                  placeholder='Venue'
                  value={venue}
                  name='venue'
                  options={venues.items || []}
                  onChange={this.handleInputChange}
                />
              }
              <DatePicker
                placeholder='Date'
                name='from'
                value={from}
                onChange={this.handleInputChange}
                label='From'
              />
              <DatePicker
                placeholder='Date'
                name='to'
                value={to}
                onChange={this.handleInputChange}
                label='To'
              />
              <Grid columns={2} style={infoStyle}>
                <Grid.Row>
                  <Grid.Column>
                    <Message.Header>Total Sales</Message.Header>
                    {total_price}
                  </Grid.Column>
                  <Grid.Column>
                    <Message.Header>Transaction</Message.Header>
                    {total_transactions}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Message.Content>
          </Message>
        }
        {vouchers.loading &&
          <LoadingMessage loading={vouchers.loading} />
        }
        {items &&
          <NoData data={items} />
        }
        {items &&
          <VoucherList
            type='list'
            loadMore={this.handleLoadMore}
          />
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { vouchers, orders, authentication, alert, venues } = state;
  const { user } = authentication;
  return {
    user,
    orders,
    vouchers,
    alert,
    venues
  };
}

const connectedVoucher = connect(mapStateToProps)(Vouchers);
export { connectedVoucher as Vouchers };
