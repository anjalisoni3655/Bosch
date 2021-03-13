import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useFileUpload } from 'use-file-upload'
import axios from "axios"
import '../App.css';

class Upload2 extends React.Component{
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
      <div className="content">       
        <form onSubmit={this.handleUploadImage}>
          <div>
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
            <button>Upload</button>       
          </div>
          <br />
          <div>
            OR
          </div>        
          <br />                
          <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" name="Choose from sample data"/>
            <button>Upload</button>               
          </div>

        </form>
      </div>  
    );
  }


  // return (
    // <Container>
    //   <button
    //     onClick={() => {
    //       // Single File Upload
    //       selectFile()
    //     }}
    //   >
    //     Click to Upload
    //   </button>

    //   {file ? (
    //     <div>
    //       <img src={file.source} alt='preview' />
    //       <span> Name: {file.name} </span>
    //       <span> Size: {file.size} </span>
    //     </div>
    //   ) : (
    //     <span>No file selected</span>
    //   )}
    // </Container>
// );  


}

export default Upload2