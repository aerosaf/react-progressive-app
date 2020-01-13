import React, { Component } from 'react';
import { Segment, Header, Input, Form, Modal, Loader, Select, Button, Grid, List, Confirm, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { history, formatDate, myrToRm, ucFirst, getStatusLabel, statusDisplay } from '../_helpers';
import { floorPlanActions, reservationActions } from '../_actions';
import { LoadingMessage, PageTemplate } from '../App';
import { sendbirdService } from '../_services';
import { sendbirdChannelActions } from '../_sendbird_actions';

class BookingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvn_id: this.props.match.params.id,
      element_options: [],
      reservation: null,
      showConfirm: false,
      showAlreadyConfirmed: false,
      showMsg: false,
      unreadMsg: null,
      showSave: false,
      loading: false,
      showCancel: false
    };
  }

  componentDidMount() {
    const { rsvn_id } = this.state;
    this.props.dispatch(reservationActions.getBooking(rsvn_id));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { reservations, booking, floors, sendbird_channel, sendbird_msg } = nextProps;
    const { element_options, reservation, unreadMsg } = prevState;
    const { item } = booking;

    if (item && reservation === null) {
      nextProps.dispatch(floorPlanActions.getRelatedFloorPlan('venue_id', reservations.venue_id, item.booking_date));
      if (item.sendbird_channel_url) {
        nextProps.dispatch(sendbirdChannelActions.getChannel(item.sendbird_channel_url));
      }
      return { reservation: item };
    }

    if (sendbird_channel.item && unreadMsg === null) {
      return { unreadMsg: sendbird_channel.item.unreadMessageCount };
    }

    if (sendbird_channel.item && sendbird_msg.items) {
      return { unreadMsg: sendbird_channel.item.unreadMessageCount };
    }

    if (floors.items) {
      if (element_options.length === 0 && floors.items.length > 0) {
        return { element_options: floors.items[0].elements };
      }
    }

    return null;
  }

  handleInputChange = (e, { name, value }) => {
    let { reservation } = this.state;
    reservation[name] = value;
    this.setState({
      reservation: reservation,
      showSave: true
    });
  };
  
  handleFloorChange = (e, { value }) => {
    const { floors } = this.props;
    let { reservation } = this.state;
    const floor = floors.items.find(function(floor) {
      return floor.value == value;
    });
    reservation.table.data.floor_plan_id = value;
    this.setState({
      element_options: floor.elements,
      reservation: reservation,
      showSave: true
    });
  };

  handleTableChange = (e, { value }) => {
    const { element_options } = this.state;
    let { reservation } = this.state;
    const table = element_options.find(function(element) {
      return element.value == value;
    });
    reservation.table.data.name = table.text;
    reservation.table.data.floor_plan_element_id = value;
    this.setState({
      reservation: reservation,
      showSave: true
    });
  };

  submitChanges = () => {
    this.props.dispatch(reservationActions.updateBooking(this.state.reservation));
  };

  handleClickReceipt = ({ receipt }) => {
    history.push(`/sales/${receipt.id}`);
  };

  onMsg = () => {
    const { booking, sendbird_channel } = this.props;
    this.setState({ loading: true, showMsg: false }, () => {
      if (booking.item.sendbird_channel_url === null) {
        sendbirdService.createChannel(booking.item.id)
          .then(channel => {
            this.setState({ loading: false }, () => {
              history.push(`/chat/${channel}`);
              return;
            });
          });
      } else {
        if (sendbird_channel.error) {
          sendbirdService.addMember(booking.item.id)
            .then(response => {
              history.push(`/chat/${booking.item.sendbird_channel_url}`);
              return;
            });
        }
        history.push(`/chat/${booking.item.sendbird_channel_url}`);
      }
    });
  };

  openConfirm = () => {
    const { booking } = this.props;
    if (booking.item.is_confirmed) {
      this.setState({ showAlreadyConfirmed: !this.state.showAlreadyConfirmed });
    } else {
      this.setState({ showConfirm: !this.state.showConfirm });
    }
  };

  openCancel = () => {
    this.setState({ showCancel: !this.state.showCancel });
  };

  openMsg = () => {
    this.setState({ showMsg: !this.state.showMsg });
  };

  confirmBooking = (e) => {
    const { booking } = this.props;
    this.props.dispatch(reservationActions.confirmBooking(booking.item.id));
    this.setState({ showConfirm: false });
  };

  cancelBooking = (e, { content }) => {
    const { booking } = this.props;
    this.setState({ showCancel: false }, () => {
      this.props.dispatch(reservationActions.cancelBooking(booking.item.id, content));
    });
  };

  render() {
    const { element_options, reservation, showConfirm, showAlreadyConfirmed, showMsg, unreadMsg, showSave, loading, showCancel } = this.state;
    const { floors, alert, booking } = this.props;

    const menus = [
      { name: 'comments', position: 'right', label: unreadMsg, callback: this.openMsg }
    ];

    let sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Bookings', content: 'Bookings', href: '/bookings' },
      { key: 'Booking Detail', content: 'Booking Detail', active: true }
    ];
    return (
      <PageTemplate
        sections={sections}
        nav='angle-left'
        menu={menus}
        alert={alert}
      >
        {(booking.loading || loading) ? (
          <LoadingMessage loading={true} />
        ) : (
          (booking.item !== null && reservation) &&
            <Segment>
              <Form>
                <Form.Field>
                  <Grid>
                    <Grid.Column width={4}>Customer:</Grid.Column>
                    <Grid.Column width={12}>
                      {booking.item.customer_name}
                      <Label color={getStatusLabel(booking.item.booking_status)} style={{ float: 'right' }}>
                        {statusDisplay(booking.item.booking_status)}
                      </Label>
                    </Grid.Column>
                  </Grid>
                </Form.Field>
                <Form.Field>
                  <Grid>
                    <Grid.Column width={4}>Venue:</Grid.Column>
                    <Grid.Column width={12}>{booking.item.venue.data.venue_name}, {booking.item.venue.data.outlet_location}</Grid.Column>
                  </Grid>
                </Form.Field>
                <Form.Field>
                  <Grid>
                    <Grid.Column width={4}>Contact:</Grid.Column>
                    <Grid.Column width={12}>{booking.item.customer_contact}</Grid.Column>
                  </Grid>
                </Form.Field>
                <Form.Field>
                  <Grid>
                    <Grid.Column width={4}>Date:</Grid.Column>
                    <Grid.Column width={12}>{formatDate(new Date(booking.item.booking_day), ' ')}</Grid.Column>
                  </Grid>
                </Form.Field>
                <Form.Field>
                  <Grid>
                    <Grid.Column width={4}>Time:</Grid.Column>
                    <Grid.Column width={12}>{booking.item.arrival_time}</Grid.Column>
                  </Grid>
                </Form.Field>
                {((booking.item.sub_total - booking.item.discount_amount) > 0) ? [
                  <Form.Field key='1'>
                    <Grid>
                      <Grid.Column width={4}>Total:</Grid.Column>
                      <Grid.Column width={12}>{myrToRm(booking.item.currency)} {booking.item.sub_total - booking.item.discount_amount}</Grid.Column>
                    </Grid>
                  </Form.Field>,
                  <Form.Field key='2'>
                    <Grid>
                      <Grid.Column width={4}>Status:</Grid.Column>
                      <Grid.Column width={12}>{ucFirst(booking.item.payment_status)}</Grid.Column>
                    </Grid>
                  </Form.Field>
                ] : null}
                <Form.Field>
                  <label>Pax</label>
                  <Input type='number' name='pax' value={reservation.pax} onChange={this.handleInputChange} />
                </Form.Field>
                <Form.Field>
                  <label>Table</label>
                  <Modal trigger={<Input value={reservation.table.data.name || ''} />}>
                    <Modal.Header>Select a Table</Modal.Header>
                    <Modal.Content>
                      {floors.loading &&
                        <Loader active inverted inline='centered' className='modalLoader' />
                      }
                      {(floors.items && floors.items.length > 0) &&
                        <div>
                          <Select
                            placeholder='Select Floor'
                            fluid
                            search
                            selection
                            name='floor_plan_id'
                            value={reservation.table.data.floor_plan_id || floors.items[0].value}
                            options={floors.items}
                            onChange={this.handleFloorChange}
                            onClick={this.handleFloorChange}
                            className='inputMargin'
                          />
                          <Select
                            placeholder='Select Table'
                            fluid
                            search
                            selection
                            name='floor_plan_element_id'
                            value={reservation.table.data.floor_plan_element_id || floors.items[0].elements[0].value}
                            options={element_options}
                            onChange={this.handleTableChange}
                            onClick={this.handleTableChange}
                            className='inputMargin'
                          />
                        </div>
                      }
                    </Modal.Content>
                  </Modal>
                </Form.Field>
              </Form>
              <Modal trigger={
                <Segment>
                  <Header as='h5'>Booking Type</Header>
                  <div>{booking.item.booth.data.name ? booking.item.booth.data.name : 'Normal Booking'}</div>
                </Segment>
              }>
                <Modal.Header>Receipt</Modal.Header>
                <Modal.Content>
                  <List>
                    {booking.item.receipts.data.map((receipt, index) => (
                      <List.Item
                        key={index}
                        onClick={this.handleClickReceipt}
                        onKeyPress={this.handleClickReceipt}
                        receipt={receipt}
                      >
                        <Grid>
                          <Grid.Column width={8}>#{receipt.id}</Grid.Column>
                          <Grid.Column width={8}>{myrToRm(receipt.currency)} {receipt.actual_total.toFixed(2)}</Grid.Column>
                        </Grid>
                      </List.Item>
                    ))}
                  </List>
                </Modal.Content>
              </Modal>
              {booking.item.special_request &&
                <Segment>
                  <Header as='h5'>Special Request</Header>
                  <p>{booking.item.special_request}</p>
                </Segment>
              }
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Button fluid content='Confirm Booking' color='green' onClick={this.openConfirm} />
                  </Grid.Column>
                  <Grid.Column>
                    <Button fluid content='Cancel Booking' color='red' onClick={this.openCancel} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {showSave &&
                <Button fluid className='mainBackgroundColor' onClick={this.submitChanges} style={{ margin: '0.4em 0' }}>Save Changes</Button>
              }
            </Segment>
          )
        }
        <Confirm
          open={showConfirm}
          header='Booking Confirmation'
          content="Do you want to confirm this booking?"
          onCancel={this.openConfirm}
          onConfirm={this.confirmBooking}
        />
        <Modal
          open={showCancel}
          onClose={this.openCancel}
        >
          <Modal.Header>Booking Cancellation</Modal.Header>
          <Modal.Content>
            Are you sure you want to cancel your customer's booking?
            <Button fluid onClick={this.cancelBooking} content="Customer didn't show up" style={{ marginBottom: '0.2em' }} color='grey' />
            <Button fluid onClick={this.cancelBooking} content="Booking is cancelled" color='grey' />
          </Modal.Content>
        </Modal>
        <Confirm
          open={showMsg}
          header='Customer Chat'
          content="Do you want to chat with the customer?"
          onCancel={this.openMsg}
          onConfirm={this.onMsg}
        />
        <Modal
          open={showAlreadyConfirmed}
          onClose={this.openConfirm}
        >
          <Modal.Header>Booking Confirmation</Modal.Header>
          <Modal.Content>
            <Icon color='green' name='check' /> This booking has been confirmed.
          </Modal.Content>
        </Modal>
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { alert, reservations, floors, authentication, booking, sendbird_channel, sendbird_msg } = state;
  const { user } = authentication;
  return {
    alert,
    user,
    floors,
    reservations,
    booking,
    sendbird_channel,
    sendbird_msg
  }
}

const connectedBooking = connect(mapStateToProps)(BookingDetail);
export { connectedBooking as BookingDetail };
