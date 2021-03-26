import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";

// export default function ModelPerformance() {

class ModelPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        baseline_on_original: {},
        baseline_on_augmented: {},
        model_options: [],
        model_types: [],
        train_accuracy: [], 
        val_accuracy: [],
        train_f1: [],
        val_f1: [],
        val_precision: [],
        val_recall: [], 
        train_precision: [], 
        train_recall: []
      },
      hide: true,
      value: {},
    };
  }

  componentWillMount() {
    axios.get(`http://localhost:5000/model-performance`).then((res) => {
      console.log(res.data);
      console.log("res precision", res.data.precision);
      this.setState({ data: res.data });
      console.log("state precision", this.state.data.precision);
    });
  }

  render() {
    
    
    return (
      <div className="content">
        <p style={{ color: "#707070" }}>
          <h4>Baseline Model Trained on Original Dataset and Tested on Original Dataset</h4>
        </p>
        <Row>

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation Accuracy</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_original.accuracy}
                      </CardTitle>
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-sound-wave text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation F1-Score</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_original.f1}
                      </CardTitle>
                      <p />
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-zoom-split text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation Precision</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_original.precision}
                      </CardTitle>
                      <p />
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation Recall</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_original.recall}
                      </CardTitle>
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

        <p style={{ color: "#707070" }}>
          <h4>Baseline Model Trained on Original Dataset and Tested on Augmented Dataset</h4>
        </p>
        <Row>

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Test Accuracy</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_augmented.accuracy}
                      </CardTitle>
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-sound-wave text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Test F1-Score</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_augmented.f1}
                      </CardTitle>
                      <p />
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-zoom-split text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Test Precision</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_augmented.precision}
                      </CardTitle>
                      <p />
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
          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Test Recall</p>
                      <CardTitle tag="p">
                        {this.state.data.baseline_on_augmented.recall}
                      </CardTitle>
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

        <p style={{ color: "#707070" }}>
          <h4>Custom Model Statistics</h4>
        </p>

        <Autocomplete
          id="debug"
          options={this.state.data.model_types}
          getOptionLabel={(option) => option.title}
          style={{ width: 300 }}
          value={this.state.value}
          onChange={(event, newValue) => {
            if (newValue){
            this.setState({
              value: newValue, hide: false
            })};
            // console.log("new title", this.state.value.title);
            // console.log("new value", this.state.value.id);
            // console.log(this.state.hide);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Model" variant="outlined" />
          )}
        />
        <br />
        
        { (this.state.hide == false) ? 
        <div>
          
          
            
           <Row>
           <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Train Accuracy</p>
                      <CardTitle tag="p">
                        {this.state.data.train_accuracy[this.state.value.id]}
                      </CardTitle>
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-sound-wave text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Train F1-Score</p>
                      <CardTitle tag="p">
                      {this.state.data.train_f1[this.state.value.id]}
                      </CardTitle>
                      <p />
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-zoom-split text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Train Precision</p>
                      <CardTitle tag="p">
                      {this.state.data.train_precision[this.state.value.id]}
                      </CardTitle>
                      <p />
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
          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Train Recall</p>
                      <CardTitle tag="p">
                      {this.state.data.train_recall[this.state.value.id]}
                      </CardTitle>
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
                  
          <Row>
           <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation Accuracy</p>
                      <CardTitle tag="p">
                        {this.state.data.val_accuracy[this.state.value.id]}
                      </CardTitle>
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-sound-wave text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation F1-Score</p>
                      <CardTitle tag="p">
                      {this.state.data.val_f1[this.state.value.id]}
                      </CardTitle>
                      <p />
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

          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-zoom-split text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation Precision</p>
                      <CardTitle tag="p">
                      {this.state.data.val_precision[this.state.value.id]}
                      </CardTitle>
                      <p />
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
          <Col sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Validation Recall</p>
                      <CardTitle tag="p">
                      {this.state.data.val_recall[this.state.value.id]}
                      </CardTitle>
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
                  
             
        <Row>
        <Col md = "12">
          <Card className="card-stats" justifyContent="center" >
                <CardHeader>
                  <CardTitle>
                    <p className= "card-category" style = {{textAlign: "center" ,padding: "0 0 2em 0 "}}>
                      <h4>
                        Model Architecture
                      </h4>
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardBody style = {{textAlign: "center", height: "100%", width: "100%"}}>
                <img 
                    alt="Model Architecture"
                    // className="avatar border-gray"
                    key = {Date.now()}
                    src={`http://localhost:5000/static/models/` + this.state.value.title + `/model.svg`}
                    // style = {{height: "80%", width: "80%"}}
                    
                    />
                <p>
                  <br />
                  <br />
                </p>
                </CardBody>

              <CardFooter>
                    <hr />
                    {/* <div className="stats">
                            <i className="far fa-calendar" /> Last day
                          </div> */}
              </CardFooter>
          
          </Card>
        </Col>
        </Row>

        <Row>
          <Col md = "4">
              <Card className="card-stats">
              <CardHeader>
                  <CardTitle>
                    <p className= "card-category" style = {{textAlign: "center"}}>
                      <h4>
                        Loss-Accuracy Curve
                      </h4>
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <img 
                    alt="Accuracy-Loss Curve"
                    // className="avatar border-gray"
                    key = {Date.now()}
                    src={`http://localhost:5000/static/models/` + this.state.value.title + `/loss_acc.gif`}
                    style={{ height: "120%", width: "120%"}}
                    />
                </CardBody>
                          <CardFooter>
                    <hr />
                    {/* <div className="stats">
                            <i className="far fa-calendar" /> Last day
                          </div> */}
              </CardFooter>
              </Card>
          </Col>
          <Col md = "4">
            <Card className="card-stats">
            <CardHeader>
                  <CardTitle>
                    <p className= "card-category" style = {{textAlign: "center" }}>
                    <h4>
                      Precision-Recall Curve
                      </h4>
                    </p>
                  </CardTitle>
                </CardHeader>
              <CardBody>
                <img 
                    alt="Precision-Recall Curve"
                    // className="avatar border-gray"
                    key = {Date.now()}
                    src={`http://localhost:5000/static/models/` + this.state.value.title + `/pr.gif`}
                    style={{ height: "120%", width: "120%"}}
                    />
              </CardBody>
                          <CardFooter>
                    <hr />
                    {/* <div className="stats">
                            <i className="far fa-calendar" /> Last day
                          </div> */}
              </CardFooter>
            </Card>
          </Col>
          <Col md = "4" >
            <Card className="card-stats">
            <CardHeader>
                  <CardTitle>
                    <p className= "card-category" style = {{textAlign: "center" }}>
                    <h4>
                      F1 Curve
                      </h4>
                    </p>
                  </CardTitle>
                </CardHeader>
              <CardBody >
                <img 
                    alt="F1-Scores"
                    // className="avatar border-gray"
                    key = {Date.now()}
                    src={`http://localhost:5000/static/models/` + this.state.value.title + `/f1.gif`}
                    style={{ height: "120%", width: "120%"}}
                    />
              </CardBody>
                          <CardFooter>
                    <hr />
                    {/* <div className="stats">
                            <i className="far fa-calendar" /> Last day
                          </div> */}
              </CardFooter>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col md = "12" >
            <Card className="card-stats">
              <CardBody >
                <img 
                    alt="F1-Scores"
                    // className="avatar border-gray"
                    src={`http://localhost:5000/static/models/` + this.state.value.title + `/cm.png`}
                    style={{ height: "100%", width: "100%"}}
                    />
              </CardBody>
                          <CardFooter>
                    <hr />
                    <div className="stats">
                            <i className="far fa-calendar" /> Last day
                          </div>
              </CardFooter>
            </Card>
          </Col>
        </Row> */}
        </div> : null}
          
      
      </div>
    );
  }
}

export default ModelPerformance;
