import React, { Component } from "react";
import AdminLayout from "../../../HOC/AdminLayout";
import FormFields from "../../UI/FormFields";
import { validate } from "../../UI/misc";

import { fbPlayers, fbdb, firebase } from "../../../firebase";
import { fbLooper } from "../../UI/misc";
import FileUpload from "../../UI/FileUploader";

export default class EditPlayer extends Component {
  state = {
    playerId: "",
    formType: "",
    formError: false,
    formSuccess: "",
    defaultImg: "",
    formData: {
      name: {
        element: "input",
        value: "",
        config: {
          label: "Name",
          name: "name_input",
          type: "text"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      lastname: {
        element: "input",
        value: "",
        config: {
          label: "Last name",
          name: "lastname_input",
          type: "text"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      number: {
        element: "input",
        value: "",
        config: {
          label: "Number",
          name: "number_input",
          type: "text"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      position: {
        element: "select",
        value: "",
        config: {
          label: "Select a position",
          name: "select_position",
          type: "select",
          options: [
            { key: "Keeper", value: "Keeper" },
            { key: "Defence", value: "Defence" },
            { key: "Midfield", value: "Midfield" },
            { key: "Striker", value: "Striker" }
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      image: {
        element: "image",
        value: "",
        validation: {
          required: true
        },
        valid: false
      }
    }
  };

  updateFields = (player, playerId, formType, defaultImg) => {
    const newFormData = { ...this.state.formData };

    for (let key in newFormData) {
      newFormData[key].value = player[key];
      newFormData[key].valid = true;
    }
    this.setState({
      playerId,
      defaultImg,
      formType,
      formData: newFormData
    });
  };

  componentDidMount() {
    const playerId = this.props.match.params.id;

    // ako nemam u adresi playerId znači da dodajem novog
    if (!playerId) {
      this.setState({
        formType: "Add player"
      });
    } else {
      // ako imam id, dohvati ga sa firebase datebase i popuni forme sa podacima
      fbdb
        .ref(`players/${playerId}`)
        .once("value")
        .then(snapshot => {
          const playerData = snapshot.val();

          // moram dohvatit i public url od slike, zato što u snapshotu imam samo nekakv ID u storage, ne URL
          firebase
            .storage()
            .ref("players")
            .child(playerData.image)
            .getDownloadURL()
            .then(url => {
              this.updateFields(playerData, playerId, "Edit player", url);
            })
            .catch(err => {
              // ovo je zato što prvi puta kada sam uplodao sve igrače iz JSONa, nama njihove slike u fb storageu...pa izbaci grešku...moram slike staviti na prazan string
              console.log("NEMA SLIKE!!!", err);
              this.updateFields(
                {
                  ...playerData,
                  image: ""
                },
                playerId,
                "Edit player",
                ""
              );
            });
        });

      this.setState({
        formType: "Edit player"
      });
    }
  }

  successForm = msg => {
    this.setState({
      formSuccess: msg
    });

    setTimeout(() => {
      this.setState({
        formSuccess: ""
      });
    }, 2000);
  };

  submitForm = e => {
    e.preventDefault();

    let dataToSubmit = {};
    let formIsValid = true;

    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      formIsValid = this.state.formData[key].valid && formIsValid;
    }

    if (formIsValid) {
      if (this.state.formType === "Edit player") {
        fbdb
          .ref(`players/${this.state.playerId}`)
          .update(dataToSubmit)
          .then(() => {
            this.successForm("Update correctly");
          })
          .catch(err => {
            console.log(err);
            this.setState({
              formError: true
            });
          });
      } else {
        fbPlayers
          .push(dataToSubmit)
          .then(() => {
            this.props.history.push("/admin_players");
          })
          .catch(err => {
            console.log(err);
            this.setState({
              formError: true
            });
          });
      }
    } else {
      this.setState({
        formError: true
      });
    }
  };

  updateForm = (element, content = "") => {
    const newFormData = { ...this.state.formData };
    const newElement = { ...newFormData[element.id] };

    if (content === "") newElement.value = element.e.target.value;
    else newElement.value = content;

    let validData = validate(newElement);
    newElement.valid = validData[0];
    newElement.validationMessage = validData[1];
    newFormData[element.id] = newElement;
    this.setState({
      formError: false,
      formData: newFormData
    });
  };

  resetImage = imgName => {
    const newFormData = { ...this.state.formData };
    newFormData["image"].value = "";
    newFormData["image"].valid = false;

    this.setState({
      defaultImage: "",
      formData: newFormData
    });

    firebase
      .storage()
      .ref("players")
      .child(imgName)
      .delete()
      .then(() => {
        console.log("slika obrisana iz fb storega");
      })
      .catch(err => console.log(err));
  };

  storeFileName = fileName => {
    this.updateForm({ id: "image" }, fileName);
  };

  render() {
    return (
      <AdminLayout>
        <div className="editplayers_dialog_wrapper">
          <h2>{this.state.formType}</h2>
          <div>
            <form onSubmit={e => this.submitForm(e)}>
              <FileUpload
                dir="players"
                tag={"Player Image"}
                defaultImg={this.state.defaultImg}
                defaultImgName={this.state.formData.image.value}
                resetImage={imgName => this.resetImage(imgName)}
                fileName={filename => this.storeFileName(filename)}
              />
              <FormFields
                id="name"
                formData={this.state.formData.name}
                change={element => this.updateForm(element)}
              />
              <FormFields
                id="lastname"
                formData={this.state.formData.lastname}
                change={element => this.updateForm(element)}
              />
              <FormFields
                id="number"
                formData={this.state.formData.number}
                change={element => this.updateForm(element)}
              />
              <FormFields
                id="position"
                formData={this.state.formData.position}
                change={element => this.updateForm(element)}
              />

              <div className="success_label">{this.state.formSuccess}</div>
              {this.state.formError ? (
                <div className="error_label">Something is wrong</div>
              ) : (
                ""
              )}
              <div className="admin_submit">
                <button onClick={e => this.submitForm(e)}>
                  {this.state.formType}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    );
  }
}
