import React, { useEffect } from "react";
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
const model_types = [
  { title: "model 1", id: 0 },
  { title: "model 2", id: 1 },
  { title: "model 3", id: 2 },
  { title: "model 4", id: 3 },
  { title: "model 5", id: 4 },
];
class ModelPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        baseline_on_original: {},
        baseline_on_augmented: {},
        model_options: [],
        model_stats: {},
        precision: [],
      },

      value: { title: "model 1", id: 4 },
    };
    // const [value, setValue] = React.useState(options[0]);
    // const [inputValue, setInputValue] = React.useState("");
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
    // const []

    return (
      <div className="content">
        <p style={{ color: "#707070" }}>
          <h4>Baseline Model on Original Dataset</h4>
        </p>
        <Row>
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
                      <p className="card-category">Precision</p>
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
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Accuracy</p>
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
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Recall</p>
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
                      <p className="card-category">F1-Score</p>
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
        </Row>

        <p style={{ color: "#707070" }}>
          <h4>Baseline Model on Augmented Dataset</h4>
        </p>
        <Row>
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
                      <p className="card-category">Precision</p>
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
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Accuracy</p>
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
                      <i className="nc-icon nc-bulb-63 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Recall</p>
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
                      <p className="card-category">F1-Score</p>
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
        </Row>

        <br />
        <p style={{ color: "#707070" }}>
          <h4>Baseline Model on Original Dataset</h4>
        </p>

        <Autocomplete
          id="combo-box-demo"
          options={model_types}
          getOptionLabel={(option) => option.title}
          style={{ width: 300 }}
          value={this.state.value}
          onChange={(event, newValue) => {
            this.setState({
              value: newValue,
            });
            console.log("new title", this.state.value.title);
            console.log("new value", this.state.value.id);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Combo box" variant="outlined" />
          )}
        />
        <br />
        {/* <p style = {{color: "#707070"}}><h4>Baseline Model on Augmented Dataset</h4></p> */}

        <Row>
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
                      <p className="card-category">Precision</p>

                      <CardTitle tag="p">
                        {this.state.data.precision[this.state.value.id]}
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
                      <i className="nc-icon nc-trophy text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Accuracy</p>
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
        </Row>
        <Row>
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
                      <p className="card-category">Recall</p>
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
                      <p className="card-category">F1-Score</p>
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
        </Row>
      </div>
    );
  }
}

export default ModelPerformance;
