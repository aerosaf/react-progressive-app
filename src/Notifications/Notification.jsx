import React from 'react';
import { List, Grid, Image } from 'semantic-ui-react';

function Notification(props) {
  const { notification, index } = props;
  return (
    <List.Item
      notification={notification}
      index={index}
      onKeyPress={props.handleItemClick}
      onClick={props.handleItemClick}
      className={(notification.is_read ? 'newNotif' : '')}
    >
      <Grid style={{ width: '100%' }}>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column className='list-column' width={4}>
            <Image className='thumbnail' src={notification.thumbnail} />
            </Grid.Column>
            <Grid.Column width={12}>
              <div className='title'>{notification.content}</div>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </List.Item>
  );
}

export default Notification;
