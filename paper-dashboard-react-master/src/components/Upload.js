import React from 'react'
import Button from 'react-bootstrap/Button';
import { useFileUpload } from 'use-file-upload'
import axios from "axios"
// import '../App.css';

class Upload extends React.Component{
  // const [file, selectFile] = useFileUpload()
  constructor(props) {
    super(props);
    this.state = {
        imageURL: "",
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
}

handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);

    fetch('http://localhost:5000/upload', { method: 'POST', body: data })
    .then((response) => { response.json().then((body) => { 
        this.setState({ imageURL: `http://localhost:5000/uploads/${body.file}` });
      });
    });
  }

render() {
    return (
      <div>       
        <form onSubmit={this.handleUploadImage}>
          <div>
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
            <Button variant="contained" color="primary">Upload</Button>       
          </div>
        </form>
        <br />
          <div>
            OR
          </div>        
          <br />          
        <form onSubmit={this.handleUploadImage}>              
          <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" name="Choose from sample data"/>
            <Button variant="contained" color="primary">Upload</Button>               
          </div>
        </form>
      </div>  
    );
  }

}

export default Upload