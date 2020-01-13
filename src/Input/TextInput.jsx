import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

class TextInput extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { placeholder, value, name, onChange } = this.props;
    return (
      <Input
        className='inputMargin'
        fluid
        value={value}
        name={name}
        placeholder={placeholder}
        icon='search'
        onChange={onChange}
      />
    );
  }
};

export { TextInput };
