import Upload from "./Upload";
import React,{useRef} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";

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
const useStyles = makeStyles({
  root: {
    width: 300,
  },
  text: {
    width: 50,
    height: 30,
  },
});
const marks = [
  {
    value: 0,
    label: "0",
  },
  
  {
    value: 1,
    label: "1",
  },
];

function valuetext(value) {
  return `${value}`;
}

export default function User() {
   const valueRef = useRef(""); //creating a refernce for TextField Component

   const showText = () => {
     return console.log("text",valueRef.current.value); //on clicking button accesing current value of TextField and outputing it to console
   };
  const classes = useStyles();
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    console.log("newValue", newValue);
    
    setValue(newValue);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
            <Card className="card-user" style={{ height: "130px" }}>
              <CardBody>
                <p className="description text-center">
                  <Upload></Upload>
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-user" style={{ height: "130px" }}>
              <CardBody>
                <p className="description text-center">
                  <div style={{ color: "black" }}>Sample from Existing Data</div>
                  <Slider 
                    value={value}
                    defaultValue={0.1}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min = {0}
                    max = {1}
                    step = {0.1}
                    aria-labelledby="discrete-slider"
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                  />
                  <Button color = "primary" >Add</Button>
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Col md="6">
          <Card className="card-user">
            <CardHeader>
              <CardTitle tag="h5">Add Augmentation</CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <Col>
                  <Row className="pr-1" md="12">
                    <FormGroup>
                      <label>Brightness</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              inputRef={valueRef}
                              id="outlined-basic"
                              size="small"
                              label="Probabilty"
                              variant="outlined"
                              onChange={showText}
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>
                  <Row className="px-1" md="12">
                    <FormGroup>
                      <label>Contrast</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probabilty"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>
                  <Row className="pl-1" md="12">
                    <FormGroup>
                      <label htmlFor="exampleInputEmail1">Sharpness</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probabilty"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row className="pr-1" md="12">
                    <FormGroup>
                      <label>Skewness</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probabilty"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>
                  <Row className="pl-1" md="12">
                    <FormGroup>
                      <label>Add Noise to the image</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probabilty"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row md="12">
                    <FormGroup>
                      <label>Weather Filters</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probabilty"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>
                </Col>

                <Row>
                  <div className="update ml-auto mr-auto">
                    <Button color="primary" type="submit">
                      Add Augmentation
                    </Button>
                  </div>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </div>
    </>
  );
}
