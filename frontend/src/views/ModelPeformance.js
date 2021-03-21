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

const options = ["1", "2"];

export default function ModelPerformance() {
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div className="content">
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Controllable" variant="outlined" />
        )}
      />
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
                <CardTitle tag="p">{value}</CardTitle>
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
      <div>{`value: ${value !== null ? `'${value}'` : "null"}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div>
    </div>
  );
}
