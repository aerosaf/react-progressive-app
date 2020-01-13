import React, { Component } from 'react';
import { DateInput } from 'semantic-ui-calendar-react';

class DatePicker extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { placeholder, value, name, onChange, label } = this.props;
    return (
      <DateInput
        className='inputMargin'
        fluid
        placeholder={placeholder}
        name={name}
        value={value}
        dateFormat={'DD-MMM-YYYY'}
        onChange={onChange}
        closable={true}
        hideMobileKeyboard={true}
        label={label}
      />
    );
  }
};

export { DatePicker };
