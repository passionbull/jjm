import sc2 from 'sc2-sdk';
// import Config from '../../config';

const api = sc2.Initialize({
  app: 'wp-steem-share',
  callbackURL: 'http://localhost:3000/admin/holders',
	accessToken: 'access_token',
	scope: ['vote', 'comment']
});

export default api;
