import Upload from "./Upload";
import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Select from "@material-ui/core/Select";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";

import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import Augment from "./augment";

const initialValues = {
  prob1: "",
  prob2: "",
  prob3: "",
  prob4: "",
  prob5: "",
  prob6: "",
  prob7: "",
  prob8: "",
  prob9: "",
  prob10: "",
  prob11: "",
};
const url = `http://localhost:5000/static/grid/augmented/image/`;

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "200%",
  },
  root: {
    width: 300,
  },
  text: {
    width: 50,
    height: 30,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const marks = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
];

function valuetext(value) {
  return `${value}`;
}
function valueLabelFormat(value) {
  return `${value}%`;
}

let start = 1;

export default function User() {
  const [rain, setRain] = React.useState({
    age: "",
    name: "hai",
  });

  const handleRain = (event) => {
    const name = event.target.name;
    setRain({
      ...rain,
      [name]: event.target.value,
    });
  };
  console.log("Rain", rain);
  const [values, setValues] = useState(initialValues);

  const handleProb = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  if (start) {
    console.log(values);
    for (let property in values) {
      values[property] = "0.10";
    }
    start = 0;
  }
  const [brightness, setBrightness] = useState([-0.2, 0.2]);
  const [contrast, setContrast] = useState([-0.2, 0.2]);
  const [noise, setNoise] = useState([10, 30]);
  const [fog, setFog] = useState([0.1, 0.4]);
  const [shadow, setShadow] = useState([1, 3]);
  const [snow, setSnow] = useState([0.1, 0.4]);
  const [sunflare, setSunflare] = useState([3, 10]);
  const [shear, setShear] = useState([-10, 10]);
  const [blur, setBlur] = useState([10, 30]);
  const [degrade, setDegrade] = useState([5, 20]);

  const handleBrightness = (event, newValue) => {
    setBrightness(newValue);
  };
  const handleContrast = (event, newValue) => {
    setContrast(newValue);
  };
  const handleNoise = (event, newValue) => {
    setNoise(newValue);
  };
  const handleFog = (event, newValue) => {
    setFog(newValue);
  };
  const handleShadow = (event, newValue) => {
    setShadow(newValue);
  };
  const handleSnow = (event, newValue) => {
    setSnow(newValue);
  };
  const handleSunflare = (event, newValue) => {
    setSunflare(newValue);
  };
  const handleShear = (event, newValue) => {
    setShear(newValue);
  };
  const handleBlur = (event, newValue) => {
    setBlur(newValue);
  };
  const handleDegrade = (event, newValue) => {
    setDegrade(newValue);
  };

  const data = {
    brightness: [...brightness, values.prob1],
    contrast: [...contrast, values.prob2],
    noise: [...noise, values.prob3],
    fog: [...fog, values.prob4],
    shadow: [...shadow, values.prob5],
    snow: [...snow, values.prob6],
    sunflare: [...sunflare, values.prob7],
    shear: [...shear, values.prob8],
    blur: [...blur, values.prob9],
    degrade: [...degrade, values.prob10],
    rain: [rain.age, values.prob11],
  };

  const valueRef = useRef(""); //creating a refernce for TextField Component

  const classes = useStyles();
  const [percent, setPercent] = React.useState(10);
  const [trainPercent, setTrainPercent] = React.useState(90);

  const samplePercent = {
    sample: percent,
  };
  const trainPercentData = {
    train: trainPercent,
  };
  console.log("data", data);
  const handleAugment = () => {
    const res = axios.post("http://localhost:5000/augment", data).then(
      (response) => {
        console.log("response: ", response);
        if (response.data == "OK") {
          toast.success("🦄 Data Augmented succesfully");
        } else {
          toast.error("💀 Error : " + response.data);
        }
      },
      (error) => {
        console.log("error: ", error);
      }
    );
    // window.location.reload();
  };
  const sendTrainPercent = () => {
    const res = axios
      .post("http://localhost:5000/train-percent", trainPercentData)
      .then(
        (response) => {
          console.log("response: ", response);
          if (response.data == "OK") {
            toast.success("🦄 Data Split and added succesfully");
          } else {
            toast.error("💀 Error : " + response.data);
          }
        },
        (error) => {
          console.log("error: ", error);
        }
      );
  };

  const handleTrainPercent = (event, newValue) => {
    setTrainPercent(newValue);
  };

  return (
    <div className="content">
      <ToastContainer />

      <Card className="card-user" className={classes.card}>
        <CardHeader>
          <CardTitle tag="h5" style={{ textAlign: "center" }}>
            Add Augmentation
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Brightness</label>
                          <Slider
                            value={brightness}
                            // defaultValue={[0, 1]}
                            min={-1}
                            max={1}
                            step={0.1}
                            onChange={handleBrightness}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: -1, label: "-1" },
                              { value: 1, label: "1" },
                              { value: 0, label: "0" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            name="brightness"
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            // marks = {{0:"0", 1:"1"}}
                            value={values.prob1}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob1"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob1}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Contrast</label>
                          <Slider
                            value={contrast}
                            // defaultValue={[0, 1]}
                            min={-1}
                            max={1}
                            step={0.1}
                            onChange={handleContrast}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: -1, label: "-1" },
                              { value: 1, label: "1" },
                              { value: 0, label: "0" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            name="contrast"
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob2}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob2"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob2}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Noise</label>
                          <Slider
                            value={noise}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={50}
                            step={1}
                            onChange={handleNoise}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 50, label: "50" },
                              { value: 0, label: "0" },
                              { value: 25, label: "25" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob3}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob3"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob3}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <FormControl
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel htmlFor="outlined-age-native-simple">
                              Rain
                            </InputLabel>
                            <Select
                              native
                              value={rain.age}
                              onChange={handleRain}
                              label="Age"
                              inputProps={{
                                name: "age",
                                id: "outlined-age-native-simple",
                              }}
                            >
                              <option aria-label="None" value="" />
                              <option value={0}>Drizzle</option>
                              <option value={1}>Heavy</option>
                              <option value={2}>Torrestial</option>
                            </Select>
                          </FormControl>
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob11}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob11"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob11}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
              </Col>

              <Divider orientation="vertical" flexItem />

              <Col>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Fog</label>
                          <Slider
                            value={fog}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={1}
                            step={0.1}
                            onChange={handleFog}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 0, label: "0" },
                              { value: 1, label: "1" },
                              { value: 0.5, label: "0.5" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob4}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob4"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob4}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Shadow</label>
                          <Slider
                            value={shadow}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={5}
                            step={1}
                            onChange={handleShadow}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 5, label: "5" },
                              { value: 0, label: "0" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob5}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob5"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob5}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Snow</label>
                          <Slider
                            value={snow}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={1}
                            step={0.1}
                            onChange={handleSnow}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 1, label: "1" },
                              { value: 0, label: "0" },
                              { value: 0.5, label: "0.5" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob6}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob6"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob6}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Sunflare</label>
                          <Slider
                            value={sunflare}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={20}
                            step={1}
                            onChange={handleSunflare}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 20, label: "20" },
                              { value: 0, label: "0" },
                              { value: 10, label: "10" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob7}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob7"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob7}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
              </Col>

              <Divider orientation="vertical" flexItem />

              <Col>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Shear</label>
                          <Slider
                            value={shear}
                            // defaultValue={[0, 1]}
                            min={-30}
                            max={30}
                            step={1}
                            onChange={handleShear}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: -30, label: "-30" },
                              { value: 30, label: "30" },
                              { value: 0, label: "0" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob8}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob8"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob8}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Blur</label>
                          <Slider
                            value={blur}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={50}
                            step={1}
                            onChange={handleBlur}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 0, label: "0" },
                              { value: 25, label: "25" },
                              { value: 50, label: "50" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob9}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob9"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob9}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
                <Row className="pl-1" md="12">
                  <FormGroup>
                    <div style={{ padding: "1em" }} className={classes.root}>
                      <Row>
                        <Col md="8">
                          <label>Degrade</label>
                          <Slider
                            value={degrade}
                            // defaultValue={[0, 1]}
                            min={0}
                            max={30}
                            step={1}
                            onChange={handleDegrade}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 0, label: "0" },
                              { value: 15, label: "15" },
                              { value: 30, label: "30" },
                            ]}
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                          />
                        </Col>
                        <Col md="4" className={classes.text}>
                          <label>Probabilty</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={values.prob10}
                            onChange={handleProb}
                            size="small"
                            label="Probabilty"
                            name="prob10"
                            id="outlined-basic"
                            variant="outlined"
                          ></input>

                          <div>{values.prob10}</div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Row>
              </Col>
            </Row>
          </Form>
        </CardBody>
        <div
          className="update ml-auto mr-auto"
          style={{ justifyContent: "center" }}
        >
          <Button color="primary" onClick={handleAugment}>
            Apply
          </Button>
        </div>
      </Card>

      <Augment url={url} showDelete={true}></Augment>

      <br />
      <Row style={{ justifyContent: "center" }}>
        <Typography>Percentage of Train Data</Typography>
      </Row>
      <Row style={{ justifyContent: "center" }}>
        <Slider
          value={trainPercent}
          min={0}
          step={5}
          max={100}
          style={{ width: "150px" }}
          marks={[
            { value: 0, label: "0" },
            { value: 100, label: "100" },
          ]}
          getAriaValueText={valueLabelFormat}
          valueLabelFormat={valueLabelFormat}
          onChange={handleTrainPercent}
          valueLabelDisplay="auto"
          aria-labelledby="non-linear-slider"
        />
      </Row>
      <Row style={{ justifyContent: "center" }}>
        <Button onClick={sendTrainPercent}>Add to Dataset</Button>
      </Row>
    </div>
  );
}
