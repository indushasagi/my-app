import React, { Component } from 'react';
import './App.css';
import 'react-native-xml2js';
import axios from 'axios';
import convert from 'xml-js';

function BuildResult(props) {
	let tableData = <div>No data to show</div>;
	const works = props.resultData && props.resultData.results && props.resultData.results.work && props.resultData.results.work;
	if(works && works.length > 0)	{
		tableData = <table>
				<thead>
					<tr>
						<td>ID</td>
						<td>Book</td>
						<td>Author</td>
					</tr>
				</thead>
				<tbody>
					{
						works.map((data, i) => {
							return (
								<tr key={i}>
									<td>{data.best_book.id._text}</td>
									<td>{data.best_book.title._text}</td>
									<td>{data.best_book.author.name._text}</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>;
	}
	return (
		<div>
			{tableData}
		</div>
	);
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { book: '', resu: {} };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		const target = e.target;
		const value = target.value;

		this.setState({
			book: value
		});
	};

	handleSubmit(event) {
		event.preventDefault();
		var self = this;
		var xmlDoc;
		axios.get('http://cors-anywhere.herokuapp.com/https://www.goodreads.com/search.xml?key=WxrIkPORqNnXPgTZyxjQ&q=' + encodeURIComponent(this.state.book))
			.then((response) => {
				xmlDoc = response.data;
				var result1 = convert.xml2json(xmlDoc, { compact: true, spaces: 4 });
				var pjson = JSON.parse(result1);
				var goodRes = pjson.GoodreadsResponse;
				var search = goodRes.search;
				self.setState({ resu: search });
			}).catch((e) => {
				console.error(e);
			});
	}



	render() {
		return (
			<div className="App">
				<header className="App-header">
					<p>Search Book By Name</p>
				</header>
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label> Search Book:</label>
						<input type="text" className="form-control search" id="search" placeholder="Search book by name" onChange={this.handleChange} /><br />
						<input type="submit" value="Submit" />
					</div>
				</form>
				<BuildResult resultData={this.state.resu} />

			</div>
		);
	}
}



export default App;

