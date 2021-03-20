import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import firebase from "firebase/app";
import "firebase/storage";

// var firebaseConfig = {
//   apiKey: "AIzaSyAFK5tQRC7uAyDbvYc-19q1F-eGdCDV5oE",
//   authDomain: "bosch-traffic-signal.firebaseapp.com",
//   projectId: "bosch-traffic-signal",
//   storageBucket: "bosch-traffic-signal.appspot.com",
//   messagingSenderId: "852991309472",
//   appId: "1:852991309472:web:8637044c6c5c67f21c3bc5",
//   measurementId: "G-LB38RGW5F6"
// };
// firebase.initializeApp(firebaseConfig);

// firebase.analytics();
// import storage from "../Firebase/index";

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
    
    
    const res = await axios.post("http://localhost:5000/upload", data);

    // const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
    // uploadTask.on('state_changed', (snapshot) => {
    // // Observe state change events such as progress, pause, and resume
    // }, (error) => {
    //   // Handle unsuccessful uploads
    //   console.log(error);
    // }, () => {
    //    // Do something once upload is complete
    //    console.log('success');
    // });

    

    if (res.data == "OK") {
      toast.success('🦄 Data uploaded succesfully');
    } else {
      toast.error("💀 Error : "+res.data);
    }

  }
 

  render() {
    return (
      <div>
        
        
        <form>
          {/* <div style={{ color: "black" }}>Add New Data</div> */}
          <div style={{ textAlign: "center" }}>
            <Row>
              <Col>
                <b style={{fontWeight: '700'}}>For Class : {this.props.datasetClass}</b>                
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
                  
                  onClick={this.handleUploadImage}
                >
                  Upload
                </Button>
              </Col>
            </Row>
          </div>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default Upload;
