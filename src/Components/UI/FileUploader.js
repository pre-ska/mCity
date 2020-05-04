import React, { Component } from "react";
import { firebase } from "../../firebase";
import FileUploader from "react-firebase-file-uploader";
import CircularProgress from "@material-ui/core/CircularProgress";

class FileUpload extends Component {
  state = {
    name: "",
    isUploading: false,
    fileURL: ""
  };

  static getDerivedStateFromProps(props, state) {
    if (props.defaultImg) {
      return (state = {
        name: props.defaultImgName,
        fileURL: props.defaultImg
      });
    }
    return null;
  }

  handleUploadStart = () => {
    this.setState({
      isUploading: true
    });
  };

  handleUploadError = () => {
    this.setState({
      isUploading: false
    });
  };

  handleUploadSuccess = fileName => {
    this.setState({
      name: fileName,
      isUploading: false
    });

    //da dobijem public url za sliku koju sam uplodao na firebase storage
    firebase
      .storage()
      .ref(this.props.dir)
      .child(fileName)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        this.setState({
          fileURL: url
        });
      });

    this.props.fileName(fileName);
  };

  uploadAgain = () => {
    this.props.resetImage(this.state.name);

    this.setState({
      name: "",
      isUploading: false,
      fileURL: ""
    });
  };

  render() {
    return (
      <div>
        {!this.state.fileURL ? (
          <div>
            <div className="label_inputs">{this.props.tag}</div>
            <FileUploader
              accept="image/*"
              name="image"
              randomizeFilename
              storageRef={firebase.storage().ref(this.props.dir)}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
            />
          </div>
        ) : (
          <div className="image_upload_container">
            <img src={this.state.fileURL} alt="img" style={{ width: "100%" }} />
            <div onClick={this.uploadAgain} className="remove">
              Remove
            </div>
          </div>
        )}
        {this.state.isUploading ? (
          <div
            className="progress"
            style={{ textAlign: "center", margin: "30px 0" }}>
            <CircularProgress style={{ color: "#98c6e9" }} thickness={5} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default FileUpload;
