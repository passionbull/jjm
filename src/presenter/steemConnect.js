import sc2 from 'sc2-sdk';
// import Config from '../../config';

const api = sc2.Initialize({
  app: 'wp-steem-share',
  callbackURL: 'https://passionbull.github.io/jjm',
	accessToken: 'access_token',
	scope: ['vote', 'comment']
});

export default api;
