import { stripBasename } from "history/PathUtils";
import React, { useState } from "react";
import { render } from "react-dom";
import Gallery from "react-grid-gallery";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import image1 from "../assets/uploaded/images/1.ppm";

class Augment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      currentImage: 0,
    };

    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  //   componentDidMount() {
  //     // Simple GET request using axios
  //     axios.get('http://localhost:5000/uploads/document')
  //         .then(response => this.setState({ totalReactPackages: response.data.total }));
  // }

  onCurrentImageChange(index) {
    this.setState({ currentImage: index });
  }

  deleteImage() {
    if (
      window.confirm(
        `Are you sure you want to delete image number ${this.state.currentImage}?`
      )
    ) {
      var images = this.state.images.slice();
      images.splice(this.state.currentImage, 1);
      this.setState({
        images: images,
      });
    }
  }

  render() {
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
        {/* <div
          style={{
            padding: "2px",
            color: "#666",
          }}
        >
          Current image: {this.state.currentImage}
        </div> */}
        <Gallery
          images={this.props.images}
          enableLightbox={true}
          enableImageSelection={false}
          currentImageWillChange={this.onCurrentImageChange}
          customControls={[
            <button key="deleteImage" onClick={this.deleteImage}>
              Delete Image
            </button>,
          ]}
        />
      </div>
    );
  }
}
export default Augment;
