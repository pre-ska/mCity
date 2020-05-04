import React, { Component } from "react";
import AdminLayout from "../../../HOC/AdminLayout";
import FormFields from "../../UI/FormFields";
import { validate } from "../../UI/misc";

import { fbTeams, fbdb, fbMatches } from "../../../firebase";
import { fbLooper } from "../../UI/misc";

class EditMatch extends Component {
  state = {
    matchId: "",
    formType: "",
    formError: false,
    formSuccess: "",
    teams: [],
    formData: {
      date: {
        element: "input",
        value: "",
        config: {
          label: "Event date",
          name: "date_input",
          type: "date",
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: true,
      },
      local: {
        element: "select",
        value: "",
        config: {
          label: "Select local team",
          name: "select_local",
          type: "select",
          options: [],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: false,
      },
      resultLocal: {
        element: "input",
        value: "",
        config: {
          label: "Result local",
          name: "result_local_input",
          type: "text",
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: false,
      },
      away: {
        element: "select",
        value: "",
        config: {
          label: "Select local team",
          name: "select_local",
          type: "select",
          options: [],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: false,
      },
      resultAway: {
        element: "input",
        value: "",
        config: {
          label: "Result local",
          name: "result_local_input",
          type: "text",
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: false,
      },
      referee: {
        element: "input",
        value: "",
        config: {
          label: "Referee",
          name: "referee_input",
          type: "text",
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: true,
      },
      stadium: {
        element: "input",
        value: "",
        config: {
          label: "Stadium",
          name: "stadium_input",
          type: "text",
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: true,
      },
      result: {
        element: "select",
        value: "",
        config: {
          label: "Team result",
          name: "select_result",
          type: "select",
          options: [
            { key: "W", value: "Win" },
            { key: "L", value: "Lose" },
            { key: "D", value: "Draw" },
            { key: "n/a", value: "n/a" },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: true,
      },
      final: {
        element: "select",
        value: "",
        config: {
          label: "Game played",
          name: "select_played",
          type: "select",
          options: [
            { key: "Yes", value: "Yes" },
            { key: "No", value: "No" },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showLabel: true,
      },
    },
  };

  successForm = msg => {
    this.setState({
      formSuccess: msg,
    });

    setTimeout(() => {
      this.setState({
        formSuccess: "",
      });
    }, 2000);
  };

  deleteMatch = e => {
    console.log(e);
  };

  submitForm = e => {
    e.preventDefault();
    let dataToSubmit = {};
    let formIsValid = true;

    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      formIsValid = this.state.formData[key].valid && formIsValid;
    }

    this.state.teams.forEach(team => {
      if (team.shortName === dataToSubmit.local) {
        dataToSubmit["localThmb"] = team.thmb;
      }
      if (team.shortName === dataToSubmit.local) {
        dataToSubmit["awayThmb"] = team.thmb;
      }
    });

    if (formIsValid) {
      if (this.state.formType === "Edit match") {
        fbdb
          .ref(`matches/${this.state.matchId}`)
          .update(dataToSubmit)
          .then(() => {
            this.successForm("Update successful");
          })
          .catch(err => {
            this.setState({ formError: true });
          });
      } else {
        fbMatches
          .push(dataToSubmit)
          .then(() => {
            this.props.history.push("/admin_matches");
          })
          .catch(err => {
            this.setState({ formError: true });
          });
      }
    } else {
      this.setState({
        formError: true,
      });
    }
  };

  updateForm = element => {
    const newFormData = { ...this.state.formData };
    const newElement = { ...newFormData[element.id] };
    newElement.value = element.e.target.value;

    let validData = validate(newElement);
    newElement.valid = validData[0];
    newElement.validationMessage = validData[1];
    newFormData[element.id] = newElement;
    this.setState({
      formError: false,
      formData: newFormData,
    });
  };

  updateFields = (match, teamOptions, teams, type, matchId) => {
    const newFormData = {
      ...this.state.formData,
    };

    for (let key in newFormData) {
      if (match) {
        newFormData[key].value = match[key];
        newFormData[key].valid = true;
      }

      if (key === "local" || key === "away") {
        newFormData[key].config.options = teamOptions;
      }
    }

    this.setState({
      matchId,
      formType: type,
      formData: newFormData,
      teams,
    });
  };

  componentDidMount() {
    const matchId = this.props.match.params.id;
    const getTeams = (match, type) => {
      fbTeams.once("value").then(snapshot => {
        const teams = fbLooper(snapshot);
        const teamOptions = [];

        snapshot.forEach(childSnapshot => {
          teamOptions.push({
            key: childSnapshot.val().shortName,
            value: childSnapshot.val().shortName,
          });
        });

        this.updateFields(match, teamOptions, teams, type, matchId);
      });
    };

    if (!matchId) {
      getTeams(false, "Add match");
    } else {
      fbdb
        .ref(`matches/${matchId}`)
        .once("value")
        .then(snapshot => {
          const match = snapshot.val();
          getTeams(match, "Edit match");
        });
    }
  }

  render() {
    return (
      <AdminLayout>
        <div className="editmatch_dialog_wrapper">
          <h2>{this.state.formType}</h2>
          <div>
            <form onSubmit={e => this.submitForm(e)}>
              <FormFields
                id="date"
                formData={this.state.formData.date}
                change={element => this.updateForm(element)}
              />

              <div className="select_team_layout">
                <div className="label_inputs">Local</div>
                <div className="wrapper">
                  <div className="left">
                    <FormFields
                      id="local"
                      formData={this.state.formData.local}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                  <div>
                    <FormFields
                      id="resultLocal"
                      formData={this.state.formData.resultLocal}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                </div>
              </div>

              <div className="select_team_layout">
                <div className="label_inputs">Away</div>
                <div className="wrapper">
                  <div className="left">
                    <FormFields
                      id="away"
                      formData={this.state.formData.away}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                  <div>
                    <FormFields
                      id="resultAway"
                      formData={this.state.formData.resultAway}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                </div>
              </div>
              <div className="split_fields">
                <FormFields
                  id="referee"
                  formData={this.state.formData.referee}
                  change={element => this.updateForm(element)}
                />
                <FormFields
                  id="stadium"
                  formData={this.state.formData.stadium}
                  change={element => this.updateForm(element)}
                />
              </div>
              <div className="split_fields last">
                <FormFields
                  id="result"
                  formData={this.state.formData.result}
                  change={element => this.updateForm(element)}
                />
                <FormFields
                  id="final"
                  formData={this.state.formData.final}
                  change={element => this.updateForm(element)}
                />
              </div>

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
                {this.state.formType === "Edit match" && (
                  <button
                    style={{ marginLeft: "50px" }}
                    onClick={e => this.deleteMatch(e)}
                  >
                    Delete match
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default EditMatch;
