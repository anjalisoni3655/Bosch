import React, { useState } from "react";
import { render } from "react-dom";
import Gallery from "react-grid-gallery";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

const IMAGES = [
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail:
      "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail:
      "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail:
      "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail:
      "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [
      { value: "Ocean", title: "Ocean" },
      { value: "People", title: "People" },
    ],
    caption: "Boats (Jeshu John - designerspics.com)",
  },

  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail:
      "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
  },
  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail:
      "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
  },
  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail:
      "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
  },
  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail:
      "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
  },
];
class Augment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: IMAGES,
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
        <div
          style={{
            padding: "2px",
            color: "#666",
          }}
        >
          Current image: {this.state.currentImage}
        </div>
        <Gallery
          images={this.state.images}
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
