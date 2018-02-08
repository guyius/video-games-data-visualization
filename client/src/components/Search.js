import React, {Component} from 'react';
import './Search.css';

class Search extends Component {
	constructor() {
		super();
		this.state = { characterName: '' };
		this.searchCharacter = () => this.props.onSubmitName(this.state.characterName);
		this.handleChange = (e) => this.setState({characterName: e.target.value});
	}

	render() {
		return (
			<div className="search">
				<div className="search-header">
					<h2>Search your favorite characters from video games.</h2>
				</div>
				<input className="search-input" type="text"
					   placeholder="Enter character name"
					   value={this.state.characterName}
					   onChange={this.handleChange}
				/>
				<button className="search-button" onClick={this.searchCharacter}></button>
			</div>
		);
	}
}

export default Search;
