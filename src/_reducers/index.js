import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
//import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { sales, receipt } from './sales.reducer';
import { venues, closing_info } from './venue.reducer';
import { notifications } from './notification.reducer';
import { orders, orderReceipt } from './order.reducer';
import { reservations } from './reservations.reducer';
import { booking } from './booking.reducer';
import { floors } from './floor-plan.reducer';
import { vouchers } from './voucher.reducer';
import { sendbird_msg, sendbird_channel, sendbird_user } from './sendbird.reducer';


const rootReducer = combineReducers({
  authentication,
 // users,
  orders,
  orderReceipt,
  alert,
  sales,
  receipt,
  venues,
  notifications,
  reservations,
  floors,
  booking,
  vouchers,
  sendbird_msg,
  sendbird_channel,
  sendbird_user,
  closing_info
});

export default rootReducer;