import React from "react";
import { Route } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import { Footer } from 'src/components'
import BatchParams from './pages/BatchParams/index.js';
import Main from './pages/Main/index.js';
import Edit from './pages/Edit/index.js';
import Create from './pages/Create/index.js';
import imgBackground from 'src/assets/images/background.svg';
import { color } from 'src/theme';

const useStyles = createUseStyles({
	App: {
		height: "100vh",
		backgroundImage: `url(${imgBackground})`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'bottom 10px right 10px',
		backgroundSize: 'auto calc(100% - 10px)',
		backgroundColor: color.background,
	},
	App_inner: {
		height: '100%',
		position: 'relative',
		zIndex: 1,
	},
});

function App() {
	const classes = useStyles();

	return (
		<div className={classes.App}>
			<div className={classes.App_inner}>
				<Route exact path="/" component={Main} />
				<Route exact path="/batch_params" component={BatchParams} />
				<Route exact path="/edit" component={(props) => Edit(props.location.state)} />
				<Route exact path="/create" component={Create} />
			</div>
			<Footer />
		</div>
	);
}

export default App;
