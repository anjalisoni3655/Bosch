import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  root: {
    backgroundColor: "red",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
   // color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
});
let number_images = 0;
class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.state = {
      number: 0,
      loading:false,
    };
  }

  // const [file,setfile] : {};

  async handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData();
    console.log(this.uploadInput.files);

    data.append("file", this.uploadInput.files[0]);

    const className = this.props.datasetClass;
    this.setState({
      loading: true,
    });

    const res = await axios.post(
      `http://localhost:5000/upload?className=${className}`,
      data
    );
     
    console.log("Response ",res.data);
    if (res.status == 200) {
      console.log("Images");
      console.log(res.data);
      this.setState({ number: parseInt(res.data) });
      number_images = this.state.number;
      this.props.gridImages(this.state.number);
     
      toast.success("Data uploaded succesfully");
       this.setState({
         loading: false,
       });
      // window.location.reload(false);
    } else {
      toast.error("💀 Error : " + res.data);
      this.setState({
        loading: false,
      });
    }
    // window.location.reload();
  }

  render() {
     const { classes } = this.props;
    return (
      <div>
        <form>
          <Col>
            <Row style={{ justifyContent: "center" }}>
              <input
                ref={(ref) => {
                  this.uploadInput = ref;
                }}
                style={{ marginLeft: "100px" }}
                type="file"
                id="file"
                accept=".zip"
              />
            </Row>

            <Row style={{ justifyContent: "center" }}>
              <div
                className={classes.wrapper}
              >
                <Button
                 // variant="contained"
                 // color="primary"
                  //className={buttonClassname}
                  disabled={this.state.loading}
                  onClick={this.handleUploadImage}
                  value={this.props.title}
                >
Upload
                </Button>
                {this.state.loading && (
                  <CircularProgress
                    size={24}
                   className={classes.buttonProgress}
                  />
                )}
              </div>
            </Row>
          </Col>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default withStyles(useStyles)(Upload);
// export default Upload;
