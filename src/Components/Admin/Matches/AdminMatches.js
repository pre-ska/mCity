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

import { fbMatches } from "../../../firebase";

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

class AdminMatches extends Component {
  state = {
    isLoading: true,
    matches: []
  };

  componentDidMount() {
    fbMatches.once("value").then(snapshot => {
      const matches = fbLooper(snapshot);

      this.setState({
        isLoading: false,
        matches: matches.reverse()
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
                  <TableCell>Date</TableCell>
                  <TableCell>Match</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Final</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.matches
                  ? this.state.matches.map((match, i) => (
                      // <Link to={`/admin_matches/edit_match/${match.id}`}>
                      //   <div>
                      <TableRow
                        key={i}
                        onClick={() =>
                          this.props.history.push(
                            `/admin_matches/edit_match/${match.id}`
                          )
                        }
                        className={this.props.classes.tr}>
                        <TableCell>{match.date}</TableCell>
                        <TableCell>
                          {match.local} - {match.away}
                        </TableCell>
                        <TableCell>
                          {match.resultLocal} - {match.resultAway}
                        </TableCell>
                        <TableCell>
                          {match.final === "Yes" ? (
                            <span className="matches_tag_green">Finished</span>
                          ) : (
                            <span className="matches_tag_red">
                              Not played yet
                            </span>
                          )}
                        </TableCell>
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
export default withStyles(styles)(AdminMatches);
// export default withRouter(withStyles(styles)(AdminMatches));
