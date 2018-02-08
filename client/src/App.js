import React, {Component} from 'react';
import './App.css';
import Search from './components/Search';
//const endPointGames = '/api/twitch/games';
const endPointStreamers = '/api/twitch/streamer';

class App extends Component {
	constructor() {
		super();
		this.state = {streamers: []};
		this.getStreamers = () => {
			return fetch(endPointStreamers)
				.then((res) => res.json())
				.then(streamers => streamers.map(streamer => streamer.thumbnail_url.replace(/{width}x{height}/, '320x240')))
				.then(streamers => streamers.map(streamer => {
					streamer.duration = this.calculateStreamDuration(streamer);
				}))
				.then(streamers => this.setState({streamers}))
				.catch(err => {
					throw new Error(err);
				});
		};

		this.calculateStreamDuration = (streamer) => {
			const current = new Date();
			const duration = current - streamer.started_at;
			return duration;
		};

		this.handleInput = () => this.getStreamers();
	}

	render() {
		return (
			<div className="App">
				<Search onSubmitName={this.handleInput}/>
				<div className="game-container">
				{ this.state.streamers.length &&
					this.state.streamers.map(streamer => <Game key={streamer.user_id} streamer={streamer}/>)
				}
				</div>
			</div>
		);
	}
}

const Game = (props) => <div className="streamer">
	<figure>
		<figcaption>{props.streamer.user_id}</figcaption>
		<img src={props.streamer.thumbnail_url} alt=""/>
		<p>{props.streamer.viewer_count}</p>
		<p>{props.streamer.title}</p>
		<p>{props.streamer.language}</p>
		<p>{() => this.calculateStreamDuration(props.streamer)}</p>
	</figure>
</div>;
export default App;
