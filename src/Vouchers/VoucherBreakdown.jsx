import React, { Component } from 'react';
import { Segment, Header, Divider, List, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { PageTemplate } from '../App';
import { formatTime, formatDate } from '../_helpers';

class VoucherBreakdown extends Component {
  constructor(props) {
    super(props)
    let voucherObj = {};
    
    // Get relevet object
    for (var i = 0; i < props.vouchers.items.length; i++){
      if (props.vouchers.items[i].user_voucher_id == props.history.location.pathname.split('/')[2]){
         voucherObj = props.vouchers.items[i];
      }
    }
    this.state = {
      voucher: voucherObj
    };
  }
  

  render() {
    const { voucher } = this.state;
    const { alert } = this.props;
    const gallery = voucher.gallery.data;
    let thumbnailStyle = {
      borderRadius: '50%',
      height: 60,
      width: 60,
      marginLeft: '0.5em'
    };
    let sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Vouchers', content: 'Vouchers', href: '/vouchers' },
      { key: 'Voucher Detail', content: 'Voucher Detail', active: true }
    ];
    let alignLeft = {
      float: 'left'
    };
    let alignRight = {
      float: 'right'
    };
    return (
      <PageTemplate
        sections={sections}
        name={name}
        nav='angle-left'
        alert={alert}
      >
        {voucher &&
          <Segment>
            <Header as='h5' textAlign='center'>User Voucher ID: {voucher.user_voucher_id}</Header>
            <Header as='h3' textAlign='center'>{voucher.user.data.name}</Header>
            <Divider />
            <List>
              <List.Item>
                <p style={alignLeft}>Title:</p>
                <p style={alignRight}>{voucher.short_name}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Info:</p>
                <p style={alignRight}>{voucher.name}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Date:</p>
                <p style={alignRight}>{formatDate(voucher.redeemed_date, ' ')}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Time:</p>
                <p style={alignRight}>{formatTime(voucher.redeemed_date)}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Price:</p>
                <p style={alignRight}>{voucher.price}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Quantity:</p>
                <p style={alignRight}>{voucher.quantity}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Description:</p>
                <p style={alignRight}>{voucher.short_description}</p>
              </List.Item>
            </List>
          </Segment>
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { vouchers, authentication, alert } = state;
  const { user } = authentication;
  return {
    user,
    vouchers,
    alert
  };
}

const connectedVoucherBreakdown = connect(mapStateToProps)(VoucherBreakdown);
export { connectedVoucherBreakdown as VoucherBreakdown };
