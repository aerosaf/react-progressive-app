import React from 'react';
import { List, Grid, Icon, Label } from 'semantic-ui-react';
import { getStatusLabel, statusDisplay } from '../_helpers';

function Booking(props) {
  const { booking } = props;

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
      onKeyPress={props.handleItemClick}
      onClick={props.handleItemClick}
      booking={booking}
      style={lineHeight}
    >
      <Grid>
        <Grid.Row style={rowStyle} verticalAlign='middle' color={booking.booking_status == 'cancelled' ? 'red' : 'grey'}>
          <Grid.Column width={8}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Icon name='user' />
                </Grid.Column>
                <Grid.Column width={12}>
                  {booking.customer_name}
                </Grid.Column>
                <Grid.Column width={4}>
                  <Icon name='clock outline' />
                </Grid.Column>
                <Grid.Column width={12}>
                  {booking.arrival_time}
                </Grid.Column>
                <Grid.Column width={4}>
                  <Icon name='users' />
                </Grid.Column>
                <Grid.Column width={12}>
                  {booking.pax}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={8} textAlign='center'>
            <Label color={getStatusLabel(booking.booking_status)}>
              {statusDisplay(booking.booking_status)}
            </Label>
            {booking.table.data.name &&
              <p style={{ marginTop: '5px' }}>Table: {booking.table.data.name}</p>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </List.Item>
  );
}

export default Booking;
