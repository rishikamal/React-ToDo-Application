import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import dateformat from "dateformat";


var sTime= "";
var eTime= "";

var dt = new Date();
dt.setHours(new Date().getHours(), new Date().getMinutes()+10);

var date = "";
var elapsed = 0;
var selected= "";
var id= null;
var timerID;
var timerStartedBy= null;

class AddRow extends React.Component{			
	constructor(props){
		super(props);
	}

	render(){

		if(this.props.taskData){
			var newProps = this.props;
			var buttons;
			var runTimer;
		    var tasklist = this.props.taskData.map(function(i,index){			// Create object of tasks 

		    if(i.status== "in_progress"){
		    	buttons= <input style={{margin : "10px"}} type="button" className="btn btn-secondary btn-sm" id={i.id} value="Stop" onClick={newProps.stopTimer} />
		    	runTimer= <p id={i.id} style={{marginLeft : "20px"}} > Timer: <strong>{newProps.time}</strong> </p>

		    }

		    else if(i.status == "ready_for_qa" || i.status == "closed"){
		    	buttons= ""
		    	runTimer= ""
		    }

		    else{
		    	buttons = <div> <input style={{margin : "10px"}} type="button" className="btn btn-danger btn-sm" id={i.id} value="X" onClick={newProps.delTask}/>
		 		<input type="button" style={{margin : "10px"}} className="btn btn-primary btn-sm" id={i.id} value="Edit" onClick={newProps.editTask}/>
		 		</div>
		 		runTimer= ""
		    }
		    	

		 	return(
		 		<tr>
		 			<td>
				 		<p id={i.id} key={index} >{index + 1}: {i.task_name} </p>
				 		<select className="form-control form-control-sm" id={i.id} defaultValue={i.status} onChange={newProps.onSelectValue} >
				 			<option value="new">New</option>
				 			<option value= "in_progress">In progress</option>
				 			<option value= "ready_for_qa">Ready for QA</option>
				 			<option value= "closed">Closed</option>
				 		</select>
				 		<div className="col-sm" >
					 		<input type="button" style={{margin : "10px"}} className="btn btn-success btn-sm" id={i.id} value="Go" onClick={newProps.addStatus}  />	 				 		
					 		{buttons}
				 		</div>
				 		<div className="form-group col-sm" >
					 	<label style={{margin : "20px"}}>Date: {i.startDate} Time: {i.startTime} - {i.endTime}</label><br/>
					 		{runTimer}
					 	</div>
				 	</td>
		 		</tr>
		 		
		 		)
		 })
		}

		return(
		
			 	
				<div>
				<h5 >Current Task List:</h5>
					<table className="striped responsive-table">
						<tbody>
						{tasklist} 
						</tbody>
					</table>					
			 				
			 	</div>					
		)	
	}
}


class InputTask extends React.Component{ 		//Input form for adding task
	constructor(props){
		super(props);

	}

	render(){

		return(
			<div className="container">
					<form onSubmit={this.props.addToList} method="POST" className="form-control-sm" style={{marginTop : "20px"}}>
						<div className="form-group">
							<label className=" control-label" >Task:</label>
							<input type="text" id="taskInput" value={this.props.val} onChange= {this.props.onSetVal}  required/>
						</div>	
						<div className="form-group">
							<label className="inputDateTime control-label" >Start Date:</label>
							<input type="date" id="inputDate" name="startDate" min={dateformat(new Date(),"yyyy-mm-dd")} onChange={this.props.onChangeStartDate}  required />
						</div>
						<div className="form-group">
							<label className=" control-label">Start Time:</label>
							<input type="time" id="inputSTime"  name="startTime" min={dateformat(new Date(), "HH:MM")}  onChange={this.props.onChangeStartTime}  required />
						</div>
						<div className="form-group">
							<label className=" control-label" >End Time:</label>
							<input type="time" id="inputETime" name="endTime" min={dateformat(dt, "HH:MM")}  onChange={this.props.onChangeEndTime} required/>
						</div>
						<div className="form-group">
							<label className="control-label" ></label>
							<button type="submit" className="btn btn-primary btn-sm" id="add-to-list" value="Add to List" >Add to List</button> 
						</div>
						<div className="form-group">
							<label className=" control-label" ></label>
							<input type="button" className="btn btn-primary btn-sm" id="save-task" value="Save" onClick={this.props.setNewData} style={{display: 'none'}}/>
						</div>
					</form>
			</div>
			)
	}
} 


class ToDo extends React.Component{ 				// Main Component
	constructor(props){
		super(props);
		this.state= {
					taskList : [],
					taskVal : "",
					time: "",
					}
		this.onSetVal = this.onSetVal.bind(this); 							//set taskVal state
		this.addToList = this.addToList.bind(this);							//Add task to the tasklist array of objects and display
		this.deleteTask = this.deleteTask.bind(this);						//Delete a tasklist
		this.onEditTask = this.onEditTask.bind(this);						// Edit a task and show/hide certain buttons & labels
		this.setNewData = this.setNewData.bind(this);						// Set new task name, start time and end time
		this.onChangeStartDate = this.onChangeStartDate.bind(this);			// Set start date
		this.onChangeStartTime = this.onChangeStartTime.bind(this);			// set start Time
		this.onChangeEndTime = this.onChangeEndTime.bind(this);				// set end time
		this.selectedValue = this.selectedValue.bind(this);					// set selected as status value onchange event
		this.addStatus = this.addStatus.bind(this); 						// add status value of selected to the task object in TaskList
		this.startTimer = this.startTimer.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.componentRemoval = this.componentRemoval.bind(this);
	}

	componentDidMount(){
		
			window.addEventListener('beforeunload', this.componentRemoval);
			if (localStorage['taskList']){
				var update = JSON.parse(localStorage['taskList']);

				var newupdate = update.map(function(task, index){
					if(task.status == "in_progress"){
						var et= task.endTime.split(":");
						var h = Number(et[0]);
						var m = Number(et[1]);
						var d = new Date();
						d.setHours(h,m);					
						var curr = new Date();
						if(d.toLocaleTimeString() < curr.toLocaleTimeString()){
							task.status = "ready_for_qa";
							task.completed = true;
							task.startTime = "Task Time Over";
							task.endTime = "Task Time Over"
						}
					}
				})
				
				this.setState({ taskList : update});
			}

	}


	componentWillUnmount() {
        this.componentRemoval();
        window.removeEventListener('beforeunload', this.componentRemoval); // remove the event handler for normal unmounting
    }

	componentRemoval(){
		var update = this.state.taskList;
		if(timerStartedBy != null){
			update[timerStartedBy].elapsedTime = elapsed;
			this.setState({taskList: update}, function(){
				localStorage["taskList"] = JSON.stringify(update);
			}); 
		}
			
	}
/*
	elapsedTime(diff){

		diff /= 1000; // remove miliseconds	
		diff = Math.floor(diff / 60); // remove seconds from the date		
		var minutes = Math.round( diff % 60);  // get minutes	
		diff = Math.floor(diff / 60);	// remove minutes from the date	
		var hours = Math.round(diff % 24); // get hours
		return(hours + " : " + minutes);

	}
*/
	startTimer(eventId){
		timerStartedBy = eventId;
		var that = this;
		var update = this.state.taskList;
		
		var et= update[eventId].endTime.split(":");
		var et_h = Number(et[0]);
		var et_m = Number(et[1]);
		
		var st= update[eventId].startTime.split(":");
		var st_h = Number(st[0]);
		var st_m = Number(st[1]);
		
		var checkET = new Date();
		checkET.setHours(et_h, et_m);

		var scheduledTime = new Date();
		scheduledTime.setHours(st_h, st_m);
		var marginScheduledTime = new Date();
		marginScheduledTime.setHours(st_h, st_m+10);

		if(new Date().toLocaleTimeString() < scheduledTime.toLocaleTimeString() ){
			alert("Wait for the Start Time.")
		}

		else if( new Date() > marginScheduledTime.toLocaleTimeString()){
			alert("Margin Start Time Crossed!");
			clearInterval(timerID);
						update[eventId].status = "ready_for_qa";
						update[eventId].completed = false;
						update[eventId].startTime = "Task Time Over";
						update[eventId].endTime = "Task Time Over";
						update[eventId].elapsedTime = elapsed;						
						that.setState({taskList: update}, function(){
							localStorage["taskList"] = JSON.stringify(this.state.taskList);
						});	

		}

		else {

				update[eventId].status = "in_progress";		
				timerID = setInterval(function(){
						
					if(checkET < new Date()){
						clearInterval(timerID);
						update[eventId].status = "ready_for_qa";
						update[eventId].completed = true;
						update[eventId].startTime = "Task Time Over";
						update[eventId].endTime = "Task Time Over";
						update[eventId].elapsedTime = elapsed;						
						that.setState({taskList: update}, function(){
							localStorage["taskList"] = JSON.stringify(this.state.taskList);
						});	
					}

					else{
						that.setState({time: new Date().toLocaleTimeString()});
						elapsed = that.state.time;
					}
					
				}, 1000)
		}

			this.setState({taskList: update}, function(){
				localStorage["taskList"] = JSON.stringify(this.state.taskList);
			});	
	}

	stopTimer(event){
		clearInterval(timerID);
		
	}

	selectedValue(event){
		console.log(event.target.value)
		selected = event.target.value;
	}

	addStatus(event){
		var update = this.state.taskList;
		
		if(update[event.target.id].status == "new" && selected == "in_progress"){		
			this.startTimer(event.target.id);
			
		}

		else if(update[event.target.id].status == "in_progress" && selected == ""){
			this.startTimer(event.target.id);
		}

		else if (update[event.target.id].status == "in_progress" && (selected == "closed" || selected == "ready_for_qa")  ){
	//		$("#timer").hide();
			update[event.target.id].status = selected;	
			update[event.target.id].completed = true;
			this.setState({taskList: update}, function(){
				localStorage["taskList"] = JSON.stringify(this.state.taskList);
			});
			alert("Task Status Updated!")
		}	

		else if(update[event.target.id].status == "ready_for_qa" && selected == "closed"){
		//	$("#timer").hide();
			update[event.target.id].status = selected;	
			update[event.target.id].completed = true;
			this.setState({taskList: update}, function(){
				localStorage["taskList"] = JSON.stringify(this.state.taskList);
			});
			alert("Task Status Updated!")
		}


		else
			alert("Task Status cannot be Updated!")
		
	}

	
	onChangeStartTime(event){
		sTime = event.target.value;
	}

	onChangeEndTime(event){
		eTime = event.target.value;
	}

	onChangeStartDate(event){
		date = event.target.value;
	}

	onSetVal(event){
		this.setState({taskVal: event.target.value })
	}

	deleteTask(event){
		var updatedData  =  this.state.taskList; 

		var index;
		updatedData.map( function(el){
			if(el.id == event.target.id){
				index = updatedData.indexOf(el);
			}
		})

		updatedData.splice(index, 1);
		
		this.setState({taskList  : updatedData}, function(){
			localStorage["taskList"] = JSON.stringify(this.state.taskList);
		})
	}

	onEditTask(event){
		id = event.target.id;
		var dataset = this.state.taskList;
		$("#taskInput").val(dataset[id].task_name);
		$("#inputSTime").val(dataset[id].startTime);
		$("#inputETime").val(dataset[id].endTime);

		sTime = dataset[id].startTime;
		eTime = dataset[id].endTime;


		$("#add-to-list").hide();
		$("#inputDate").hide();		
		$(".inputDateTime").hide();
		$("#save-task").show();


			
	}

	setNewData(event){
		var dataset = this.state.taskList;

			var st= sTime.split(":");
			var et= eTime.split(":");

			var newST = new Date();
			newST.setHours(Number(st[0]), Number(st[1]));

			var newET = new Date();
			newET.setHours(Number(et[0]), Number(et[1]));

		if(sTime == dataset[id].startTime && eTime == dataset[id].endTime){

			if(this.state.taskVal === "")
				dataset[id].task_name = dataset[id].task_name;
			else
				dataset[id].task_name = this.state.taskVal;
						
			dataset[id].startTime = sTime;
			dataset[id].endTime = eTime;
			this.setState({taskList  : dataset}, function(){
				localStorage["taskList"]= JSON.stringify(this.state.taskList);	
			});

			this.setState({taskVal: "" })

			$("#taskInput").val("");
			$("#inputSTime").val("");
			$("#inputETime").val("");

			$(".inputDateTime").show();
			$("#inputDate").show();
			$("#inputSTime").show();
			$("#inputETime").show();
			$("#add-to-list").show();
			$("#save-task").hide();
		}

		
		else if(newST < new Date())
			alert("Start Time cannot be behind current Time!")
		
		else if(newET < newST)
			alert("End Time cannot be behind Start Time!");

		else if(newET < newST.setHours(Number(st[0]), Number(st[1])+10))
			alert("Make sure End time is +10 mins of start time!");
		else{

			if(this.state.taskVal === "")
				dataset[id].task_name = dataset[id].task_name;
			else
				dataset[id].task_name = this.state.taskVal;
						
			dataset[id].startTime = sTime;
			dataset[id].endTime = eTime;
			this.setState({taskList  : dataset}, function(){
				localStorage["taskList"]= JSON.stringify(this.state.taskList);	
			});

			this.setState({taskVal: "" })

						this.setState({taskVal: "" })

			$("#taskInput").val("");
			$("#inputSTime").val("");
			$("#inputETime").val("");

			$(".inputDateTime").show();
			$("#inputDate").show();
			$("#inputSTime").show();
			$("#inputETime").show();
			$("#add-to-list").show();
			$("#save-task").hide();
		}
	}		


	addToList(event){

		event.preventDefault();

			var st= sTime.split(":");
			var et= eTime.split(":");

			var newST = new Date();
			newST.setHours(Number(st[0]), Number(st[1]));

			var newET = new Date();
			newET.setHours(Number(et[0]), Number(et[1]));	
			
			if(newET < newST)
			alert("End Time cannot be behind Start Time!");

			else if(newET < newST.setHours(Number(st[0]), Number(st[1])+10))
			alert("Make sure End time is +10 mins of start time!");	

			else{
				var dataset={}
				dataset['id']  =  this.state.taskList.length
				dataset['task_name']  = this.state.taskVal
				dataset['completed'] = false;
				dataset['startDate']= dateformat(date,"mm/dd/yyyy");
				dataset['startTime']= sTime;
				dataset['endTime']= eTime;
				dataset['elapsedTime']= 0;
				dataset['status']= "new";
				var data = []
				data = this.state.taskList;
				data.push(dataset);
		 		this.setState({ taskList : data},function(){
					localStorage["taskList"] = JSON.stringify(this.state.taskList);	
		 		});
			}
	}

	render(){
		return(
			<div className="container">
				<div className="row m12">
					<div className="col m6 ">
						<div className="inputbox nav nav-pills nav-stacked affix col m4 card-panel hoverable teal lighten-5 z-depth-2" data-offset-top="205" data-spy="affix">
							<InputTask val={this.state.taskVal} onSetVal={this.onSetVal} onChangeStartDate = {this.onChangeStartDate} onChangeStartTime={this.onChangeStartTime} onChangeEndTime={this.onChangeEndTime} addToList={this.addToList} setNewData={this.setNewData} />
						</div>
					</div>
					
					<div className="col m6 card-panel hoverable teal lighten-5 z-depth-2">
						<AddRow taskData={this.state.taskList} time={this.state.time} stopTimer={this.stopTimer} addStatus={this.addStatus}  onSelectValue={this.selectedValue} delTask={this.deleteTask} editTask={this.onEditTask}  />	
					</div>
				</div>
			</div>
			)
	} 
	
}

export default ToDo;
