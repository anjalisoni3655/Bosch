import axios from "axios";
import React from "react";
// react plugin used to create charts
import { Line, Pie , Bar} from "react-chartjs-2";
// var CanvasJSReact = require('./canvasjs.react');
// reactstrap components

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Lightbox from "react-awesome-lightbox";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";


import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ExplainableAI extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
        data1:{
        
            model_types: [],
          },
    
        
          data2: {
            plotdata: [],
          },

          model_type: {},

          hide: true,
          openex: false,
          isVisible: false,
          slide: 0,
        
    };

  }

  componentWillMount(){
    axios.get(`http://localhost:5000/explainable-ai`).then(res => {
      console.log(res.data);
      this.setState({data1: res.data});
    //   console.log(this.state.allData.cardData.total_images)
    })
  }

  toggleDataSeries(e) {
		if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}

    showSlide = (slide) => {
        this.setState({
          isVisible: !this.state.isVisible,
          slide: slide
        });
    }

  render() {
    
    

    return (
      <>
      
        <div className="content">
            <div style = {{justifyContent: "center", textAlign: "center", alignItems: "center"}}>

            <Autocomplete
            id="debug"
            debug
            options={this.state.data1.model_types}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            value={this.state.model_type}
            onChange={(event, newValue) => {
                if (newValue){
                this.setState({
                    model_type: newValue});
                    console.log("New Value: ", this.state.model_type, newValue)
                    axios.post(`http://localhost:5000/explainable-ai`, {newValue}).then(
                    (response) => {
                        this.setState({data2: response.data});
                        console.log(this.state.data2);
                    }
                    )
                    this.setState({hide: false})
                    };
                }}
            renderInput={(params) => (
                <TextField {...params} label="Choose Model" variant="outlined" />
            )}
            
            />

            </div>
            <br />
            <br />
            {(this.state.hide == false && this.state.model_type) ? 
                <div>
                    
                    <div style = {{textAlign: "right"}}>
                        <p>
                            <h4>
                                {this.state.model_type.title}
                            </h4>
                        </p>
                    </div>
                    <Row>
                        <Col lg="6" >
                        <Card className="card-stats" style = {{height: "400px"}}>
                            <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                                <h4>
                                What we mean by explainable AI?    
                                </h4>
                            </CardTitle>
                            <CardBody>
                            
                            </CardBody>
                            <CardFooter>
                            <hr />
                            </CardFooter>
                        </Card>
                        </Col>
                        <Col lg="6" >
                        <Card className="card-stats" style = {{height: "400px"}}>
                            <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                                <h4>
                                Example    
                                </h4>
                            </CardTitle>
                            <CardBody style = {{justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                            <img style = {{cursor: "zoom-in"}}  src={`http://localhost:5000/static/models/` + this.state.model_type.title + `/gc1.png`}
                                onClick = {(event) => {
                                this.setState({openex: true})
                            }}
                            style = {{height: "100%",}} 
                            />
                            {(this.state.openex == true)?<Lightbox image={`http://localhost:5000/static/models/` + this.state.model_type.title + `/gc1.png`} title="Confusion Matrix" onClose={(event) => {
                                this.setState({openex: false})
                            }} > </Lightbox>: null}
                      
                            </CardBody>
                            <CardFooter>
                            <hr />
                            </CardFooter>
                        </Card>
                        </Col>
                    </Row>
                    <Row>
                <Col lg="12">
                    <Card>
                    <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Correctly Classified Predictions
                    </h4>
                  </CardTitle>
                       <CardBody style = {{alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                         
                          <img
                            onClick={() => this.showSlide(1)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/1.png"+"?"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />
                            <img
                            onClick={() => this.showSlide(2)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/2.png"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />
                            <img
                            onClick={() => this.showSlide(3)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/3.png"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />
                            <img
                            onClick={() => this.showSlide(4)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/4.png"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />                  
                            {(this.state.isVisible == true) ? <Lightbox toggler={this.state.isVisible} images = {[{url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/1.png", title: "Image 1"}, {url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/2.png", title: "Image 2"}, {url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/3.png", title: "Image 3"}, {url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/4.png", title: "Image 4"}]} onClose={(event) => {
                            this.setState({isVisible: false})
                          }} > </Lightbox>: null}
                      
                        </CardBody> 
                    </Card>

                    </Col>
                </Row>
                   
                <br />
                <Row>
                <Col lg="12">
                    <Card>
                    <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Misclassified Predictions
                    </h4>
                  </CardTitle>
                       <CardBody style = {{alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                         
                          <img
                            onClick={() => this.showSlide(1)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/1.png"+"?"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />
                            <img
                            onClick={() => this.showSlide(2)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/2.png"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />
                            <img
                            onClick={() => this.showSlide(3)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/3.png"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />
                            <img
                            onClick={() => this.showSlide(4)}
                            src={"http://localhost:5000/static/models/" + this.state.model_type.title + "/4.png"}
                            style = {{height: "20%", width: "20%", padding: "2em"}}
                            />                  
                            {(this.state.isVisible == true) ? <Lightbox toggler={this.state.isVisible} images = {[{url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/1.png", title: "Image 1"}, {url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/2.png", title: "Image 2"}, {url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/3.png", title: "Image 3"}, {url: "http://localhost:5000/static/models/" + this.state.model_type.title + "/4.png", title: "Image 4"}]} onClose={(event) => {
                            this.setState({isVisible: false})
                          }} > </Lightbox>: null}
                      
                        </CardBody> 
                    </Card>

                    </Col>
                </Row>
                <Row>
                        <Col md="12">
                        <Card style = {{height: "100%"}}>
                            <CardHeader>
                            <CardTitle tag="h5">
                                IOU Sensitivity
                            </CardTitle>
                            
                            </CardHeader>
                            <CardBody>
                                <CanvasJSChart options = {{
                                        animationEnabled: true,
                                        height: "600",
                                        theme: "light2",
                                        axisX: {
                                            // title: "Classes",
                                            // titleFontSize: 20,
                                            interval: 1,
                                            interlacedColor: "#F0FBFF",
                                            labelAngle: -90,
                                            labelFontSize: 14
                                            
                                                    // gridColor: "#FFFFFF"
                                        },
                                        axisY: {
                                            
                                            minimum: 0,
                                            title: "Number of Images\n\n",
                                            titleFontSize: 15,
                                            // gridThickness: 1,
                                            // gridColor: "lightblue",
                                                    lineThickness: 1,
                                            
                                            labelFontSize: 12

                                        },
                                        
                                        zoomEnabled: true,
                                        zoomType: "xy",

                                        toolTip: {
                                            shared: true
                                        },
                                        legend:{
                                            // cursor: "pointer",
                                            itemclick: this.toggleDataSeries,
                                             fontSize: 15, 
                                            
                                                },

                                        dataPointWidth: 20,
                                        data: [{
                                                    color: "#51cbce",
                                                    type: "stackedColumn",
                                                    name: "Original",
                                                    showInLegend: "true",
                                                    dataPoints: this.state.data2.plotdata,
                                                },
                                                
                                        ]
                                            }}/>
                        </CardBody>
                            <CardFooter>
                            <hr />
                            {/* <div className="stats">
                                <i className="fa fa-history" /> Updated 3 minutes ago
                            </div> */}
                            </CardFooter>
                        </Card>
                        </Col>
                </Row>
                </div>: null    
        
        }
          

        </div>
      </>
    );
  }
}

export default ExplainableAI;
