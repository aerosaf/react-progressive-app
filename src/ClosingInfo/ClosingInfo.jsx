import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageTemplate, LoadingMessage, NoData } from '../App';
import { venueActions } from '../_actions';
import { debounce } from '../_helpers';
import { Message, Input, Form, Segment, Button } from 'semantic-ui-react';
import { formatDate } from '../_helpers';
import { DropDown, DatePicker } from '../Input';

class ClosingInfo extends Component {
  constructor(props) {
    super(props);

    let venue = parseInt(localStorage.getItem('setVenue')),
      date = ('setDate' in localStorage) ? localStorage.getItem('setDate') : formatDate(new Date());
    
    this.state = {
      venue: venue,
      date: date,
      fields: this.props.closing_info.items
    };
  }

  componentDidMount() {
    const { venues, closing_info } = this.props;
    let { venue } = this.state;

    if (venue.items && !venue) {
      venue = venues.items[0].value;
    }

    this.setState({ venue: venue }, () => {
      if (!closing_info.items) {
        this.onLoad();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { closing_info } = this.props;
    const prev_closing_info = prevProps.closing_info;

    if ((closing_info.venue !== prev_closing_info.venue) || (closing_info.date !== prev_closing_info.date)) {
      this.setState({ fields: closing_info.items });
    }
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      this.handleCallChange();
    });
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = 'set'+name;
    localStorage.setItem(name, value);
  };
  
  handleFieldChange = (e, { name, value }) => {
    const items = this.state.fields.map(field => {
      if (field.param_name === name) {
        return { ...field, value: value };
      }
      return field;
    });
    this.setState({ fields: items });
  };

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
    const { venue, date } = this.state;
    this.props.dispatch(venueActions.getClosingInfoForm(venue, date));
  };

  submitForm = () => {
    const { venue, date, fields } = this.state;
    this.props.dispatch(venueActions.submitClosingInfo(venue, date, fields));
  };

  render() {
    const { user, closing_info, venues, alert } = this.props;
    const { venue, date, fields } = this.state;
    const { name } = user;
    const sections = [
      { key: 'Home', content: 'Home', href: '/' },
      { key: 'Closing Info', content: 'Closing Info', active: true }
    ];
    const removeOpacity = {
      opacity: 1
    }
    return (
      <PageTemplate
        sections={sections}
        name={name}
        nav='bars'
        alert={alert}
        onRefresh={this.onRefresh}
      >
        {venues.items &&
          <Message>
            <Message.Content>
              {venue !== null &&
                <DropDown
                  placeholder='Venue'
                  value={venue}
                  name='venue'
                  options={venues.items || []}
                  onChange={this.handleInputChange}
                />
              }
              <DatePicker
                placeholder='Date'
                name='date'
                value={date}
                onChange={this.handleInputChange}
              />
            </Message.Content>
          </Message>
        }
        {closing_info.loading &&
          <LoadingMessage loading={true}/>
        }
        {(!closing_info.loading && fields) &&
          <div style={{ marginBottom: 5 }}>
            <NoData data={fields} />
            {(Object.keys(fields).length > 0) &&
            <Segment>
              <Form>
                {fields.map((item, key) => (
                  <Form.Field key={key}>
                    <label>{item.title}</label>
                    <Input
                      style={removeOpacity}
                      disabled={!closing_info.is_editable}
                      value={item.value ? item.value : ''}
                      name={item.param_name}
                      onChange={this.handleFieldChange}
                    />
                  </Form.Field>
                ))}
                {closing_info.is_editable &&
                  <Button fluid className='mainBackgroundColor' onClick={this.submitForm} style={{ marginBottom: '0.2em' }} disabled={!closing_info.is_editable}>Save</Button>
                }
              </Form>
            </Segment>
            }
          </div>
        }
      </PageTemplate>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, venues, closing_info, alert } = state;
  const { user } = authentication;
  return {
    user,
    venues,
    closing_info,
    alert
  };
}

const connectedClosingInfo = connect(mapStateToProps)(ClosingInfo);

export { connectedClosingInfo as ClosingInfo };
