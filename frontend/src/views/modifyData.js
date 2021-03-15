import Upload from "./Upload";
import React,{useRef} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import { RadioGroup } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';

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
    width: 350,
  },
  text: {
    width: 50,
    height: 30,
  },
});

const marks = [{value: 0,label: "0",},{value: 1,label: "1",},{value: -1,label: "-1",},];

const marks_noise = [{value: 0,label: "0",},{value: 50,label: "50",},]

const marks_fog = [{value: 0,label: "0",},{value: 1,label: "1",},]


function valuetext(value) {
  return `${value}`;
}

export default function User() {
   const valueRef = useRef(""); //creating a refernce for TextField Component

   const showText = () => {
     return console.log("text",valueRef.current.value); //on clicking button accesing current value of TextField and outputing it to console
   };
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 1]);

  const handleChange = (event, newValue) => {
    console.log("newValue", newValue);
    
    setValue(newValue);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
            <Card className="card-user" style={{ height: "200px" }}>
            <CardHeader>
              <CardTitle tag="h5" text-align = "center">Add New Data</CardTitle>
            </CardHeader>
              <CardBody>
                <p className="description text-center">
                  <Upload></Upload>
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-user" style={{ height: "200px" }}>
            <CardHeader>
              <CardTitle tag="h5" text-align = "center">Sample from Existing Data</CardTitle>
            </CardHeader>
              <CardBody>
                <p className="description text-center">
                  
                  <form>
                    <div style = {{padding: "0 0 0 4em", textAlign: "center"}}>
                      <Row>
                        <Col>
                            <Typography>
                              Percentage of Sample
                            </Typography>
                            <Slider
                              defaultValue={20}
                              getAriaValueText={valuetext}
                              onChange={handleChange}
                              aria-labelledby="discrete-slider-small-steps"
                              step={1}
                              marks = {[{value: 0,label: "0",},{value: 100,label: "100",},]}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                            />
                        </Col>
                        <Col>
                          <Button color = "primary" >Sample</Button>
                        </Col>
                      </Row>
                    </div>
                  </form>
                  
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
                              defaultValue={[-0.2, 0.2]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              min = {-1}
                              max = {1}
                              step = {0.1}
                              marks={[{value: 0,label: "0",},{value: 1,label: "1",},{value: -1,label: "-1",},]}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              inputRef={valueRef}
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                              onChange={showText}
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>
                  
                  <Row className="pr-1" md="12">
                    <FormGroup>
                      <label>Contrast</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[-0.3, 0.3]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              min = {-1}
                              max = {1}
                              step = {0.1}
                              marks={[{value: 0,label: "0",},{value: 1,label: "1",},{value: -1,label: "-1",},]}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row className="pr-1" md="12">
                    <FormGroup>
                      <label>Blur</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            {/* <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            /> */}
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row className="pr-1" md="12">
                    <FormGroup>
                      <label>Noise</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[0, 25]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              min = {0}
                              max = {50}
                              step = {1}
                              marks={[{value: 0,label: "0",},{value: 50,label: "50",},]}

                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row className="pr-1" md="12">
                    <FormGroup>
                      <label>Degrade</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            {/* <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={marks}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            /> */}
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  
                  <Row className = "pr-1" md="12">
                    <FormGroup>
                      <label>Random Fog</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[20, 37]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={[{value: 0,label: "0",},{value: 1,label: "1",},]}
                              min = {0}
                              max = {1}
                              step = {0.1}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  
                  <Row className = "pr-1" md="12">
                    <FormGroup>
                      <label>Random Snow</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[0.1, 0.3]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={[{value: 0,label: "0",},{value: 1,label: "1",},]}
                              min = {0}
                              max = {1}
                              step = {0.1}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row className = "pr-1" md="12">
                    <FormGroup>
                      <label>Random Shadow</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[0, 1]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={[{value: 0, label: "0",}, {value: 5,label: "5",},]}
                              min = {0}
                              max = {5}
                              step = {1}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
                              variant="outlined"
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormGroup>
                  </Row>

                  <Row className = "pr-1" md="12">
                    <FormGroup>
                      <label>Random Sunflare</label>
                      <div className={classes.root}>
                        <Row>
                          <Col md="8">
                            <Slider
                              value={value}
                              defaultValue={[0, 3]}
                              onChange={handleChange}
                              valueLabelDisplay="auto"
                              marks={[{value: 0, label: "0",}, {value: 20,label: "20",},]}
                              min = {0}
                              max = {20}
                              step = {1}
                              aria-labelledby="range-slider"
                              getAriaValueText={valuetext}
                            />
                          </Col>
                          <Col md="4" className={classes.text}>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              label="Probability"
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
                      Apply
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
