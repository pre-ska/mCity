import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import { fbMatches } from "../../firebase";
import { fbLooper } from "../UI/misc";
import LeagueTable from "./Table";
import MatchesList from "./MatchesList";

class Matches extends Component {
  state = {
    loading: true,
    matches: [],
    filterMatches: [],
    playedFilter: "All",
    resultFilter: "All"
  };

  componentDidMount() {
    fbMatches.once("value").then(snapshot => {
      const matches = fbLooper(snapshot);
      for (let key of matches) {
        key.ts = new Date(key.date).getTime();
      }
      matches.sort((a, b) => b.ts - a.ts);
      console.log(matches);
      this.setState({
        loading: false,
        matches: matches.reverse(),
        filterMatches: matches.reverse()
      });
    });
  }

  showPlayed = played => {
    this.setState({
      filterMatches:
        played === "All"
          ? this.state.matches
          : this.state.matches.filter(match => match.final === played),
      playedFilter: played,
      resultFilter: "All"
    });
  };
  showResult = result => {
    this.setState({
      filterMatches:
        result === "All"
          ? this.state.matches
          : this.state.matches.filter(match => match.result === result),
      playedFilter: "All",
      resultFilter: result
    });
  };

  render() {
    const state = this.state;
    return (
      <div className="the_matches_container">
        <div className="the_matches_wrapper">
          <div className="left">
            <div className="match_filters">
              <div className="match_filters_box">
                <div className="tag">Show match</div>
                <div className="cont">
                  <div
                    className={`option ${
                      state.playedFilter === "All" ? "active" : ""
                    }`}
                    onClick={() => this.showPlayed("All")}>
                    All
                  </div>
                  <div
                    className={`option ${
                      state.playedFilter === "Yes" ? "active" : ""
                    }`}
                    onClick={() => this.showPlayed("Yes")}>
                    Played
                  </div>
                  <div
                    className={`option ${
                      state.playedFilter === "No" ? "active" : ""
                    }`}
                    onClick={() => this.showPlayed("No")}>
                    Not played
                  </div>
                </div>
              </div>
              <div className="match_filters_box">
                <div className="tag">Result</div>
                <div className="cont">
                  <div
                    className={`option ${
                      state.resultFilter === "All" ? "active" : ""
                    }`}
                    onClick={() => this.showResult("All")}>
                    All
                  </div>
                  <div
                    className={`option ${
                      state.resultFilter === "W" ? "active" : ""
                    }`}
                    onClick={() => this.showResult("W")}>
                    W
                  </div>
                  <div
                    className={`option ${
                      state.resultFilter === "L" ? "active" : ""
                    }`}
                    onClick={() => this.showResult("L")}>
                    L
                  </div>
                  <div
                    className={`option ${
                      state.resultFilter === "D" ? "active" : ""
                    }`}
                    onClick={() => this.showResult("D")}>
                    D
                  </div>
                </div>
              </div>
            </div>
            <MatchesList matches={state.filterMatches} />
          </div>
          <div className="right" style={{ backgroundColor: "#98c6e9" }}>
            <LeagueTable />
          </div>
        </div>
      </div>
    );
  }
}

export default Matches;
