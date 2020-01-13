import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

class DimLoader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { alert } = this.props;
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }
}

export { DimLoader };