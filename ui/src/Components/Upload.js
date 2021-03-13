import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useFileUpload } from 'use-file-upload'
import axios from "axios"

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
    data.append('filename', this.fileName.value);

    fetch('http://localhost:5000/upload', { method: 'POST', body: data })
    .then((response) => { response.json().then((body) => { 
        this.setState({ imageURL: `http://localhost:5000/${body.file}` });
      });
    });
  }

render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <div>
          <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
        </div>
        <br />
        <div>
          <button>Upload</button>
        </div>
        <img src={this.state.imageURL} alt="img" />
      </form>
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