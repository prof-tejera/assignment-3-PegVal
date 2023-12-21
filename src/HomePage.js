import { Link } from "react-router-dom";
import logo from "./hp.png";

const HomePage = () => {
  return (
    <>
      <div className="csci-e39-dark">CSCI E-39</div>
      <h2 className="h2-dark">WORKOUT</h2>
      <div className="hp-container">
        <div className="box">
          <div className="item">
            <img
              src={logo}
              alt="CSCI E-39"
            />
          </div>
          <div className="break">
            <Link to="/workout">
              <button className="button-hp">start your workout</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
