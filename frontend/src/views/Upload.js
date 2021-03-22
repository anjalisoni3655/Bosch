import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
let number_images = 0;
class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.state = {
      number: 0,
    };
  }

  // const [file,setfile] : {};

  async handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData();
    console.log(this.uploadInput.files);

    data.append("file", this.uploadInput.files[0]);

    const className = this.props.datasetClass;

    const res = await axios.post(
      `http://localhost:5000/upload?className=${className}`,
      data
    );
    console.log(res.data);
    if (res.status == 200) {
      console.log("Images");
      console.log(res.data);
      this.setState({ number: parseInt(res.data) });
      number_images = this.state.number;
      this.props.gridImages(this.state.number);
      toast.success("🦄 Data uploaded succesfully");
      // window.location.reload(false);
    } else {
      toast.error("💀 Error : " + res.data);
    }
    // window.location.reload();
  }

  render() {
    return (
      <div>
        <form>
         
            <Col>
              <Row style={{ justifyContent: "center" }}>
                <input
                  ref={(ref) => {
                    this.uploadInput = ref;
                }}
                style={{marginLeft:"100px"}}
                  type="file"
                  id="file"
                  accept=".zip"
                />
              </Row>

              <Row style={{ justifyContent: "center" }}>
                <Button onClick={this.handleUploadImage}>Upload</Button>
              </Row>
            </Col>
         
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export { number_images, Upload };
// export default Upload;
