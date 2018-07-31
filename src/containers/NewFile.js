import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import {Line} from 'react-chartjs-2';

import LoaderButton from "../components/LoaderButton";
import Chart from "../components/Chart";
import config from "../config";
import "./NewFile.css";

export default class NewFile extends Component {

	constructor(props) {
		super(props);
		this.file = null;
		this.state = {
			isLoading: null,
			content: "",
			chartData:{}
		};
	}

	validateForm() {
		return this.state.content.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleFileChange = event => {
		this.file = event.target.files[0];
	}

	handleSubmit = async event => {
		event.preventDefault();
		if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
			alert("Please pick a file smaller than 5MB");
			return;
		}
		this.setState({ isLoading: true });
		this.setState({ content: "Hola"});
		//console.log(this.file);
		var readXml=null;
		var  reader = new FileReader();
		reader.onload=function(e) {
			readXml=e.target.result;			
			//console.log(readXml);
            var parser = new DOMParser();
			var doc = parser.parseFromString( readXml, "application/xml");
            //console.log(doc);
			console.log(doc.getElementsByTagName("FirstName")[0].childNodes[0].nodeValue);
			var medidas = doc.getElementsByTagName("Measurement");
			var labels=[], dataDias=[], dataSys=[], dataMad=[], x=0,date,fecha;
			for (var i = 0; i < medidas.length; i++) {
				if(medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("code").nodeValue == 0){					
					date = new Date(Number(medidas[i].attributes.getNamedItem("timestamp").nodeValue));
					fecha=date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes();
					console.log(fecha);
					labels[x] = fecha;
					dataDias[x] = medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("dias").nodeValue;
					dataSys[x] = medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("sys").nodeValue;
					dataMad[x] = medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("mad").nodeValue;
					x++;
				}else{
					console.log(medidas[i].attributes.getNamedItem("timestamp").nodeValue + 'NOK');
				}
			}
			this.setCharData(labels,dataDias,dataSys,dataMad);
			//console.log(medidas.getElementsByTagName("Measurement")[0].childNodes[0].nodeValue);

		}.bind(this);
    reader.readAsText(this.file);
		console.log(readXml);

		this.setState({ isLoading: false });
	}


	setCharData(labels,dataDias,dataSys,dataMad){	
		console.log("Hola Mundo");
		this.setState({
			chartData:{
				labels:labels,
				datasets:[					
					{
						label:'Sys',
						backgroundColor: "rgba(255, 99, 132, 0.3)",
						borderColor: "#ff6384",						
						data:dataSys,
						fill: 0
					},
					{
						label:'Mad',	
						backgroundColor: "rgba(153, 102, 255, 0.3)",
						borderColor: "#9966ff",	
						borderDash: [5, 5],
						pointRadius: 3,
						data:dataMad,
						fill: false
					},
					{
						label:'Dias',
						backgroundColor: "rgba(54, 162, 235, 0.3)",
						borderColor: "#36a2eb",							
						data:dataDias,
						fill: 0
					}
				]
			}
		});
	}

	renderChart(data) {
		return (
			<Chart chartData={this.state.chartData} title="Presion"/>
		);
	}

	render() {
		return (
		<div>
			{this.state.isLoading && this.renderChart(this.state.chartData)}
			<div className="NewFile">
				<form onSubmit={this.handleSubmit}>		
					<table style={{width: '100%'}}><tbody>
						<tr>
							<td>
								<FormGroup controlId="file">
									<ControlLabel>Attachment</ControlLabel>
									<FormControl onChange={this.handleFileChange} type="file"/>
								</FormGroup>
							</td>
							<td>
								<LoaderButton block bsStyle="primary" bsSize="large" disabled={!this.validateForm()} type="submit"
									isLoading={this.state.isLoading}
									text="Create"
									loadingText="Creating…"
								/>
							</td>                 
						</tr>
					</tbody></table>
				</form>
			</div>
			<div className="char">
				<Line
					data={this.state.chartData}
					options={{
						maintainAspectRatio: true,
						responsive: true,
						title: {
							display: true,
							text: 'MAPA'
						},
						tooltips: {
							mode: 'index',
							intersect: false,
						},						
						scales: {
							xAxes: [{
								display: true,
								type: 'time',								
								time: {
									format: 'YYYY/MM/DD HH:mm',
									// round: 'day'
									tooltipFormat: 'll HH:mm'
								},
								scaleLabel: {
									display: true,
									labelString: 'Tiempo'
								}
							}],
							yAxes: [{
								display: true,
								stacked: false,
								scaleLabel: {
									display: true,
									labelString: 'Presion'
								}
							}]
						}
					}}
				/>
			</div>
			<div className="NewFile">
				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="content">
						<FormControl onChange={this.handleChange} value={this.state.content}/>
					</FormGroup>
					<FormGroup controlId="file">
						<ControlLabel>Attachment</ControlLabel>
						<FormControl onChange={this.handleFileChange} type="file"/>
					</FormGroup>
					<LoaderButton block bsStyle="primary" bsSize="large" disabled={!this.validateForm()} type="submit"
						isLoading={this.state.isLoading}
						text="Create"
						loadingText="Creating…"
					/>
				</form>
			</div>
		</div>
		);
}
}
