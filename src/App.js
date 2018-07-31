import React, { Component } from 'react';
import Routes from "./Routes";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Demo - Holter Presion</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
		<Routes />
      </div>
    );
  }
}

export default withRouter(App);
