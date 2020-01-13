import React from 'react';
import { connect } from 'react-redux';
import { Container, Button, Form, Grid, Segment, Message, Dimmer, Loader, Image } from 'semantic-ui-react';
import { userActions } from '../_actions';
import { history } from '../_helpers';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    localStorage.getItem('user') ? history.push('/bookings') : this.props.dispatch(userActions.logout());

    this.state = {
      username: '',
      password: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    const { dispatch } = this.props;
    if (username && password) {
      dispatch(userActions.login(username, password));
    }
  }

  render() {
    const { loggingIn, alert } = this.props;
    const { username, password, submitted } = this.state;
    const list = [];
    submitted && !username ? list.push('You must include both a upper and lower case letters in your password.') : '';
    submitted && !password ? list.push('Password is required.') : '';
    submitted && alert.message ? list.push(alert.message) : '';
    const styleLogo = {
      maxWidth: '60%',
      margin: '0 auto 10px auto'
    };

    return (
      <Container>
        <Grid coloumn={1} textAlign='center' verticalAlign='middle' style={{ height: '100vh'}}>
          <Grid.Column width="16" style={{ maxWidth: 450 }}>
            <Image style={styleLogo} src="/public/images/logo/gemlite-logo.png" />
            <Form name="form" onSubmit={this.handleSubmit} size='large'>
              <Segment>
                <Form.Input 
                  className={submitted && !username ? 'error' : ''}
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  type='text'
                  name='username'
                  value={username}
                  onChange={this.handleChange}
                />
                <Form.Input
                  className={submitted && !password ? 'error' : ''}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                  value={password}
                  onChange={this.handleChange}
                />
                <Button className='mainBackgroundColor' fluid size='large'>
                  Login
                </Button>
              </Segment>
              {loggingIn &&
                <Dimmer active inverted>
                  <Loader inverted />
                </Dimmer>
              }
            </Form>
            {submitted && list.length ? <Message error list={list} />: ''}
          </Grid.Column>
        </Grid>
      </Container>
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

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
