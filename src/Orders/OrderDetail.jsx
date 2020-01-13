import React from 'react';
import { List, Grid } from 'semantic-ui-react';

function OrderDetail(props) {
  const { order, index } = props;
  let lineHeight = {
    lineHeight: '16px',
    margin: '1em',
    padding: '0.5em'
  };

  let redBackground = {
    backgroundColor: 'rgb(243, 61, 61)',
    color: 'white'
  }

  let greayBackground = {
    backgroundColor: 'grey',
    color: 'white'
  }
  
  return (
    <List.Item
      order={order}
      index={index}
      onKeyPress={props.handleItemClick}
      onClick={props.handleItemClick}
      className={(order.is_read ? '' : 'pending')}
      style={lineHeight}
    >
      <Grid>
        <Grid.Row style={(order.order_status == 'Pending') ? redBackground : greayBackground}  verticalAlign='middle'>
          <Grid.Column width={16}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}>
                  <div>Name</div>
                </Grid.Column>
                <Grid.Column width={11}>
                  <div>: {order.customer_name}</div>
                </Grid.Column>
                <Grid.Column width={5}>
                  <div>Order Time</div>
                </Grid.Column>
                <Grid.Column width={11}>
                  <div>: {order.order_time}</div>
                </Grid.Column>
                <Grid.Column width={5}>
                  <div>Table</div>
                </Grid.Column>
                <Grid.Column width={11}>
                  <div>: {(order.table) ? order.table : 'No table assigned.'}</div>
                </Grid.Column>
                <Grid.Column width={5}>
                  <div>Status</div>
                </Grid.Column>
                <Grid.Column width={11}>
                  <div>: {order.order_status}</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </List.Item>
  );
}

export default OrderDetail;
