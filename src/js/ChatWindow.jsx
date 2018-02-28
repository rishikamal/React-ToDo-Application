import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

var config = {
   apiKey: "Enter your apiKey",
   authDomain: "Enter your authDomain",
   databaseURL: "Enter your databaseURL",
   projectId: "nannyshare-fde55",
   storageBucket:  "Enter your storageBucket",
   messagingSenderId: "Enter your messagingSenderId "
 };

class InputForm extends React.Component{
	render(){
		return(
			<div>
			<form id="inputForm" onSubmit={this.props.formProps.handleSubmitData}>
				<input type="text" id="messageData" value={this.props.formProps.inputVal} onChange={this.props.formProps.handleOnInputChange}/><input type="submit" value="Submit"/>
				</form>
			</div>
			)
	}
}

class ChatBox extends React.Component{
	render(){
		return(
				<div>
					<textarea value={this.props.boxProps.chatVal} cols="50" rows="10" maxLength="0"/>
				</div>
			)
	}
}

class ChatWindow extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			inputVal: "",
			chatVal: "",
			};
	this.handleSubmitData = this.handleSubmitData.bind(this);
	this.handleOnInputChange = this.handleOnInputChange.bind(this);
	};

	

	componentDidMount(){
		if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
    
             const messaging = firebase.messaging();


            messaging.requestPermission()
            .then(function() {
            console.log('Notification permission granted.');
                messaging.getToken()
                .then((currentToken) => {
                if (currentToken) {
                console.log("currentToken", currentToken)
                
                } 
                else {
                console.log("not allow permission")
                this.showNotificationPermission();
                }
                })
                .catch((err) => {
                console.log("error in get token", err)
                })
                })
            .catch(function(err) {
            console.log('Unable to get permission to notify.', err);
            });


          messaging.onTokenRefresh(function() {
            messaging.getToken()
            .then(function(refreshedToken) {
            console.log('Token refreshed.', refreshedToken);
           
            })
            .catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ', err);
            });
            });

            messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
            });
	}

	showNotificationPermission () {
      messaging.requestPermission()
        .then(() => {
          console.log('Notification permission granted.')
        })
        .catch((err) => {
          console.log('Unable to get permission to notify. ', err)
        })
    }

	componentWillUnmount(){

		this.socket.close();
	}

	handleSubmitData(event){
		this.socket.send(this.state.inputVal);
		this.setState({inputVal: ""});
		event.preventDefault();
	}

	handleOnInputChange(event){
		this.setState({inputVal: event.target.value });
	}

	render(){
		return(<div>
				<ChatBox boxProps={this.props} />
				<InputForm formProps={this.props}/>
				</div>
			)
	}
}

export default ChatWindow;