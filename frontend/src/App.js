import React from "react";
import { Route } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import { Footer } from 'src/components'
import BatchParams from './pages/BatchParams/index.js';
import Main from './pages/Main/index.js';
import Main_new from './pages/Main_new/index.js';
import Edit from './pages/Edit/index.js';
import Create from './pages/Create/index.js';
import Create_mobile from './pages/Create/mobile.js';
import Admin from './pages/Admin/index.js';
import Events from './pages/Events/index.js';
import QrScanner from './pages/QrScanner/index.js';
import imgBackground from 'src/assets/images/background.svg';
import { color } from 'src/theme';


const useStyles = createUseStyles({
	App: {
		backgroundImage: `url(${imgBackground})`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'bottom 10px right 10px',
		backgroundSize: 'auto calc(100% - 10px)',
		backgroundColor: color.background,
		minHeight: "100%",
		position: "relative",
	},
	App_inner: {
		// position: "absolute",
		// overflowY: "scroll",
		height: "100%",
		width: "100%",
		zIndex: 1,
	},
});

function App() {
	const classes = useStyles();

	return (
		<div className={classes.App}>
			<div className={classes.App_inner}>
				<Route exact path="/" component={Main} />
				<Route exact path="/main_new" component={Main_new} />
				<Route exact path="/batch_params" component={BatchParams} />
				<Route exact path="/edit" component={(props) => Edit(props.location.state)} />
				<Route exact path="/create" component={window.screen.width < 600 ? Create_mobile : Create} />
				<Route exact path="/admin" component={Admin} />
				<Route exact path="/events" component={Events} />
				<Route exact path="/scanner" component={QrScanner} />
			</div>
			<Footer />
		</div>
	);
}

export default App;
