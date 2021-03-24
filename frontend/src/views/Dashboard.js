import axios from "axios";
import React from "react";
// react plugin used to create charts
import { Line, Pie , Bar} from "react-chartjs-2";
// var CanvasJSReact = require('./canvasjs.react');
// reactstrap components
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

class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
        
          allData: {
            cardData: {},
            dataOG: [],
            dataAUG: [],
          },

        
    };

  }

  // getUserData = async () => {
  //     try {
  //         const {data} = await axios.get(`http://172.16.101.244:5000view-data-stats`);
  //         console.log(data);
  //         return data;
  //     } catch (err) {
  //         console.log(err.message);
  //     }
  // }

  componentWillMount(){
    axios.get(`http://localhost:5000/view-data-stats`).then(res => {
      console.log(res.data);
      this.setState({allData: res.data});
      // console.log(this.state.allData.cardData.total_images)
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

  render() {
    
    const options = {
			animationEnabled: true,
      height: "600",
			theme: "light2",
      // height: 800,
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
        // indexLabel: "{y}",
				// yValueFormatString: "#,##0",
        
				dataPoints: this.state.allData.dataOG,
			},
			{
        color: "#FFC0A4",
				type: "stackedColumn",
				name: "Augmented",
				showInLegend: "true",
        // indexLabel: "{y}",
				// yValueFormatString: "#,##0",


        dataPoints: this.state.allData.dataAUG,
        
			},
			]
		}
    
      
    return (
      <>
      
        <div className="content">
          <Row>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-album-2 text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Total Images</p>
                        <CardTitle tag="p">{this.state.allData.cardData.total_images}</CardTitle>
                        <p>
                          <br />
                        </p>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  {/* <div className="stats">
                    <i className="fas fa-sync-alt" /> Update Now
                  </div> */}
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-bullet-list-67 text-success" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Number of Classes</p>
                        <CardTitle tag="p">{this.state.allData.cardData.num_classes}</CardTitle>
                        <p />
                        <p>
                          <br />
                        </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  {/* <div className="stats">
                    <i className="far fa-calendar" /> Last day
                  </div> */}
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-chart-bar-32 text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Average Class Size</p>
                        <CardTitle tag="p">{this.state.allData.cardData.avg_class_size}</CardTitle>
                        <p />
                        <p>
                          <br />
                        </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  {/* <div className="stats">
                    <i className="far fa-clock" /> In the last hour
                  </div> */}
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats" >
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-image text-primary" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Largest Class</p>
                        <CardTitle tag="p">{this.state.allData.cardData.max_class}</CardTitle>
                        <br />
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  {/* <div className="stats">
                    <i className="fas fa-sync-alt" /> Update now
                  </div> */}
                </CardFooter>
              </Card>
            </Col>
          </Row>
{/*  
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Class Distribution</CardTitle>
                </CardHeader>
                <CardBody>
                  <Bar
                    data={dashboard24HoursPerformanceChart.data}
                    options={dashboard24HoursPerformanceChart.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter>
              </Card>
            </Col>
            </Row> */}


         
          <Row>
            <Col md="12">
              <Card style = {{height: "100%"}}>
                <CardHeader>
                  <CardTitle tag="h5">Class Distribution</CardTitle>
                </CardHeader>
                <CardBody>
                    <CanvasJSChart options = {options}/>
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
          {/* <Row>
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Email Statistics</CardTitle>
                  <p className="card-category">Last Campaign Performance</p>
                </CardHeader>
                <CardBody>
                  <Pie
                    data={dashboardEmailStatisticsChart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" /> Opened{" "}
                    <i className="fa fa-circle text-warning" /> Read{" "}
                    <i className="fa fa-circle text-danger" /> Deleted{" "}
                    <i className="fa fa-circle text-gray" /> Unopened
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-calendar" /> Number of emails sent
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                  <p className="card-category">Line Chart with Points</p>
                </CardHeader>
                <CardBody>
                  <Line
                    data={dashboardNASDAQChart.data}
                    options={dashboardNASDAQChart.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                    <i className="fa fa-circle text-warning" /> BMW 5 Series
                  </div>
                  <hr />
                  <div className="card-stats">
                    <i className="fa fa-check" /> Data information certified
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row> */}
        </div>
      </>
    );
  }
}

export default Dashboard;
