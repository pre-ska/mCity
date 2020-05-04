import React, { Component } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../HOC/AdminLayout";
import { withRouter } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core";

import { fbPlayers } from "../../../firebase";
import { fbLooper } from "../../UI/misc";

const styles = {
  tr: {
    transition: "background 0.3s",
    "&:hover": {
      background: "#BFDDF2",
      cursor: "pointer"
    }
  }
};

class AdminPlayers extends Component {
  state = {
    isLoading: true,
    players: []
  };

  componentDidMount() {
    fbPlayers.once("value").then(snapshot => {
      const players = fbLooper(snapshot);

      this.setState({
        isLoading: false,
        players: players.reverse()
      });
    });
  }

  render() {
    return (
      <AdminLayout>
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First name</TableCell>
                  <TableCell>Last name</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Position</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.players
                  ? this.state.players.map((player, i) => (
                      // <Link to={`/admin_matches/edit_match/${match.id}`}>
                      //   <div>
                      <TableRow
                        key={i}
                        onClick={() =>
                          this.props.history.push(
                            `/admin_players/edit_player/${player.id}`
                          )
                        }
                        className={this.props.classes.tr}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.lastname}</TableCell>
                        <TableCell>{player.number}</TableCell>
                        <TableCell>{player.position}</TableCell>
                      </TableRow>
                      //   </div>
                      // </Link>
                    ))
                  : null}
              </TableBody>
            </Table>
          </Paper>

          <div className="admin_progress">
            {this.state.isLoading ? (
              <CircularProgress
                thickness={4}
                style={{ color: "#98c5e9", marginTop: "10%" }}
              />
            ) : null}
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default withStyles(styles)(AdminPlayers);
