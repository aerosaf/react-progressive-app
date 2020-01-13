import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import Receipt from './Receipt';

class ReceiptList extends Component {
  
  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (e, { receipt }) => {
    history.push(`/sales/${receipt.receipt_id}`);
  }
  
  render() {
    return (
      <List divided relaxed>
        {this.props.receipts.map(receipt => (
          <Receipt
            key={receipt.receipt_id}
            receipt={receipt}
            handleItemClick={this.handleItemClick}
          />
        ))}
      </List>
    );
  }
}

function mapStateToProps(state) {
  const { receipt, authentication } = state;
  const { user } = authentication;
  return {
    user,
    receipt
  };
}

const connectedReceiptList = connect(mapStateToProps)(ReceiptList);
export { connectedReceiptList as ReceiptList };
