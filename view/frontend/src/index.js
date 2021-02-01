import ReactDOM from 'react-dom';
import React, { useEffect } from "react";
import './styles/index.scss';
import { Route, Switch, withRouter } from "react-router-dom";
import { Router } from 'react-router';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { createBrowserHistory } from 'history';

import { ResultPage, UploadPage } from "./pages";
import {reportStore, routingStore} from "./stores";
import { Provider } from 'mobx-react';
import { useStrict } from 'mobx';
import io from "socket.io-client";

// useStrict(true);

const stores = {
    report: reportStore,
    routing: routingStore,
}

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, routingStore);

const App = (props) => {
    useEffect(() => {
        // localStorage.debug = "*";
        const connectionString = 'http://' + location.host;
        window.socket = io.connect(connectionString);

        window.socket.on('connect', function() {
			console.log('* Connected to server.');
		});
    }, [])
    return (
            <Switch>
                <Route path="/report">
                    <ResultPage/>
                </Route>
                <Route path="/">
                    <UploadPage/>
                </Route>
            </Switch>
    )
}

ReactDOM.render(
    <Provider {...stores}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('app')
);