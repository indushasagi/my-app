import React, { Component } from 'react';
import './App.css';
import 'react-native-xml2js';
import axios from 'axios';
import convert from 'xml-js';

class BuildResult extends Component {
	render(){
		let tableData = <div>No data to show</div>;
		const works = this.props.resultData && this.props.resultData.results && this.props.resultData.results.work;
		if(works && works.length > 0)	{
			tableData = <div>
						{
							works.map((data, i) => {
								return (								
										<div className="resp" key={i}>
											<figure>
												<img src={data.best_book.image_url._text}/><br/>
											</figure>
												ID: {data.best_book.id._text} <br/>
												Title: {data.best_book.title._text} <br/> 
												Author: {data.best_book.author.name._text}<br/>
										</div>
								)
							})
						}
				</div>;
		}
		return (
			<div>
				{tableData}
			</div>
		);
	}
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
		let self = this;
		let xmlDoc;
		axios.get('http://cors-anywhere.herokuapp.com/https://www.goodreads.com/search.xml?key=WxrIkPORqNnXPgTZyxjQ&q=' + encodeURIComponent(this.state.book))
			.then((response) => {
				xmlDoc = response.data;
				let result1 = convert.xml2json(xmlDoc, { compact: true, spaces: 4 });
				let pjson = JSON.parse(result1);
				let goodRes = pjson.GoodreadsResponse;
				let search = goodRes.search;
				console.log(search);
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

				<div className="col-lg-12">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label> Search Book:</label>
							<input type="text" className="form-control search" id="search" placeholder="Search book by name" onChange={this.handleChange} /><br />
							<input type="submit" value="Submit" />
						</div>
					</form>
					<div>
						<BuildResult resultData={this.state.resu} />
					</div>
				</div>
			</div>
		);
	}
}



export default App;

