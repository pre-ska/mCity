import React, { Component } from "react";
import PlayerCard from "../UI/PlayerCard";
import Fade from "react-reveal/Fade";

import Stripes from "../../Resources/images/stripes.png";
import { fbPlayers, firebase } from "../../firebase";
import { fbLooper } from "../UI/misc";
import { Promise } from "core-js";

class Team extends Component {
  state = {
    loading: true,
    players: [],
  };

  componentDidMount() {
    fbPlayers.once("value").then(snapshot => {
      const players = fbLooper(snapshot);

      let promises = [];

      for (let key in players) {
        promises.push(
          new Promise((resolve, reject) => {
            firebase
              .storage()
              .ref("players")
              .child(players[key].image)
              .getDownloadURL()
              .then(url => {
                players[key].url = url;
                resolve();
              });
          })
        );
      }

      Promise.all(promises).then(() => {
        this.setState({
          loading: false,
          players,
        });
      });
    });
  }

  showPlayersByCategory = category =>
    this.state.players
      ? this.state.players.map((player, i) => {
          return player.position === category ? (
            <Fade left key={i} delay={i * 50}>
              <div className="item">
                <PlayerCard
                  number={player.number}
                  name={player.name}
                  lastname={player.lastname}
                  bck={player.url}
                ></PlayerCard>
              </div>
            </Fade>
          ) : null;
        })
      : null;

  render() {
    console.log("ide team");
    return (
      <div
        style={{ background: `url(${Stripes}) repeat` }}
        className="the_team_container"
      >
        {!this.state.loading ? (
          <div>
            <div className="team_category_wrapper">
              <div className="title">Keepers</div>
              <div className="team_cards">
                {this.showPlayersByCategory("Keeper")}
              </div>
            </div>
            <div className="team_category_wrapper">
              <div className="title">Defence</div>
              <div className="team_cards">
                {this.showPlayersByCategory("Defence")}
              </div>
            </div>
            <div className="team_category_wrapper">
              <div className="title">Midfield</div>
              <div className="team_cards">
                {this.showPlayersByCategory("Midfield")}
              </div>
            </div>
            <div className="team_category_wrapper">
              <div className="title">Strike</div>
              <div className="team_cards">
                {this.showPlayersByCategory("Striker")}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Team;
