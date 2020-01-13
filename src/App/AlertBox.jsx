import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { ucFirst } from '../_helpers';

class AlertBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { alert } = this.props;
    const type = alert.type ? alert.type : 'info';
    return (
      <div style={{ marginBottom: '5px' }}>
        {alert.message &&
          <Message className={type}>
            <Message.Header>{ucFirst(type)}</Message.Header>
            <p>{alert.message}</p>
          </Message>
        }
      </div>
    );
  }
}

export { AlertBox };