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
const useStyles = makeStyles((theme) => ({
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

export default function AddData() {
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

  const showText = () => {
    return console.log("text", valueRef.current.value); //on clicking button accesing current value of TextField and outputing it to console
  };
  const classes = useStyles();
  const [percent, setPercent] = React.useState(10);

  const samplePercent = {
    sample: percent,
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
  };

  const handleSample = () => {
    console.log(samplePercent);
    const res = axios.post("http://localhost:5000/sample", samplePercent).then(
      (response) => {
        console.log("response: ", response);
        if (response.data == "OK") {
          toast.success("🦄 Data Sampled succesfully");
        } else {
          toast.error("💀 Error : " + response.data);
        }
      },
      (error) => {
        console.log("error: ", error);
      }
    );
  };

  const handlePercent = (event, newValue) => {
    setPercent(newValue);
  };

  return (
    <div className="content">
      <ToastContainer />
      <Row>
        <Col md="6">
          <Card className="card-user" style={{ height: "180px" }}>
            <CardHeader>
              <CardTitle tag="h5" style={{ textAlign: "center" }}>
                Add New Data
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="description text-center">
                <Upload></Upload>
              </p>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="card-user" style={{ height: "180px" }}>
            <CardHeader>
              <CardTitle tag="h5" style={{ textAlign: "center" }}>
                Sample from Existing Data
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="description text-center">
                <div>
                  <Row>
                    <Col>
                      <Typography>Percentage of Sample Data</Typography>
                      <Slider
                        value={percent}
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
                        onChange={handlePercent}
                        valueLabelDisplay="auto"
                        aria-labelledby="non-linear-slider"
                      />
                    </Col>
                    <Col>
                      <Button
                        color="primary"
                        type="submit"
                        onClick={handleSample}
                      >
                        Sample
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

     
    </div>
  );
}
