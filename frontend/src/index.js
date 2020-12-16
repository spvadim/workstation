import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import store from './store';
import { Provider } from 'react-redux';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <CookiesProvider>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </CookiesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
