import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { Segment, Breadcrumb, Label } from 'semantic-ui-react';
import { history } from '../_helpers';

class BreadcrumbSegment extends Component {
  constructor(props) {
    super(props);
  }

  handleLogOut = (e) => {
    this.props.dispatch(userActions.logout());
    // history.push('/login')
    window.location.replace("/login");
    // window.location.reload();
  }

  render() {
    const breadCrum = {
      fontSize: '1.2em',
      float: 'right',
      position: 'relative',
      top: '4px',
      color: 'blue',
    };
    let segmentStyle = {
      marginTop: '5px'
    };
    let { sections, name } = this.props;
    return (
      <Segment raised style={segmentStyle}>
        <Breadcrumb icon='right angle' sections={sections}></Breadcrumb>
        {name &&
          <Label className='noBorder' size='small' basic attached='top right'>
            <div>Hi, {name}</div>
            <a style={breadCrum} onClick={this.handleLogOut}>Logout</a>
          </Label>
        }
      </Segment>
    );
  }
}


function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  const { alert } = state;
  return {
      loggingIn,
      alert
  };
}

const connectedBreadcrumbSegment = connect(mapStateToProps)(BreadcrumbSegment);
export { connectedBreadcrumbSegment as BreadcrumbSegment }; 