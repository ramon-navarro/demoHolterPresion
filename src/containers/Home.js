import React, { Component } from "react";
import "./Home.css";


export default class Home extends Component {
	render() {
		return (
			<div className="Home">
				<div className="lander">
					<div className="py-5">
				<div className="container">
				  <div className="row">
					<div>
					  <i/>
					  <h2>
						<b>DEMO</b>
					  </h2>
					  <p>Holter Presion</p>
					</div>
				  </div>
				</div>
			  </div>
				</div>
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
			
		);
	}
}