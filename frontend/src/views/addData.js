import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Augment from "./augment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import Upload from "./Upload";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
// const url = `http://localhost:5000/static/grid/extracted/`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  card: {},

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
  button: {
    paddingBottom: "-100px",
    marginTop: "10px",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
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
  // gridList: {
  //   width: 500,
  //   height: 450,
  // },
}));

function valueLabelFormat(value) {
  return `${value}%`;
}

let start = 1;
var Images = [];

export default function AddData() {
  const [success, setSuccess] = useState(false);
  const [uploadClass, setuploadClass] = useState("NULL");
  const [checked, setChecked] = React.useState(false);

  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };
  const [checkedB, setCheckedB] = React.useState(false);

  const handleCheckB = (event) => {
    setuploadClass("NULL");
    setCheckedB(event.target.checked);
  };

  const classes = useStyles();
  const [percent, setPercent] = React.useState(1);
  const [datasetChanged, setChanged]= React.useState(1);
  const samplePercent = {
    sample: percent,
    className: uploadClass,
  };

  const handlePercent = (event, newValue) => {
    setPercent(newValue);
  };
  const handleChanged = (newValue) => {
    setChanged(newValue);
  };
  const [numberImages, setNumberImages] = useState(0);
  const handleSample = () => {
    setSuccess(true);
    
    const res = axios.post("http://localhost:5000/sample", samplePercent).then(
      (response) => {
        console.log("response: ", response);
        if (response.status == 200) {
          

      
          toast.success(response.data + " images sampled successfully ");

          
          var images_number = Math.min(1000, parseInt(response.data));
          setNumberImages(images_number);
          setSuccess(false);
          handleChanged(1);
          
        } else {
          toast.error("Error : " + response.data);
        }
      },
      (error) => {
        console.log("error: ", error);
      }
    );

    
    // window.location.reload();
  };

  function handleNoOfImages(no_of_images) {
    
    setNumberImages(no_of_images);
    handleChanged(1);
  }
  useEffect(() => {
    
    if (datasetChanged) {
      getImages(numberImages)
    } else {
      getImages(numberImages)
    }
  }, [datasetChanged]);
  function getImages(numberImages) {
    
    if(datasetChanged==1){
      Images = [];
      
      for (var i = 0; i < numberImages; i++) {
        var x = new Date().getTime().toLocaleString();
        Images.push({
          src:
            "http://localhost:5000/static/grid/extracted/" +
            i.toString() +
            ".png" +
            "?" +
            x,
          thumbnail:
            "http://localhost:5000/static/grid/extracted/" + i.toString() + ".png" + "?" + x,
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

  const classes_dataset = ['Speed limit (20km/h)', 'Speed limit (30km/h)', 'Speed limit (50km/h)', 'Speed limit (60km/h)', 'Speed limit (70km/h)', 'Speed limit (80km/h)', 'End of speed limit (80km/h)', 'Speed limit (100km/h)', 'Speed limit (120km/h)', 'No passing', 'No passing for vehicles over 3.5 metric tons', 'Right-of-way at the next intersection', 'Priority road', 'Yield', 'Stop', 'No vehicles', 'Vehicles over 3.5 metric tons prohibited', 'No entry', 'General caution', 'Dangerous curve to the left', 'Dangerous curve to the right', 'Double curve', 'Bumpy road', 'Slippery road', 'Road narrows on the right', 'Road work', 'Traffic signals', 'Pedestrians', 'Children crossing', 'Bicycles crossing', 'Beware of ice/snow', 'Wild animals crossing', 'End of all speed and passing limits', 'Turn right ahead', 'Turn left ahead', 'Ahead only', 'Go straight or right', 'Go straight or left', 'Keep right', 'Keep left', 'Roundabout mandatory', 'End of no passing', 'End of no passing by vehicles over 3.5 metric tons', 'No Stopping', 'Cross Road', 'No passing Cars', 'Route for Pedal Cycles Only', 'Separated Track for Pedal Cyclists and Pedestrians Only', 'Parking Sign', 'Tonnage Limits'];

  return (
    <div className="content">
      <ToastContainer />

      <Row>
        <Col md="6">
          <Card className="card-user" style={{ height: "50vh" }}>
            <CardHeader>
              <CardTitle tag="h5" style={{ textAlign: "center" }}>
                Add New Data
              </CardTitle>
              <p style={{ textAlign: "center" }}>
                <b style={{ fontWeight: "700" }}>Upload a zip file</b>
              </p>
            </CardHeader>
            <CardBody>
              <div className="description text-center">
                <Col>
                  <Row style={{ justifyContent: "center" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedB}
                          onChange={handleCheckB}
                          color="primary"
                        />
                      }
                      label="Add specific class"
                    />
                  </Row>
                  {checkedB ? (
                    <Row style={{ justifyContent: "center" }}>
                      <div style={{ height: "-20px" }}>
                        <Autocomplete
                          onChange={(event, value) => setuploadClass(value)}
                          id="combo-box-demo"
                          options={classes_dataset}
                          getOptionLabel={(option) => option}
                          style={{ width: 300, height: -10 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Class"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                    </Row>
                  ) : (
                    <div></div>
                  )}
                </Col>

                <div className={classes.button}>
                  <Upload
                    datasetClass={uploadClass}
                    gridImages={(e) => handleNoOfImages(e)}
                  ></Upload>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="card-user" style={{ height: "50vh" }}>
            <CardHeader>
              <CardTitle tag="h4" style={{ textAlign: "center" }}>
                Sample from Existing Data
              </CardTitle>
            </CardHeader>

            <CardBody>
              <div className="description text-center">
                <div>
                  <Col>
                    <Row style={{ justifyContent: "center" }}>
                      <Row>
                        <Col>
                          <Typography>Sample percentage</Typography>
                        </Col>
                        <Col>
                          <Slider
                            value={percent}
                            min={0}
                            step={0.1}
                            max={5}
                            style={{ width: "200px" }}
                            marks={[
                              { value: 0, label: "0%" },
                              { value: 5, label: "5%" },
                            ]}
                            getAriaValueText={valueLabelFormat}
                            valueLabelFormat={valueLabelFormat}
                            onChange={handlePercent}
                            valueLabelDisplay="auto"
                            aria-labelledby="non-linear-slider"
                          />
                        </Col>
                      </Row>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={handleCheck}
                            color="primary"
                          />
                        }
                        label="Classwise sampling"
                      />
                    </Row>
                    {checked ? (
                      <Row style={{ justifyContent: "center" }}>
                        <div style={{ height: "-20px" }}>
                          <Autocomplete
                            onChange={(event, value) => setuploadClass(value)}
                            id="combo-box-demo"
                            options={classes_dataset}
                            getOptionLabel={(option) => option}
                            style={{ width: 300, height: -10 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Class"
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                      </Row>
                    ) : (
                      <div></div>
                    )}
                    <Row style={{ justifyContent: "center" }}></Row>
                  </Col>
                </div>
                {/* <div className={classes.button}>
                  {" "}
                  <Button color="primary" onClick={handleSample}>
                    Sample
                  </Button>
                </div> */}
                <div className={classes.wrapper}>
                  <Button
                    // variant="contained"
                    color="primary"
                    //className={buttonClassname}
                    disabled={success}
                    onClick={handleSample}
                    //  value={this.props.title}
                  >
                    Sample
                  </Button>
                  {success && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {numberImages != 0 ? (
          <Augment showDelete={false} images={Images}></Augment>
        ) : (
          <div></div>
        )}
      </Row>
    </div>
  );
}
