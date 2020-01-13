import React, { Component } from 'react';
import { Segment, Header, Divider, List } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { formatDate, formatTime, myrToRm } from '../_helpers';
import { LoadingMessage, PageTemplate } from '../App';
import { salesActions } from '../_actions';

class ReceiptBreakdown extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      receiptId: this.props.match.params.id
    }
  }

  componentDidMount() {
    this.props.dispatch(salesActions.getBreakdown(this.state.receiptId));
  }

  render() {
    const { receiptId } = this.state;
    const { receipt, alert } = this.props;
    const { item } = receipt;

    let sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Sales', content: 'Sales', href: '/sales' },
      { key: 'Receipt Detail', content: 'Receipt Detail', active: true }
    ];
    let alignLeft = {
      float: 'left'
    };
    let alignRight = {
      float: 'right'
    };
    let discountTag = {
      fontSize: 9,
      textDecoration: 'line-through'
    };
    let grandTotal = {
      backgroundColor: '#ffc307',
      padding: '1em 0.2em 0 0.2em'
    };

    return (
      <PageTemplate
        sections={sections}
        name={name}
        nav='angle-left'
        alert={alert}
      >
        {receipt.loading &&
          <LoadingMessage loading={receipt.loading} />
        }
        {item &&
          <Segment>
            <Header as='h5' textAlign='center'>Receipt ID: {receiptId}</Header>
            <Header as='h5' textAlign='center'>{item.user_name}</Header>
            <Header as='h5' textAlign='center'>Order Time: {formatDate(item.arrival_info, ' ')}, {formatTime(item.arrival_info)}</Header>
            <Divider />
            <Header as='h5'>Menu Order</Header>
            <Divider />
            <List>
              {item.orders.map((order, index) => (
                <List.Item key={index}>
                  <p style={alignLeft}>{order.qty}x {order.name}</p>
                  <p style={alignRight}>
                    {(order.discount_amount != '0.00') &&
                      <span style={discountTag}>{myrToRm(order.currency)} {order.orig_price}</span>
                    }
                    {myrToRm(order.currency)} {order.price}
                  </p>
                </List.Item>
              ))}
              <Divider />
              <List.Item>
                <p style={alignLeft}>Total</p>
                <p style={alignRight}>{myrToRm(item.currency)} {item.sub_total}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Tax ({item.tax_rate}%)</p>
                <p style={alignRight}>{myrToRm(item.currency)} {item.tax_amount}</p>
              </List.Item>
              <List.Item>
                <p style={alignLeft}>Service Charge ({item.service_charge_rate}%)</p>
                <p style={alignRight}>{myrToRm(item.currency)} {item.service_charge}</p>
              </List.Item>
              <Divider />
              <List.Item>
                <p style={alignLeft}>Rounding</p>
                <p style={alignRight}>{myrToRm(item.currency)} {item.rounding}</p>
              </List.Item>
              <List.Item style={grandTotal}>
                <p style={alignLeft}><strong>Grand Total</strong></p>
                <p style={alignRight}><strong>{myrToRm(item.currency)} {item.actual_total}</strong></p>
              </List.Item>
            </List>
          </Segment>
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { receipt, authentication, alert } = state;
  const { user } = authentication;
  return {
    user,
    receipt,
    alert
  };
}

const connectedReceiptBreakdown = connect(mapStateToProps)(ReceiptBreakdown);
export { connectedReceiptBreakdown as ReceiptBreakdown };
