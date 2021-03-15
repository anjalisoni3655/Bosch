import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import axios from "axios";


class Upload extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      imageURL: "",
      isUploaded: false,
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  /*  var axios = require('axios');

   */

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);

    axios.post("http://localhost:5000/upload", data).then((res) => {
      console.log("file uploadede");
      alert("File Uploaded");
      this.state.isUploaded = true;
      console.log("isuploade", this.state.isUploaded);
      console.log(res);
      console.log(res.data);
    });
  }

  render() {
    return (
      <div >
        {this.state.isUploaded && (
          <Toast
            onClose={() => (this.state.isUploaded = false)}
            //show={this.state.isUploaded}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
              <strong className="mr-auto">Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              Woohoo, you're reading this text in a Toast!
            </Toast.Body>
          </Toast>
        )}
        <form>
          {/* <div style={{ color: "black" }}>Add New Data</div> */}
          <div style = {{padding: "0 0 0 2em", textAlign: "center"}}>
            <Row>
              <Col>
                <input
                  ref={(ref) => {
                    this.uploadInput = ref;
                  }}
                  type="file"
                />
              </Col>
              <Col>
                <Button onClick={this.handleUploadImage}>Upload</Button>
              </Col>
            </Row>
          </div>
        </form>
       
       
      </div>
    );
  }
}

export default Upload;
