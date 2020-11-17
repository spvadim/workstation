import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import PartyParameters from './pages/PartyParameters/index.js';
import Main from './pages/Main/index.js';
import Edit from './pages/Edit/index.js';

function App() {
	let [partyParamsState, setPartyParamsState] = useState({
		partyNumber: -1,
		settings: {
			multipack: -1,
			pack: -1,
		}
	});

	return (
		<BrowserRouter>
			<div style={{height: "100%", display: "flex"}}>
				<Route exact path="/party_parameters" component={PartyParameters}/>
				<Route exact path="/main" component={(props) => Main(props.location.state)}/>
				<Route exact path="/edit" component={(props) => Edit(props.location.state)} />
			</div>
		</BrowserRouter>
	);
}

export default App;
