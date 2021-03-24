import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { render } from "react-dom";
import Gallery from "react-grid-gallery";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { number_images } from "./Upload";
import { toast } from "react-toastify";

class Augment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: this.props.images,

      currentImage: 0,
    };

    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    console.log(this.state.images);
  }

  componentDidUpdate(prevProps) {
    
    if (prevProps.images !== this.props.images) {
      this.setState({
        images: this.props.images
      });
      
    }
    console.log("PROPS CHANGED");
  }
 

  onCurrentImageChange(index) {
    this.setState({ currentImage: index });
  }

  deleteImage() {
    
      var images = this.state.images.slice();
      console.log(images[this.state.currentImage])
      images.splice(this.state.currentImage, 1);
      this.setState({
        images: images,
      });
    const res = axios.post(`http://localhost:5000/delete-file?fileid=${images[this.state.currentImage].id}`).then((res) => {
      
      console.log("Deleted file : ", this.state.currentImage );
      console.log(res, res.status)
      if (res.status == 200) {
        toast.success("Deleted successfully", {

          autoClose: 1000,
        })
      }
      else {
        toast.error("Delete failed", {

          autoClose: 1000,
        });
      }
    });
    
    
  }

  render() {
    console.log("RENDERING : ",this.state.images);
    return (
      
      <div
        style={{
          display: "block",
          minHeight: "1px",
          width: "100%",
          border: "1px solid #ddd",
          overflow: "auto",
        }}
      >
        {this.props.showDelete ? (
          <Gallery
            images={this.state.images}
            enableLightbox={true}
            enableImageSelection={false}
            currentImageWillChange={this.onCurrentImageChange}
            customControls={[
              
              <IconButton>
                <DeleteIcon key="deleteImage" onClick = {this.deleteImage} style={{ color:"white", size:"20px" }}> 

                </DeleteIcon>
              </IconButton>
            ]}
          />
        ) : (
          <Gallery
            images={this.state.images}
            enableLightbox={true}
            enableImageSelection={false}
            currentImageWillChange={this.onCurrentImageChange}
          />
        )}
        <ToastContainer />
      </div>
    );
  }
}
export default Augment;
