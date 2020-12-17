import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import BatchParams from './pages/BatchParams/index.js';
import Main from './pages/Main/index.js';
import Edit from './pages/Edit/index.js';


function App() {
	return (
		<div style={{height: "100%", display: "flex"}}>
			<Route exact path="/" component={BatchParams}/>  
			<Route exact path="/main" component={Main}/>
			<Route exact path="/edit" component={(props) => Edit(props.location.state)} />
		</div>
	);
}

export default App;
