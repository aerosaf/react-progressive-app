import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDate, debounce } from '../_helpers';
import { ReceiptList } from './ReceiptList';
import { FetchMsg } from '../SalesReport';
import { salesActions, venueActions } from '../_actions';
import { LoadingMessage, PageTemplate, NoData } from '../App';

class SalesReport extends Component {
  constructor(props) {
    super(props);

    let date =  ('setDate' in localStorage) ? localStorage.getItem('setDate') : formatDate(new Date()),
        venue = localStorage.getItem('setVenue')
    
    if (props.sales.items) {
      date = props.sales.date;
      venue = props.sales.venue;
    }
    
    this.state = {
      search: {
        target: '',
        found: ''
      },
      date: date,
      venue: venue
    };

    this.find = this.find.bind(this);
  }

  componentDidMount() {
    const { venues, sales } = this.props;
    let { date, venue } = this.state;
    let changes = false;

    if (venues.items) {
      if (!venue) {
        venue = venues.items[0].value;
        changes = true;
      }
      if ('setVenue' in localStorage && (venue !== parseInt(localStorage.getItem('setVenue')))) {
        venue = parseInt(localStorage.getItem('setVenue'));
        changes = true;
      }
      if ('setDate' in localStorage && (date != localStorage.getItem('setDate'))) {
        date = localStorage.getItem('setDate');
        changes = true;
      }
      this.setState({
        venue: venue,
        date: date
      }, () => {
        if (!sales.items || changes) {
          this.onLoad();
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { sales, venues } = this.props;
    const { venue, date } = this.state;
    if (!sales.items && !sales.loading && !venue && venues.items) {
      const key = venues.items[0].key;
      localStorage.setItem('setVenue', key);
      localStorage.setItem('setDate', date);
      this.setState({ venue: key, date: date }, () => {
        this.onLoad();
      });
    }
  }

  handleInputChange = (event, { name, value }) => {
    this.setState({ [name]: value }, () => {
      this.handleCallChange();
    });
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = 'set'+name;
    localStorage.setItem(name, value);
  }

  handleCallChange = debounce (() => {
    this.onLoad();
  }, 1000);

  onRefresh = () => {
    return new Promise((resolve) => {
      this.onLoad();
      resolve(true);
    });
  };

  onLoad = () => {
    const { date, venue } = this.state;
    this.props.dispatch(salesActions.getSalesReport(date, venue));
  };

  find(event) {
    this.setState({
      search: {
        target: event.target.value,
        found: this.filter(),
      },
    });
  }

  filter() {
    let receiptsFound = [];
    receiptsFound = this.props.sales.items
      .filter(
        receipt => (
          receipt.user_name.toLowerCase().indexOf(this.state.search.target.toLowerCase()) !== -1 ||
          receipt.receipt_id.toString().toLowerCase().indexOf(this.state.search.target.toString().toLowerCase()) !== -1
        )
      );

    return receiptsFound;
  }

  render() {
    const { venue, date, search } = this.state;
    const { user, sales, venues, alert } = this.props;
    const { name } = user;
    const sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Sales', content: 'Sales', active: true }
    ];

    return (
      <PageTemplate
        sections={sections}
        name={name}
        nav='bars'
        alert={alert}
        onRefresh={this.onRefresh}
      >
        <FetchMsg
          search={search}
          find={this.find}
          sales={sales || []}
          receipts={sales.items || []}
          date={date}
          venueSelect={venues.items || []}
          venue={venue}
          handleInputChange={this.handleInputChange}
        />
        {(sales.loading || venues.loading) &&
          <LoadingMessage loading={true} />
        }
        {sales.items &&
          <NoData data={sales.items} />
        }
        {sales.items &&
          <ReceiptList
            type='list'
            receipts={this.state.search.target ? this.state.search.found : sales.items}
          />
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { sales, authentication, venues, alert } = state;
  const { user } = authentication;
  return {
    user,
    sales,
    venues,
    alert
  };
}

const connectedSalesReport = connect(mapStateToProps)(SalesReport);
export { connectedSalesReport as SalesReport };
