import React from 'react';
import { List, Grid, Image, Icon } from 'semantic-ui-react';
import { formatTime } from '../_helpers';

function Voucher(props) {
  const { voucher } = props;
  const gallery = voucher.gallery.data;
  return (
    <List.Item
      voucher={voucher}
      onKeyPress={props.handleItemClick}
      onClick={props.handleItemClick}
    >
      <Grid style={{ width: '100%' }}>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column className='list-column' width={4}>
            <Image className='thumbnail' src={gallery[0].thumbnail} />
            </Grid.Column>
            <Grid.Column width={12}>
              <div className='title'>{voucher.short_name}</div>
              <div className='info'><Icon name='money' />{voucher.price}</div>
              <div className='info'><Icon name='time' />{formatTime(voucher.redeemed_date)}</div>
              <div className='info'><Icon name='user circle' />{voucher.user.data.name}</div>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </List.Item>
  );
}

export default Voucher;
