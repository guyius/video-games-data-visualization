import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Search from './components/Search';

class App extends Component {
	constructor() {
		super();

		this.getGameByName = (companyName) => {
			fetch(`/api/platform/${companyName}`)
				.then((res) => res.json())
				.then(data => data)
				.catch(err => {
					throw new Error(err);
				});
		};

		this.handleInput = (companyName) => {
			this.getGameByName(companyName);
		};
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>Welcome to React</h2>
				</div>
				<Search onSubmitName={this.handleInput}/>
			</div>
		);
	}
}

export default App;
