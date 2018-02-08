const express = require('express');
const fetch = require('node-fetch');
const db = require('./duplicate');
const app = express();
const headers = {'Client-ID': 'fld13kkhc4qyg1v4zrkam4pq1ya84l'};
const baseUrl = 'https://api.twitch.tv/helix';
app.set('port', process.env.PORT || 3001);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.get('/api/twitch/games', (req, res) => {
	getGamesFromTwitch(100).then(data => res.send(data));
});

app.get('/api/twitch/streamer', (req, res) => {
	getStreamersFromTwitch().then(data => res.send(data));
});

const getGamesFromTwitch = async (users) => {
	return fetch(`${baseUrl}/games/top?first=${users}`, {method: 'GET', headers: headers})
		.then(response => response.json())
		.then(data => data.data)
		.catch(err => err.json());
};

const getStreamersFromTwitch = async (gameId) => {
	const path = '/streams?first=100&type=live';
	const url = gameId ? `${baseUrl}${path}&game_id=${gameId}` : `${baseUrl}${path}`;
	return fetch(url, {method: 'GET', headers: headers})
		.then(response => response.json())
		.then(data => data.data)
		.catch(err => err.json());
};

const calcTotalViewers = (streamersList) => {
	return streamersList.reduce((prev, streamer) => {
		if (streamer && streamer.viewer_count) {
			return prev + streamer.viewer_count;
		}
	}, 0);
};

const calcTopStreamers = (topStreamersList) => {
	return topStreamersList.map(streamer => {
		return {
			name: streamer.user_id || null,
			lang: streamer.language || null,
			title: streamer.title || null,
			viewers: streamer.viewer_count || null,
			imgUrl: streamer.thumbnail_url || null
		};
	});

};

const mapGames = async (game) => {
	try {
		const streamersList = await getStreamersFromTwitch(game.id);
		const totalViewers = calcTotalViewers(streamersList);
		const topStreamersList = [streamersList[0], streamersList[1], streamersList[2]];
		const topStreamers = calcTopStreamers(topStreamersList);
		return {
			name: game.name,
			id: game.id,
			imgUrl: game.box_art_url,
			totalViewers,
			topStreamers
		};
	}
	catch (error) {
		return error;
	}
};

const generateData = async (games) => {
	return Promise.all(games.map((game) => mapGames(game)));
};

const getTwitchData = async () => {
	const topGames = await getGamesFromTwitch(30);
	const games = await generateData(topGames);
	db.writeGamesToDB({date: new Date(), games});
};

db.connectToDB((err) => {
	if (err) {
		console.log('###################### cant connect to db');
	} else {
		app.listen(app.get('port'), () => {
			getTwitchData();
			setInterval(getTwitchData, 5 * 60000);
		});
	}
});



// Normalize viewers Math.ceil(totalViewersBeforeNormalize + (totalViewersBeforeNormalize * 0.03));