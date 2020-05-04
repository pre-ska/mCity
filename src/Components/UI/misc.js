import React from "react";
import { Link } from "react-router-dom";

export const Tag = props => {
  const { bck, size, color, linkTo, children } = props;
  const template = (
    <div
      style={{
        background: bck,
        fontSize: size,
        color: color,
        padding: "5px 10px",
        display: "inline-block",
        fontFamily: "Righteous",
        ...props.add
      }}>
      {children}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{template}</Link>;
  } else {
    return template;
  }
};

export const fbLooper = snapshot => {
  const data = [];

  snapshot.forEach(child => {
    data.push({
      ...child.val(),
      id: child.key
    });
  });

  return data;
};

// export const reverseArray = array => {
//   let reversedArray = array.reversed();
// };

export const validate = elem => {
  let error = [true, ""];

  if (elem.validation.email) {
    const valid = /\S+@\S+\.\S+/.test(elem.value);
    const message = `${!valid ? "Must be a valid email" : ""}`;
    error = !valid ? [valid, message] : error;
  }

  if (elem.validation.required) {
    const valid = elem.value.trim() !== "";
    const message = `${!valid ? "Must not be empty" : ""}`;
    error = !valid ? [valid, message] : error;
  }
  return error;
};
