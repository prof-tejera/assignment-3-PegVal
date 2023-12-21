import { useContext } from "react";
import { BlogContext } from "./BlogProvider";
import { useNavigate } from "react-router";


const RecordURL = () => {
  const { posts } = useContext(BlogContext);
  const navigate = useNavigate();

  const extractTimerValues = posts.map((what) => {
    const total = (what.duration + what.pause) * (what.repeat + 1);
    return total;
  });

  const totalTiming = extractTimerValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return (
    <>
      <div className="counter-container">
        <div className="counter-container">
          <div className="panel">
            <div className="header">
              <div className="text">Registered Workout </div>
            </div>
            <div>
              xxxx
              <br />
              In this Workout, there was {posts.length} timers for a total
              duration of {totalTiming} seconds.
              <br />
              <br />
              {posts.map((p, index) => (
                <div
                  key={p.id}
                  index={index}
                  className="workout-container">
                  - "{p.title}" is a {p.type} of {p.duration} seconds with{" "}
                  {p.pause} pause, to be repeated {p.repeat + 1} number of time
                </div>
              ))}
            </div>
            <button
              className="button-big"
              onClick={() => {
                navigate(-1);
              }}>
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordURL;
