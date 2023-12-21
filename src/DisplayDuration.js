import React from "react";
import { BlogContext } from "./BlogProvider";
import { Link } from "react-router-dom";

const DisplayDuration = () => {
  const value = React.useContext(BlogContext);

  const extractTimerValues = value.posts.map((what) => {
    const duration = what.duration;
    const repeat = what.repeat;
    const pause = what.pause;
    const total = (duration + pause) * (repeat + 1);
    return total;
  });

  const totalTiming = extractTimerValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return (
    <>
      <div className="container-titre-app">
        <div>
          <div className="nav">
            <div className="nav-item">
              <Link to="/">
                <button className="button-home">Home</button>
              </Link>
            </div>
            <div className="csci-e39">CSCI E-39</div>
            <div className="nav-item">
              <Link to="/record">
                <button className="button-history">History</button>
              </Link>
            </div>
          </div>

          <h2>WORKOUT</h2>
        </div>

        <div className="center-align">
          <div className="resultBox">
            <div className="resultNum">{value.postCount}</div>
            <div className="resultTxt">Timer(s) in the workout</div>
          </div>
          <div className="resultBox">
            <div className="resultNum">{totalTiming}</div>
            <div className="resultTxt">Total seconds length</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayDuration;
