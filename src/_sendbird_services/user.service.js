import Sendbird from 'sendbird';

const APP_ID = process.env.SENDBIRD_APP_ID;

export const sendbirdUserService = {
  connect
};

function connect(user_id, access_token) {
  return new Promise((resolve, reject) => {
    if (!user_id) {
      reject('UserID is required');
      return;
    }
    const sendbird = new Sendbird({ appId: APP_ID });
    sendbird.connect(user_id.toString(), access_token, (user, error) => {
      if (error) {
        reject('SendBird Login Failed.');
      } else {
        localStorage.setItem('sendbird_user', JSON.stringify(user));
        resolve(user);
      }
    });
  });
}
