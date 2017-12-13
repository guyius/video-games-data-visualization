import React, {Component} from 'react';
import './Search.css';

class Search extends Component {
	constructor() {
		super();
		this.state = { companyName: '' };

		this.searchCompany = () => {
			this.props.onSubmitName(this.state.companyName);
		};

		this.handleChange = (e) => {
			this.setState({companyName: e.target.value});
		};
	}

	render() {
		return (
			<div className="search">
				<div className="search-header">
					<h2>Search consoles from your favorite companies.</h2>
				</div>
				<input className="search-input" type="text"
					   placeholder="Enter company name"
					   value={this.state.companyName}
					   onChange={this.handleChange}
				/>
				<button className="search-button" onClick={this.searchCompany}></button>
			</div>
		);
	}
}

export default Search;
