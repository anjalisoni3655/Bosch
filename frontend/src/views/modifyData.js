import Upload from "./Upload";
import React, { useRef, useEffect, useState, useReducer } from "react";
import Countdown from 'react-countdown';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Select from "@material-ui/core/Select";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Box from '@material-ui/core/Box';

import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Row,
  Col,
} from "reactstrap";
import Augment from "./augment";
import LinearWithValueLabel from "./linearProgress";

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
// const url = `http://localhost:5000/static/grid/augmented/`;

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "200%",
  },
  card2: {
    maxWidth: "70%",
  },
  card3: {
    width: "200%",
    //  width:"1000px",
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
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    // color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function valuetext(value) {
  return `${value}`;
}
function valueLabelFormat(value) {
  return `${value}%`;
}
function expformat(value) {
  const [coefficient, exponent] = value
    .toExponential()
    .split("e")
    .map((item) => Number(item));
  return `${Math.round(coefficient)}e^${exponent}`;
}
let start = 1;
var Images = [];
function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="90%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
const model_dataset = [
  "Baseline",
  "BaselineAugmented",
  "InceptionV3",
  "MobileNetV2",
  "MobileNetV3",
];
let total_epochs = 1;
export default function User() {
  const [rain, setRain] = React.useState({
    age: "",
    name: "hai",
  });
  const optimizer_dataset = ["Adam", "RMSprop", "SGD"];
  const [selectedFile, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  
  const [modelType, setmodelType] = useState(model_dataset[0]);
  const [optimizer, setOptimizer] = useState(optimizer_dataset[0]);
  const handleRain = (event) => {
    const name = event.target.name;
    setRain({
      ...rain,
      [name]: event.target.value,
    });
  };

  const [values, setValues] = useState(initialValues);

  const [training, setTraining] = useState(false);

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
  const [noise, setNoise] = useState([10, 20]);
  const [fog, setFog] = useState([0.1, 0.4]);
  const [shadow, setShadow] = useState([1, 3]);
  const [snow, setSnow] = useState([0.1, 0.4]);
  const [sunflare, setSunflare] = useState([3, 5]);
  const [shear, setShear] = useState([-10, 10]);
  const [blur, setBlur] = useState([10, 20]);
  const [degrade, setDegrade] = useState([5, 10]);

  const handleBrightness = (event, newValue) => {
    setBrightness(newValue);
  };
  const fileChange = (event, newValue) => {
    setFile(event.target.files[0]);
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

  const classes = useStyles();

  const [trainPercent, setTrainPercent] = React.useState(90);
  const [epochs, setEpochs] = React.useState(1);
  const [lr, setLearningRate] = React.useState(0.0001);

  const [numberImages, setnumberImages] = useState(0);
  const [datasetChanged, setChanged] = React.useState(1);
  const [estimatedTrainingTime,setEstimate] = React.useState(Date.now()+180000);
  const [progress, setProgress] = React.useState(0);
  const handleChanged = (newValue) => {
    setChanged(newValue);
  };
  const handleNumberOfImages = (event, newValue) => {
    setnumberImages(parseInt(newValue));
  };
  React.useEffect(() => {
    
    const timer = setInterval(() => {
      
      console.log("interval valled");
      
      axios.get(`http://localhost:5000/get-train-progress`).then((res) => {
        console.log(res.data);
        console.log(res.data.epochs_done, total_epochs)
        setProgress(100*(res.data.epochs_done/total_epochs))
        if(res.data.epochs_done < total_epochs && res.data.time_left!=-1){
          setEstimate(Date.now() + parseInt(res.data.time_left))
        }
        
        console.log(estimatedTrainingTime)
        
        // console.log(this.state.allData.cardData.total_images)
      });
    }, 15000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const trainPercentData = {
    train: trainPercent,
  };
  const trainingComplete = () => {
    
      toast.success("Model training completed!");
      toast.warn("Model saved as : Model_v2")
    setTraining(false);
  };
  const handleAugment = () => {
    setLoading(true);
    axios.post("http://localhost:5000/augment", data).then(
      (response) => {
        console.log("response: ", response);
        if (response.data !== "0") {
          toast.success("Data Augmented succesfully");

          var images_number = Math.min(1000, parseInt(response.data));
          setnumberImages(images_number);
          console.log("images", numberImages);

          setLoading(false);
          handleChanged(1);
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
  useEffect(() => {
    console.log("Effect called : ", datasetChanged);
    if (datasetChanged) {
      getImages(numberImages);
    } else {
      getImages(numberImages);
    }
  }, [datasetChanged]);
  function getImages(numberImages) {
    if (datasetChanged == 1) {
      Images = [];
      console.log("Regetting images");
      for (var i = 0; i < numberImages; i++) {
        var x = new Date().getTime().toLocaleString();
        Images.push({
          src:
            "http://localhost:5000/static/grid/augmented/" +
            i.toString() +
            ".png" +
            "?" +
            x,
          thumbnail:
            "http://localhost:5000/static/grid/augmented/" +
            i.toString() +
            ".png" +
            "?" +
            x,
          thumbnailWidth: 200,
          thumbnailHeight: 200,
          id: i,
        });
      }
      console.log("Get : ", numberImages);
      handleChanged(0);
    }
  }
  getImages(numberImages);
  const sendTrainPercent = () => {
    setLoading2(true);
    axios.post("http://localhost:5000/train-percent", trainPercentData).then(
      (response) => {
        console.log("response: ", response);
        if (response.status === 200) {
          toast.success(
            "Data Split and " + response.data + " images added succesfully"
          );
          setLoading2(false);
          
          setTraining(false);
        } else {
          toast.error("💀 Error : " + response.data);
        }
      },
      (error) => {
        console.log("error: ", error);
      }
    );
  };
  const sendTrainRequest = () => {
    
    
    setTraining(true);
    const formData = new FormData();

    // Update the formData object
    formData.append("myFile", selectedFile);

    // Details of the uploaded file
    console.log(selectedFile);
    total_epochs = epochs;
    const res = axios
      .post("http://localhost:5000/train-model", {
        model: modelType,
        epochs: epochs,
        file: formData,
        lr: lr,
        optimizer: optimizer,
        
      })
      .then(
        (response) => {
          console.log("response: ", response);
          if (response.status === 200) {
            
            toast.success("Model training initiated successfully");
            toast.warn("Estimated completion time : " +Math.round(parseInt(response.data)/60000 )+" minutes")
            
            setEstimate(Date.now() + parseInt(response.data));
            
            
          } else {
            toast.error("Error : " + response.data);
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
  
  // const model_dataset= ['inception']
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
                          <Tooltip title="add brightness">
                            <Slider
                              value={brightness}
                              // defaultValue={[0, 1]}
                              min={-0.5}
                              max={0.5}
                              step={0.1}
                              onChange={handleBrightness}
                              valueLabelDisplay="auto"
                              marks={[
                                { value: -0.5, label: "-0.5" },
                                { value: 0.5, label: "0.5" },
                                { value: 0, label: "0" },
                              ]}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                              name="brightness"
                            />
                          </Tooltip>
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
                          <Tooltip title="add contrast">
                            <Slider
                              value={contrast}
                              // defaultValue={[0, 1]}
                              min={-0.5}
                              max={0.5}
                              step={0.1}
                              onChange={handleContrast}
                              valueLabelDisplay="auto"
                              marks={[
                                { value: -0.5, label: "-0.5" },
                                { value: 0.5, label: "0.5" },
                                { value: 0, label: "0" },
                              ]}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                              name="contrast"
                            />
                          </Tooltip>
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
                            max={30}
                            step={1}
                            onChange={handleNoise}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 30, label: "30" },
                              { value: 0, label: "0" },
                              { value: 15, label: "15" },
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
                            max={10}
                            step={1}
                            onChange={handleSunflare}
                            valueLabelDisplay="auto"
                            marks={[
                              { value: 10, label: "10" },
                              { value: 0, label: "0" },
                              { value: 5, label: "5" },
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
          <div className={classes.wrapper}>
            <Button
              // variant="contained"
              color="primary"
              //className={buttonClassname}
              disabled={loading}
              onClick={handleAugment}
              //  value={this.props.title}
            >
              Apply
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      </Card>

      {numberImages !== 0 ? (
        <Augment showDelete={true} images={Images}></Augment>
      ) : (
        <div></div>
      )}

      <br />
      <Row>
        <Col md="6">
          <Card className="card-user" style={{ height: "auto" }}>
            <CardHeader>
              <CardTitle tag="h5" style={{ textAlign: "center" }}>
                Percentage of Train Split
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="description text-center">
                <Col>
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

                  <Row style={{ justifyContent: "center" }}></Row>
                </Col>

                <div className={classes.button}>
                  <div className={classes.wrapper}>
                    <Button
                      // variant="contained"
                      color="primary"
                      //className={buttonClassname}
                      disabled={loading2}
                      onClick={sendTrainPercent}
                      //  value={this.props.title}
                    >
                      Apply
                    </Button>
                    {loading2 && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card className="card-user" style={{ height: "auto" }}>
            <CardHeader>
              <CardTitle tag="h5" style={{ textAlign: "center" }}>
                Retrain model on new data
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="description text-center">
                <Row style={{ justifyContent: "center" }}>
                  <Col>
                    <Autocomplete
                      onChange={(event, value) => setmodelType(value)}
                      id="combo-box-demo"
                      options={model_dataset}
                      getOptionLabel={(option) => option}
                      // style={{ width: 300, height: -30 }}
                      defaultValue = {model_dataset[0]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select model"
                          variant="outlined"
                        />
                      )}
                    />
                    <Row style={{ padding: "35px", justifyContent: "center" }}>
                      <Typography>OR</Typography>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                      <p style={{ textAlign: "center" }}>
                        <b style={{ fontWeight: "700" }}>
                          Upload Model JSON File
                        </b>
                      </p>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                      <input
                        type="file"
                        accept=".json"
                        style={{ marginLeft: "100px" }}
                        onChange={fileChange}
                      ></input>
                    </Row>
                  </Col>

                  <Col>
                    <Col>
                      <Typography>Epochs</Typography>
                    </Col>
                    <Col>
                      <Slider
                        value={epochs}
                        min={1}
                        step={1}
                        max={50}
                        style={{ width: "150px" }}
                        marks={[
                          { value: 0, label: "0" },
                          { value: 50, label: "50" },
                        ]}
                        getAriaValueText={valuetext}
                        valueLabelFormat={valuetext}
                        onChange={(event, value) => setEpochs(value)}
                        valueLabelDisplay="auto"
                        aria-labelledby="non-linear-slider"
                      />
                    </Col>
                    <Col>
                      <Typography>Learning rate</Typography>
                    </Col>
                    <Col>
                      <Slider
                        value={lr}
                        min={0.0001}
                        step={0.001}
                        max={0.1}
                        style={{ width: "150px" }}
                        marks={[
                          { value: 0.0001, label: "0.0001" },
                          { value: 0.1, label: "0.1" },
                        ]}
                        getAriaValueText={expformat}
                        valueLabelFormat={expformat}
                        onChange={(event, value) => setLearningRate(value)}
                        valueLabelDisplay="auto"
                        aria-labelledby="non-linear-slider"
                      />
                     
                    </Col>
                    <Col style={{ padding:"10px", justifyContent: "right" }}>
                      <Autocomplete 
                        onChange={(event, value) => setOptimizer(value)}
                        id="combo-box-demo"
                        options={optimizer_dataset}
                        getOptionLabel={(option) => option}
                        style={{ width: 200, height: -50 }}
                        defaultValue={optimizer_dataset[0]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select optimizer"
                            variant="outlined"
                          />
                        )}
                      />
                      </Col>

                  </Col>
                </Row>

                <div className={classes.button}>
                  <div className={classes.wrapper}>
                    <Button
                      // variant="contained"
                      color="primary"
                      //className={buttonClassname}
                      disabled={training}
                      onClick={sendTrainRequest}
                      //  value={this.props.title}
                    >
                      Train
                    </Button>
                    {training ? (
                              
                    <Typography>
                        Train time remaining :  
                      <br/>
                      <Countdown key={estimatedTrainingTime} date={estimatedTrainingTime} onComplete={trainingComplete} />
                        <LinearProgressWithLabel value={progress} />
                      
                    </Typography>
                    ) : 
                    null}

                    
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
