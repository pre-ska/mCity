import React, { Component } from "react";
import { firebase } from "../../firebase";
import FormFields from "../UI/FormFields";
import { validate } from "../UI/misc";

export class SignIn extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formData: {
      email: {
        element: "input",
        value: "",
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email"
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        validationMessage: ""
      },
      password: {
        element: "input",
        value: "",
        config: {
          name: "password_input",
          type: "password",
          placeholder: "Enter password"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ""
      }
    }
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
      firebase
        .auth()
        .signInWithEmailAndPassword(dataToSubmit.email, dataToSubmit.password)
        .then(() => {
          console.log("login successful - redirecting to dashboard");
          console.log(this.props.history);
          this.props.history.push("/dashboard");
        })
        .catch(err => {
          this.setState({
            formError: true
          });
        });
    } else {
      this.setState({
        formError: true
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
      formData: newFormData
    });
  };

  render() {
    return (
      <div className="container">
        <div
          style={{
            margin: "100px"
          }}
          className="signin_wrapper">
          <form onSubmit={e => this.submitForm()}>
            <h2>Please log in</h2>

            <FormFields
              id="email"
              formData={this.state.formData.email}
              change={element => this.updateForm(element)}
            />
            <FormFields
              id="password"
              formData={this.state.formData.password}
              change={element => this.updateForm(element)}
            />
            <div className="success_label">{this.state.formSuccess}</div>

            <button onClick={this.submitForm}>Log In</button>
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;
