import React, { Component } from 'react';
import { Menu, Sidebar, Icon, Segment, Label } from 'semantic-ui-react';
import { history } from '../_helpers';
import { AlertBox, BreadcrumbSegment, SidebarNav } from '../App';
import { PullToRefresh, PullDownContent, ReleaseContent, RefreshContent } from 'react-js-pull-to-refresh';

class PageTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.visible == true) {
      document.addEventListener('keydown', this.handleKeyPress);
      document.querySelector('.pusher').addEventListener('click', this.handleSidebar);
    }
    else {
      document.removeEventListener('keydown', this.handleKeyPress);
      document.querySelector('.pusher').removeEventListener('click', this.handleSidebar);
    }
  }

  handleKeyPress = (e) => {
    if(e.keyCode === 27 && this.state.visible) {
      this.setState({ visible: false });
    }
  }

  handleSidebar = () => this.setState({ visible: !this.state.visible });
  
  goBack = () => history.goBack();

  render() {
    const { visible } = this.state;
    const { sections, name, nav, menu, alert } = this.props;
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    const list = children.filter(child => {
      return (child && child.props.type === 'list');
    });
    const content = children.filter(child => {
      return (child && child.props.type !== 'list');
    });
    let styleSegment = {
      border: 0,
      borderRadius: 0,
      padding: '0 0.5em',
      minHeight: '100vh',
      paddingTop: '46px'
    };
    let styleMenu = {
      border: 0,
      borderRadius: 0,
      transform: 'none'
    };
    let styleLabel = {
      borderRadius: '50%',
      position: 'absolute',
      top: '4px',
      right: '9px',
      zIndex: '-100',
      padding: '3px 5px',
      fontSize: '10px'
    };
    return (
      <Sidebar.Pushable style={styleMenu} as={Segment}>
        <Menu className='fixed mainBackgroundColor' inverted>
          {(nav === 'bars') &&
            <Menu.Item onClick={this.handleSidebar}>
              <Icon style={{ fontSize: '20px' }} name='bars' />
            </Menu.Item>
          }
          {(nav === 'angle-left') &&
            <Menu.Item onClick={this.goBack}>
              <Icon style={{ fontSize: '20px' }} name='angle left' />
            </Menu.Item>
          }
          {(menu && menu.length) &&
            menu.map((item, key) => (
              <Menu.Menu position={item.position} key={key}>
                <Menu.Item onClick={item.callback}>
                  {(item.label) ? (
                    <span>
                      <Icon style={{ fontSize: '20px' }} name={item.name} />
                      <Label style={styleLabel} className='secondaryBackgroundColor'>{item.label}</Label>
                    </span>
                  ) : (
                    <Icon style={{ fontSize: '20px' }} name={item.name} />
                  )}
                </Menu.Item>
              </Menu.Menu>
            ))
          }
          {this.props.onRefresh &&
            <Menu.Menu position='right'>
              <Menu.Item onClick={this.props.onRefresh}>
                <Icon style={{ fontSize: '20px' }} name='refresh' />
              </Menu.Item>
            </Menu.Menu>
          }
        </Menu>
        <SidebarNav visible={visible} handleSidebarHide={this.handleSidebar} />
        <Sidebar.Pusher dimmed={visible}>
          <Segment style={styleSegment}>
            {(sections || name) &&
              <BreadcrumbSegment sections={sections} name={name} />
            }
            {alert &&
              <AlertBox alert={alert} />
            }
            {content}
            {(this.props.onRefresh) ? (
              <PullToRefresh
                pullDownContent={<PullDownContent />}
                releaseContent={<ReleaseContent />}
                refreshContent={<RefreshContent />}
                pullDownThreshold={50}
                onRefresh={this.props.onRefresh}
                triggerHeight={1000}
                backgroundColor='white'
                startInvisible={true}
              >
                {list}
              </PullToRefresh>
            ) : (list)}
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export { PageTemplate };
