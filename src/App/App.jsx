import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions, userActions, venueActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { LoginPage } from '../LoginPage';
import { Notifications } from '../Notifications';
import { Bookings, BookingDetail } from '../Bookings';
import { Vouchers, VoucherBreakdown } from '../Vouchers';
import { Chat } from '../Chat';
import { ClosingInfo } from '../ClosingInfo';
import { Orders } from '../Orders';
import { SalesReport } from '../SalesReport';
import { sendbirdUserActions } from '../_sendbird_actions';


class App extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
  }

  componentDidMount() {
    const { dispatch, user, sendbird_user } = this.props;
    if (user) {
      this.loadVenues();
      if (user.sendbird_access_token) {
        if (!sendbird_user.loading) {
          dispatch(sendbirdUserActions.login(user.id, user.sendbird_access_token));
        }
      } else {
        dispatch(userActions.createSendBirdUser());
      }
    }
    const version = localStorage.getItem('app_version');
    if (version != process.env.APP_VERSION) {
      dispatch(userActions.logout);
      history.push('/');
    }
  }

  componentDidUpdate(prevProps) {
    this.loadVenues(prevProps.venues);
  }

  loadVenues = () => {
    const { venues, user } = this.props;

    if (user && !venues.loading) {
      if (!venues.items) {
        this.props.dispatch(venueActions.getVenues(1));
      } else {
        if (venues.has_more) {
          this.props.dispatch(venueActions.getVenues(venues.page + 1));
        }
      }
    }
  }

  render() {
    const paths = [
      { path: '/notifications', component: Notifications },
      { path: '/bookings', component: Bookings },
      { path: '/bookings/:id', component: BookingDetail },
      { path: '/vouchers', component: Vouchers },
      { path: '/vouchers/:id', component: VoucherBreakdown },
      { path: '/chat/:channel_url', component: Chat },
      { path: '/orders', component: Orders },
      { path: '/sales', component: SalesReport },
      { path: '/closing_info', component: ClosingInfo, type: ['manager', 'venue_owner'] }
    ];

    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/login" component={LoginPage} />
            {paths.map((path, key) => (
              <PrivateRoute key={key} exact path={path.path} component={path.component} />
            ))}
          </Switch>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { alert, authentication, sendbird_user, venues } = state;
  const { user } = authentication;
  return {
    alert,
    user,
    sendbird_user,
    venues
  };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 