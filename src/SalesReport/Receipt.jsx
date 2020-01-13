import React from 'react';
import { List, Grid, Icon } from 'semantic-ui-react';
import { myrToRm } from '../_helpers';

function Receipt(props) {
  const { receipt } = props;
  let lineHeight = {
    lineHeight: '20px',
    margin: '1em',
    padding: '0.5em'
  };

  let rowStyle = {
    borderRadius: '16px',
    border: 'none',
    margin: '5px 0'
  };

  return (
    <List.Item
      receipt={receipt}
      onKeyPress={props.handleItemClick}
      onClick={props.handleItemClick}
      style={lineHeight}
    >
      <Grid>
        <Grid.Row verticalAlign='middle' style={rowStyle} color='grey'>
          <Grid.Column width={8}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Icon name='file alternate outline' />
                </Grid.Column>
                <Grid.Column width={12}>
                  {receipt.receipt_id}
                </Grid.Column>
                <Grid.Column width={4}>
                  <Icon name='user' />
                </Grid.Column>
                <Grid.Column width={12}>
                  {receipt.user_name}
                </Grid.Column>
                <Grid.Column width={4}>
                  <Icon name='dollar' />
                </Grid.Column>
                <Grid.Column width={12}>
                  {myrToRm(receipt.currency) + ' ' + receipt.actual_total}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </List.Item>
  );
}

export default Receipt;
