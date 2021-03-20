import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  // const [file,setfile] : {};

  async handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData();
    console.log(this.uploadInput.files);

    data.append("file", this.uploadInput.files[0]);

    this.props.gridImages(this.uploadInput.files[0]);

    const className = this.props.datasetClass;

    const res = await axios.post(
      `http://localhost:5000/upload-file?className=${className}`,
      data
    );

    if (res.data == "OK") {
      toast.success("🦄 Data uploaded succesfully");
    } else {
      toast.error("💀 Error : " + res.data);
    }
  }

  render() {
    return (
      <div>
        <form>
          {/* <div style={{ color: "black" }}>Add New Data</div> */}
          <div style={{ textAlign: "center" }}>
            {/* <Row>
              <Col>
                <b style={{fontWeight: '700'}}>For Class : {this.props.datasetClass}</b>                
              </Col>
            </Row> */}
            <Col>
              <Row style={{ padding: "1em 0 0 2em" }}>
                <input
                  ref={(ref) => {
                    this.uploadInput = ref;
                  }}
                  type="file"
                  id="file"
                  accept=".zip"
                />
              </Row>

              <Row style={{ justifyContent: "center" }}>
                <Button onClick={this.handleUploadImage}>Upload</Button>
              </Row>
            </Col>
          </div>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default Upload;
