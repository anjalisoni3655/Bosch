import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import axios from "axios";
// import '../App.css';
//import {toast} from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

const notify = () => {
  // Calling toast method by passing string
  // toast('Hello Geeks')
};

class Upload extends React.Component {
  // const [file, selectFile] = useFileUpload()
  constructor(props) {
    super(props);
    this.state = {
      imageURL: "",
      isUploaded: false,
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);

    fetch("http://localhost:5000/upload", { method: "POST", body: data }).then(
      (response) => {
        response.json().then((body) => {
          alert("Your file is being uploaded!");
          this.state.isUploaded = true;
          console.log("isuploaded", this.state.isUploaded);
          this.setState({
            imageURL: `http://localhost:5000/uploads/${body.file}`,
          });
        });
      }
    );
  }

  render() {
    return (
      <div>
        {this.state.isUploaded && (
          <Row>
            <Col xs={6}>
              <Toast
                onClose={() => (this.state.isUploaded = false)}
                show={this.state.isUploaded}
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
            </Col>
          </Row>
        )}
        <form>
          <div>
            <input
              ref={(ref) => {
                this.uploadInput = ref;
              }}
              type="file"
            />
            <Button onClick={this.handleUploadImage}>Upload</Button>
          </div>
        </form>
        <br />
        <div>OR</div>
        <br />
        <form>
          <div>
            <input
              ref={(ref) => {
                this.uploadInput = ref;
              }}
              type="file"
              name="Choose from sample data"
            />
            <Button onClick={this.handleUploadImage}>Upload</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default Upload;
