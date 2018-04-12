import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, NavLink, Route, Link} from 'react-router-dom';
import ToDo from './todo.jsx';

class Client extends React.Component{

	render(){
		return(
			<h4 className="center-align card-panel teal lighten-2"> Welcome to ToDo Application</h4>
			)
	}
}

ReactDOM.render(<div > <Client/> <ToDo /></div> , document.getElementById("root"));
