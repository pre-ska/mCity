import React, { Component, useState, useEffect } from "react";
import { fbMatches } from "../../../firebase";
import { fbLooper } from "../../UI/misc";
import MatchesBlock from "../../UI/MatchesBlock";
import Slide from "react-reveal/Slide";

const Blocks = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fbMatches
      .limitToLast(6)
      .once("value")
      .then(snapshot => {
        const matches = fbLooper(snapshot).reverse();
        setMatches(matches);
      });
  }, []);

  const showMatches = matches =>
    matches
      ? matches.map(match => (
          <Slide bottom key={match.id}>
            <div className="item">
              <div className="wrapper">
                <MatchesBlock match={match} />
              </div>
            </div>
          </Slide>
        ))
      : null;

  return <div className="home_matches">{showMatches(matches)}</div>;
};

export default Blocks;
