import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import {createUseStyles} from 'react-jss';
import BatchParams from './pages/BatchParams/index.js';
import Main from './pages/Main/index.js';
import Edit from './pages/Edit/index.js';
import imgBackground from 'src/assets/images/background.svg';

const useStyles = createUseStyles({
	app: {
		height: "100vh",
		display: "flex",
		backgroundImage: `url(${imgBackground})`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'bottom 10px right 10px',
		backgroundSize: 'auto calc(100% - 10px)',
	},
});

function App() {
	const styles = useStyles();

	return (
		<div className={styles.app}>
			<Route exact path="/" component={BatchParams}/>  
			<Route exact path="/main" component={Main}/>
			<Route exact path="/edit" component={(props) => Edit(props.location.state)} />
		</div>
	);
}

export default App;
