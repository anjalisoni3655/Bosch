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
    this.fileValidate = this.fileValidate.bind(this);
  }

  /*  var axios = require('axios');

   */
  fileValidate() {
    var fileInput = document.getElementById("file");

    var filePath = fileInput.value;

    // Allowing file type
    var allowedExtensions = "zip";
    
    if (!allowedExtensions.exec(filePath)) {
      alert("Invalid file type");
      fileInput.value = "";
      return false;
    }
  }

  async handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);
    console.log("data", data);
    const res = await axios.post("http://localhost:5000/upload", data);

    console.log("file uploadede");

    if (res.data == "OK") {
      this.setState({
        isUploaded: true,
      });
      // alert("File Uploaded");
    } else {
      alert("File not  Uploaded");
    }

    console.log("isuploade", this.state.isUploaded);
    console.log(res);
    console.log(res.data);
  }
  handleClose() {
    this.setState({
      isUploaded: false,
    });
  }

  render() {
    return (
      <div>
        {this.state.isUploaded && (
          <Toast
            onClose={this.handleClose.bind(this)}
            show={this.state.isUploaded}
            delay={3000}
            autohide
            style={{
              position: "absolute",
              top: -90,
              right: -20,
            }}
          >
            <Toast.Header>
              <strong className="mr-auto">File Uploaded Successfully</strong>
            </Toast.Header>
          </Toast>
        )}
        <form>
          {/* <div style={{ color: "black" }}>Add New Data</div> */}
          <div style={{ textAlign: "center" }}>
            <Row>
              <Col>
                <b style={{fontWeight: '700'}}>Only zip files are accepted</b>                
              </Col>
            </Row>
            <Row>
              <Col style={{ padding: "1em 0 0 2em" }}>
                <input
                  ref={(ref) => {
                    this.uploadInput = ref;
                  }}
                  type="file"
                  id="file"
                  accept=".zip"
                />
              </Col>

              <Col>
                <Button
                  onChange={this.fileValidate}
                  onClick={this.handleUploadImage}
                >
                  Upload
                </Button>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    );
  }
}

export default Upload;
