import React, { Component} from 'react';
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
		<Navbar>
		  <Navbar.Header>
			<Navbar.Brand>
			  <table><tbody>
			<tr>						
				<td><img src={logo} className="App-logo" alt="logo" /></td> 
				<td><h1 className="App-title"><a href="/">Demo - Holter Presion</a></h1></td>
			</tr>
			</tbody></table>
			</Navbar.Brand>
		  </Navbar.Header>		  
		</Navbar>
		<Routes />
		<footer>
			<div className="App-footer">
			<div className="py-5 text-muted text-center">
					<div className="container">
						<div className="row">
							<div className="col-md-12 my-4">
								<p className="mb-1">© 2018-2019 I2Salud</p>
								<ul className="list-inline">
									<li className="list-inline-item">
										<a href="#">Privacy</a>
									</li>
									<li className="list-inline-item">
										<a href="#">Terms</a>
									</li>
									<li className="list-inline-item">
										<a href="#">Support</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>		
      </div>
    );
  }
}

export default withRouter(App);
