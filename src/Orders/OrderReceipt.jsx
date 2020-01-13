import React, { Component } from 'react';
import { connect } from 'react-redux';
import { orderActions } from '../_actions';
import { history } from '../_helpers';
import { Segment, Grid, Checkbox } from 'semantic-ui-react';
import { LoadingMessage, PageTemplate } from '../App';

class OrderReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt_id: props.match.params.id
    };
  }

  componentDidMount() {
    const { receipt_id } = this.state;
    this.props.dispatch(orderActions.getOrder(receipt_id));
  }

  imageExists(image_url) {
    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;
  }
  
  handleCheck = (e, menu_id, status) => {
    this.props.dispatch(orderActions.updateOrderStatus(menu_id));
  }

  render() {
    const { orderReceipt, alert } = this.props;
    const { detail } = orderReceipt;
    const { receipt_id } = this.state;

    let sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Orders', content: 'Orders', href: '/orders' },
      { key: 'Order Receipt', content: 'Order Receipt', active: true }
    ];
    let itemsStyle = {
      textAlign: 'center',
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
      <PageTemplate
        sections={sections}
        name={name}
        nav='angle-left'
        alert={alert}
      >
        {orderReceipt.loading &&
          <LoadingMessage loading={true} />
        }
        <Segment>
          {detail &&
            <Grid>
              <Grid.Row style={(detail.order_status == 'Pending') ? redBackground : greayBackground} verticalAlign='middle'>
                <Grid.Column width={16}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={5}>
                        <div>Name</div>
                      </Grid.Column>
                      <Grid.Column width={11}>
                        <div>: {detail.customer_name}</div>
                      </Grid.Column>
                      <Grid.Column width={5}>
                        <div>Order Time</div>
                      </Grid.Column>
                      <Grid.Column width={11}>
                        <div>: {detail.order_time}</div>
                      </Grid.Column>
                      <Grid.Column width={5}>
                        <div>Table</div>
                      </Grid.Column>
                      <Grid.Column width={11}>
                        <div>: {(detail.table) ? detail.table : 'No table assigned.'}</div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row >
                {detail.pending_orders &&
                  detail.pending_orders.map((item, index) => (
                    <Grid.Column style={itemsStyle} key={index} width={16}>
                      {/* {this.imageExists(`http://${item.image}`) &&
                        <Image style={thumbnailStyle} src={`http://${item.image}`} />
                      } */}
                      <Grid>
                        <Grid.Row>
                          <Grid.Column className='left aligned'>
                            {item.quantity} - {item.menu_name}
                          </Grid.Column>
                          <Grid.Column width={6}>
                            <Checkbox onClick={() => {this.handleCheck(event, item.menu_id, false)}} label={{ children: 'fulfilled' }} />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                ))}
                {detail.fufilled_orders &&
                  detail.fufilled_orders.map((item, index) => (
                    <Grid.Column style={itemsStyle} key={index} width={16}>
                      {/* {this.imageExists(`http://${item.image}`) &&
                        <Image style={thumbnailStyle} src={`http://${item.image}`} />
                      } */}
                      <Grid>
                        <Grid.Row>
                          <Grid.Column className='left aligned' width={10}>
                            {item.quantity} - {item.menu_name}
                          </Grid.Column>
                          <Grid.Column width={6}>
                            <Checkbox onClick={() => {this.handleCheck(event, item.menu_id, true)}} label={{ children: 'fulfilled' }} defaultChecked/>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          }
        </Segment>
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { alert, orders, orderReceipt, authentication } = state;
  const { user } = authentication;
  return {
    alert,
    orders,
    orderReceipt,
    user
  };
}

const connectedOrderReceipt = connect(mapStateToProps)(OrderReceipt);

export { connectedOrderReceipt as OrderReceipt };
