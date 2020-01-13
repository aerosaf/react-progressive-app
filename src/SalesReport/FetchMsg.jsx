import React, { Component } from 'react';
import { Message, Grid } from 'semantic-ui-react';
import { myrToRm } from '../_helpers';
import { DropDown, DatePicker, TextInput } from '../Input';

class FetchMsg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0
    }
  }

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  }

  ob_size(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  total(receipts) {
    var total = 0;
    receipts.map(receipt => {
      total += parseFloat(receipt.actual_total)
    });
    return total;
  }

  render() {
    const infoStyle = {
      marginTop: '5px',
      marginLeft: '0',
      marginRight: '0'
    }
    const { date, venueSelect, venue, receipts } = this.props;
    return (
      <Message icon>
        <Message.Content>
          <TextInput
            placeholder="Search..." 
            value={!this.props.sales.loading ? this.props.search.target : ''} 
            onChange={this.props.find}
          />
          <DropDown
            placeholder='Select venue'
            value={venue}
            name='venue'
            options={venueSelect}
            onChange={this.props.handleInputChange}
          />
          <DatePicker
            placeholder='Date'
            name='date'
            value={date}
            onChange={this.props.handleInputChange}
          />
          <Grid columns={2} style={infoStyle}>
            <Grid.Row>
              <Grid.Column>
                <Message.Header>Total Sales</Message.Header>
                {(receipts.length > 0) &&
                  myrToRm(receipts[0].currency) + ' '
                }
                {this.formatMoney(this.total(receipts))}
              </Grid.Column>
              <Grid.Column>
                <Message.Header>Transaction</Message.Header>
                {this.ob_size(receipts)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Message.Content>
      </Message>
    );
  }
}
            
export { FetchMsg };