import React, {Component} from 'react';
import {Line, Bar} from 'react-chartjs-2';

class Chart extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData
    }
  }

  static defaultProps = {
    displayTitle:true,
    title:'Title'
  }

  render(){
    return (
      <div className="chart">        
        <Line
          data={this.state.chartData}		  
          options={{
            title:{
              display:this.props.displayTitle,
              text:this.props.title
            },
			maintainAspectRatio: false
          }}
        />		
      </div>
    )
  }
}

export default Chart;