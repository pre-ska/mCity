import React from "react";
import Blocks from "./Blocks";
import { Tag } from "../../UI/misc";

const MatchesHome = () => {
  return (
    <div className="home_matches_wrapper">
      <div className="container">
        <Tag bck="#0e1731" size="50px" color="#ffffff">
          Matches
        </Tag>
        <Blocks />
        <Tag bck="#fff" size="22px" color="#0e1731" linkTo="/the_team">
          See more matches
        </Tag>
      </div>
    </div>
  );
};

export default MatchesHome;
