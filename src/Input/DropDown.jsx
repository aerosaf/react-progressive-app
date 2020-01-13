import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

class DropDown extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { placeholder, value, name, options, onChange } = this.props;
    return (
      <Dropdown
        className='inputMargin'
        fluid
        search
        selection
        placeholder={placeholder}
        value={value}
        name={name}
        options={options}
        onChange={onChange}
      />
    );
  }
};

export { DropDown };
