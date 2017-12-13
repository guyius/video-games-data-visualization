const express = require('express');
const fetch = require('node-fetch');
const app = express();
const secretKeyGiantBomb = '1535ae5f890104dbcd834dc1dc545b1fdbdd60ac';
const giantBombUrl = `https://www.giantbomb.com/api/search/?api_key=${secretKeyGiantBomb}&format=json`;
const giantBombUrlPlatform = `https://www.giantbomb.com/api/platforms/?api_key=${secretKeyGiantBomb}&format=json`;

app.set('port', process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.get('/api/platform/:name', (req, res) => {
	const name = req.params.name;
	console.log('name', name);
	const gameUrl = `${giantBombUrlPlatform}&filter=company:${name}`;
	console.log(gameUrl);
	return fetch(gameUrl)
		.then(response => response.json())
		.then(data => res.json(data.results));
});


app.listen(app.get('port'), () => {
	console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
