import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';

class LoadingMessage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Message icon>
        {
          this.props.loading &&
            <Icon name='circle notched' loading />
        }
        <Message.Content>
          {this.props.loading &&
            <div>
              <Message.Header>Just one second</Message.Header>
              We are fetching that content for you.
            </div>
          }
        </Message.Content>
      </Message>
    );
  }
}

export { LoadingMessage };