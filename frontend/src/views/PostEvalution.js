import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import GroupedSelect from "./customDropdown";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Lightbox from "react-awesome-lightbox";

import CircularProgress from "@material-ui/core/CircularProgress";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { CardMedia } from "@material-ui/core";
import CanvasJSReact from "./canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PostEvaluation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        
      data1:{
        
        model_types: [],
      },

      data2: {
        cmData: [],
        
        model_behavior1: "",
        dataset_changes: "",
        network_changes: "",
        suggestions: "",
      },

      data3: {
        tsneData: [],
      },

      model_type: [],
      hide: true,
      opencmcm: false,
      openla: false,
      success: false,

    };
  }

    componentWillMount() {
      axios.get(`http://localhost:5000/post-evaluation`).then((res) => {
        console.log(res.data);
        this.setState({ data1: res.data });
        console.log("Model Types", this.state.data1.model_types);
      });
    }

  render(){
    
    const columns: ColDef[] = [
      { field: 'pred', headerName: 'Predicted Class', width: 250 },
      { field: 'act', headerName: 'Actual Class', width: 250},
      { field: 'num', headerName: 'Number of Misclassifications', width:250},

    ];
    
    const rows = this.state.data2.cmData
    
    const options = {
      animationEnabled: true,
      height: "600",
      theme: "light2",
      // height: 800,
      axisX: {
        title: "Dimension 1",
        titleFontSize: 15,
        rot: 0,
        interval: 1,
        gridThickness: 0,
        // interlacedColor: "#F0FBFF",
        labelAngle: -90,
        labelFontSize: 14,

        // gridColor: "#FFFFFF"
      },
      axisY: {
        // minimum: 0,
        title: "Dimension 2\n\n",
        titleFontSize: 15,
        gridThickness: 0,
        // gridColor: "lightblue",
        lineThickness: 1,

        labelFontSize: 12,
      },

      zoomEnabled: true,
      zoomType: "xy",

      toolTip: {
        shared: true,
        
      },
      legend: {
        // cursor: "pointer",
        itemclick: this.toggleDataSeries,
        fontSize: 15,
      },
      dataPointWidth: 20,
      data: [
        {
          type: "scatter",
          toolTipContent: "{name}<br/>Dimension 1: {x}<br/>Dimension 2: {y}",
          showInLegend: false,
          // indexLabel: "{y}",
          // yValueFormatString: "#,##0",

          dataPoints: this.state.data3.tsneData,
        },
        
      ],
    };
    

    return (
      <div className="content" >
        <div style = {{justifyContent: "center", textAlign: "center", alignItems: "center"}}>

          <Autocomplete
            id="debug"
            options={this.state.data1.model_types}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            value={this.state.model_type}
            onChange={(event, newValue) => {
              if (newValue){
                this.setState({
                  model_type: newValue});
                  console.log("New Value: ", newValue)
                  axios.post(`http://localhost:5000/post-evaluation`, {'model_type': newValue, 'flag': 0}).then(
                    (response) => {
                      this.setState({data2: response.data});
                      console.log(this.state.data2);
                    }
                    )
                    axios.post(`http://localhost:5000/post-evaluation`, {'model_type': newValue, 'flag': 1}).then(
                    (response) => {
                      this.setState({data3: response.data});
                      this.setState({success: true})
                      console.log(this.state.data3);
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
        <div style = {{textAlign: "center"}}>
          <h4>
            {/* {this.state.model_type} */}
          </h4>
        </div>
        <br />
        <br />
        {(this.state.hide == false) ? 
          <div>
            <Row  >
              <Col lg="12" >
                <Card className="card-user" >
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Confusion Matrix Analysis
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="5" xs="5">
                        <img style = {{cursor: "zoom-in"}}  src={`http://localhost:5000/static/models/` + this.state.model_type.title + `/cm.png`}
                          onClick = {(event) => {
                            this.setState({opencm: true})
                          }} 
                        />
                        {(this.state.opencm == true)?<Lightbox image={`http://localhost:5000/static/models/` + this.state.model_type.title + `/cm.png`} title="Confusion Matrix" onClose={(event) => {
                            this.setState({opencm: false})
                          }} > </Lightbox>: null}
                      
                      
                      </Col>
                      <Col md = "1">
                      </Col>
                      <br />
                      <br />

                      
                        <Col md="6" xs="7">
                          <br />
                          <DataGrid rows={rows} columns={columns} autoHeight={true} scrollbarSize={0} hideFooter= {true} disableSelectionOnClick={true} disableExtendRowFullWidth={true} pageSize={5} />
                        </Col>
                     
                    </Row>
                  </CardBody>
                  <CardFooter>
                    {/* <hr />
                    <div className="stats">
                            <i className="fas fa-sync-alt" /> Update Now
                          </div> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card className="card-user">
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Loss Accuracy Curve Analysis
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="5" xs="5">
                      <img style = {{cursor: "zoom-in"}} src={`http://localhost:5000/static/models/` + this.state.model_type.title + `/loss_acc.gif`}
                          onClick = {(event) => {
                            this.setState({openla: true})
                          }} 
                        />
                        {(this.state.openla == true)?<Lightbox image={`http://localhost:5000/static/models/` + this.state.model_type.title + `/loss_acc.gif`} title="Confusion Matrix" onClose={(event) => {
                            this.setState({openla: false})
                          }} > </Lightbox>: null}
                      
                      </Col>
                      <Col md="5" xs="7">
                        <br/>
                        <br/>
                        <p style = {{fontSize: "20px"}}>

                        {this.state.data2.model_behavior1}
                        <br/><br/>
                        {this.state.data2.dataset_changes}
                        <br/><br/>
                        {this.state.data2.network_changes}
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    {/* <hr />
                    <div className="stats">
                            <i className="fas fa-sync-alt" /> Update Now
                          </div> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card className="card-user">
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      TSNE Plot
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="5" xs="5">
                      {(this.state.success == false) ? (

                        <CircularProgress
                          size={24}
                          
                        />
                      ): <CanvasJSChart options={options} />}
                          
                      
                      </Col>
                      <Col md = "1">
                      </Col>

                      <Col md="6" xs="7">
                        
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
            </Row>
            <Row>
              <Col lg="12">
                <Card className="card-user">
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Suggestions
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        
                      </Col>
                      <Col md="8" xs="7">
                        
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
            </Row>
          </div> : null}  
      
      </div>

    )
  }
        
        
}
        
export default PostEvaluation;
