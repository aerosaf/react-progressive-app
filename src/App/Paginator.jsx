import React, { Component } from 'react';
import { Pagination, Icon } from 'semantic-ui-react';

class Paginator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let paginationStyle ={
      textAlign: 'right'
    };

    return (
      <div style={paginationStyle}>
        <Pagination
          defaultActivePage={this.props.currentPage}
          ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
          firstItem={{ content: <Icon name='angle double left' />, icon: true }}
          lastItem={{ content: <Icon name='angle double right' />, icon: true }}
          prevItem={{ content: <Icon name='angle left' />, icon: true }}
          nextItem={{ content: <Icon name='angle right' />, icon: true }}
          totalPages={this.props.totalPages}
          boundaryRange='1'
          siblingRange='0'
          size='mini'
        />
      </div>
    );
  }
}

export { Paginator };