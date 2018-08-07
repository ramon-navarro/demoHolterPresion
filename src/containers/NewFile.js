import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Col, Table, Panel, Label, Tooltip, OverlayTrigger,ButtonToolbar,ButtonGroup,Button,Glyphicon } from "react-bootstrap";
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
			isFile:null,
			isLoading: null,			
			chartData:{},
			nombre: "",
			edad: "",
			sexo: "",
			talla: "",
			totalAvgSys: "",
			totalAvgDias: "",
			dayAvgSys: "",
			dayAvgDias: "",
			nightAvgSys: "",
			nightAvgDias: "",
			resultadoTotal: "success",
			resultadoDia: "success",
			resultadoNoche: "success"
		};
	}	

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleFileChange = event => {
		this.file = event.target.files[0];	
		this.setState({
			isFile: this.file?true:false
		});		
	}

	handleSubmit = async event => {
		event.preventDefault();
		if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
			alert("Please pick a file smaller than 1MB");
			return;
		}		
		this.setState({ isLoading: true });		
		var readXml=null;
		var  reader = new FileReader();
		reader.onload=function(e) {
			readXml=e.target.result;			
			this.setState({					
				resultadoTotal: "success",
				resultadoDia: "success",
				resultadoNoche: "success"
			});
            var parser = new DOMParser();
			var doc = parser.parseFromString( readXml, "application/xml");            
			var medidas = doc.getElementsByTagName("Measurement");
			var labels=[], dataDias=[], dataSys=[], dataMad=[], x=0,date,fecha;
			for (var i = 0; i < medidas.length; i++) {
				if(medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("code").nodeValue == 0){					
					date = new Date(Number(medidas[i].attributes.getNamedItem("timestamp").nodeValue));
					date.setMonth(date.getMonth() + 1); //Parche por diferencia de fecha en 1 mes
					fecha=date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes();
					console.log(fecha);
					labels[x] = fecha;
					dataDias[x] = medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("dias").nodeValue;
					dataSys[x] = medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("sys").nodeValue;
					dataMad[x] = medidas[i].getElementsByTagName("NIBP")[0].attributes.getNamedItem("mad").nodeValue;					
					x++;
				}else{
					//console.log(medidas[i].attributes.getNamedItem("timestamp").nodeValue + 'NOK');
				}
			}
			this.setCharData(labels,dataDias,dataSys,dataMad);
			//Datos Personales			
			date = new Date(Number(doc.getElementsByTagName("DateOfBirth")[0].childNodes[0].nodeValue));
			var fechaNacimiento=date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
			this.setState({
				nombre:doc.getElementsByTagName("FirstName")[0].childNodes[0].nodeValue+' '+doc.getElementsByTagName("LastName")[0].childNodes[0].nodeValue,
				edad:this.calcAge(fechaNacimiento)+' años',
				sexo:doc.getElementsByTagName("Sex")[0].childNodes[0].nodeValue,
				talla:doc.getElementsByTagName("Size")[0].childNodes[0].nodeValue + 'm / ' + doc.getElementsByTagName("Weight")[0].childNodes[0].nodeValue + 'kg'
			});
			//Datos de Presion
			var presionDia, presionNoche, presionTotal;
			presionTotal = doc.getElementsByTagName("Recording")[0].getElementsByTagName("Total")[0];			
			presionDia = doc.getElementsByTagName("Recording")[0].getElementsByTagName("Day")[0];
			presionNoche = doc.getElementsByTagName("Recording")[0].getElementsByTagName("Night")[0];
			this.setState({
				totalAvgSys: presionTotal.getElementsByTagName("AvgSys")[0].childNodes[0].nodeValue,
				totalAvgDias: presionTotal.getElementsByTagName("AvgDias")[0].childNodes[0].nodeValue,
				dayAvgSys: presionDia.getElementsByTagName("AvgSys")[0].childNodes[0].nodeValue,
				dayAvgDias: presionDia.getElementsByTagName("AvgDias")[0].childNodes[0].nodeValue,
				nightAvgSys: presionNoche.getElementsByTagName("AvgSys")[0].childNodes[0].nodeValue,
				nightAvgDias: presionNoche.getElementsByTagName("AvgDias")[0].childNodes[0].nodeValue
			});
			//Resultado			
			if( parseFloat(this.state.totalAvgSys.replace(",", ".")) >= 130 || parseFloat(this.state.totalAvgDias.replace(",", ".")) >= 80){
				this.setState({					
					resultadoTotal: "danger"
				});
			}
			if( parseFloat(this.state.dayAvgSys.replace(",", ".")) >= 135 || parseFloat(this.state.dayAvgDias.replace(",", ".")) >= 85){
				this.setState({						
					resultadoDia: "danger"
				});
			}
			if( parseFloat(this.state.nightAvgSys.replace(",", ".")) >= 120 || parseFloat(this.state.nightAvgDias.replace(",", ".")) >= 70){
				this.setState({							
					resultadoNoche: "danger"
				});
			}

		}.bind(this);
		reader.readAsText(this.file);				
		this.setState({ isLoading: false });
	}

	calcAge(dateString) {
		var birthday = +new Date(dateString);
		return~~ ((Date.now() - birthday) / (31557600000));
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

	imprimir() { 		
		window.print();		
	}
		
	render() {	
		function LinkWithTooltip({ id, children, href, tooltip }) {
			return (
				<OverlayTrigger
					overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
					placement="right"
					delayShow={300}
					delayHide={150}>
					<b>{children}</b>
				</OverlayTrigger>
			);
		}
	
		return (
		<div>
			<div id="areaImprimir">
						<Panel bsStyle="primary" className="Panel">
							<Panel.Heading>
								<Panel.Title componentClass="h3">Datos</Panel.Title>
							</Panel.Heading>
							<Panel.Body>
								<table style={{width: '100%'}}><tbody>
									<tr>
										<td rowspan={4} style={{width: '40%'}}>
											<form onSubmit={this.handleSubmit}>
												<FormGroup controlId="file">
													<ControlLabel>Archivo XML</ControlLabel>
													<FormControl onChange={this.handleFileChange} type="file"/>
												</FormGroup>
												<LoaderButton block bsStyle="primary" bsSize="large" disabled={!this.state.isFile} type="submit"
													isLoading={this.state.isLoading}
													text="Cargar"
													loadingText="Cargando..."													
												/>
											</form>
										</td>										
										<td align="left" style={{width: '3%'}}></td>
										<td align="left"><b>{this.state.nombre}</b></td>										
										<td align="left" style={{width: '3%'}}></td>
										<td align="left">Promedio 24 horas: <b className={this.state.resultadoTotal}><LinkWithTooltip tooltip="< 130/80" id="tooltip-1">{this.state.totalAvgSys+' / '+this.state.totalAvgDias}</LinkWithTooltip></b></td>
									</tr>
									<tr>							
										<td align="left" style={{width: '3%'}}></td>
										<td align="left"><b>{this.state.edad}</b></td>									
										<td align="left" style={{width: '3%'}}></td>
										<td align="left">Promedio Diurno: <b className={this.state.resultadoDia}><LinkWithTooltip tooltip="< 135/85" id="tooltip-2">{this.state.dayAvgSys + ' / ' + this.state.dayAvgDias}</LinkWithTooltip></b></td>
									</tr> 
									<tr>							
										<td align="left" style={{width: '3%'}}></td>
										<td align="left"><b>{this.state.sexo}</b></td>
										<td align="left" style={{width: '3%'}}></td>
										<td align="left">Promedio Nocturno: <b className={this.state.resultadoNoche}><LinkWithTooltip tooltip="< 120/70" id="tooltip-3">{this.state.nightAvgSys + ' / ' + this.state.nightAvgDias}</LinkWithTooltip></b>
										</td>
									</tr>  						 						
									<tr>						
										<td align="left" style={{width: '3%'}}></td>
										<td align="left"><b>{this.state.talla}</b></td>
										<td align="left" style={{width: '3%'}}></td>
										<td align="left">
										<ButtonToolbar>
											<ButtonGroup>											
											  <Button bsSize="small" onClick={this.imprimir}>
												<Glyphicon glyph="print" /> Imprimir
											  </Button>
											  <Button bsSize="small" href="mailto:direccion@destinatario.com">
												<Glyphicon glyph="envelope" /> Email
											  </Button>
											  <Button bsSize="small" href="/file">
												<Glyphicon glyph="remove" /> Limpiar
											  </Button>
											</ButtonGroup>
										  </ButtonToolbar>
										</td>
									</tr>
								</tbody></table>					
							</Panel.Body>
						</Panel>
				</div>
			<Panel bsStyle="info">
				<Panel.Heading>
					<Panel.Title componentClass="h3">MAPA</Panel.Title>
				</Panel.Heading>
				<Panel.Body>
					<div className="chart">
						<Line
							data={this.state.chartData}
							options={{
								maintainAspectRatio: true,
								responsive: true,
								title: {
									display: false,
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
				</Panel.Body>
			</Panel>				
		</div>
		);
}
}
