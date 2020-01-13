import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';

class NoData extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const nodataStyle = {
      textAlign: 'center'
    }
    return (
      Object.keys(this.props.data).length === 0 &&
        <Message style={nodataStyle} icon>
          <Message.Content>
            No data available
          </Message.Content>
        </Message>
    );
  }
}

export { NoData };