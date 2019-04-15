import React, { Component } from 'react';
import './App.css';
import 'react-native-xml2js';
import axios from 'axios';
import convert from 'xml-js';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {book: '',resu:[]};
    this.handleSubmit = this.handleSubmit.bind(this);
	this.handleChange = this.handleChange.bind(this);
  }
  
    handleChange(e){
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
	axios.get('http://cors-anywhere.herokuapp.com/https://www.goodreads.com/search.xml?key=WxrIkPORqNnXPgTZyxjQ&q='+encodeURIComponent(this.state.book))
	.then((response) => {
		xmlDoc = response.data;
		var result1 = convert.xml2json(xmlDoc, {compact: true, spaces: 4});
		console.log(result1);
		var pjson = JSON.parse(result1);
		var goodRes = pjson.GoodreadsResponse;
		var search = goodRes.search;
		var s = JSON.stringify(search);
		console.log(s);
		self.setState({resu:s});		
	}).catch((e) => 
	{
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
				<input type="text" className="form-control search" id="search" placeholder="Search book by name" onChange={this.handleChange}/><br/>
				<input type="submit" value="Submit" />
			</div>
		</form>
		{this.state.resu}
		
      </div>
    );
  }
}



export default App;
