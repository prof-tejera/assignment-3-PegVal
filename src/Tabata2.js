import React from "react";
import { useState, useEffect } from "react";
import { BlogContext } from "./BlogProvider";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router"; // ----------------- history

//import { useSearchParams } from "react-router-dom";
//import { createSearchParams } from "react-router-dom";

//const encodeSearchParams = (params) => createSearchParams(params);

// --------------- à mettre dans HOOKS -------------------
const usePersistedState = (localStorageKey, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(localStorageKey);
    if (!storedValue) return initialValue;
    return JSON.parse(storedValue);
  });

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [localStorageKey, value]);

  return [value, setValue];
};

// -------- persistent state ---
/* const decodeSearchParams = (searchParams) => {
  return [...searchParams.entries()].reduce((acc, [key, val]) => {
    try {
      return {
        ...acc,
        [key]: JSON.parse(val),
      };
    } catch {
      return {
        ...acc,
        [key]: val,
      };
    }
  }, {});
}; */

const Tabata = () => {
  //const [searchParams, setSearchParams] = useSearchParams(); // persistent -----------------
  //const searchParams = useSearchParams(); // --- persistent

  const navigate = useNavigate(); // -------------

  const value = React.useContext(BlogContext); // -------- context

  const totalTimer = value.postCount;

  //const [isActive, setIsActive] = useState(false);
  const [isActive, setIsActive] = usePersistedState("is-active", false);

  //const [isFinish, setIsFinish] = useState(false);
  const [isFinish, setIsFinish] = usePersistedState("is-finish", false);

  //const [type, setType] = useState(value.posts[0].type);
  const [type, setType] = usePersistedState("type", value.posts[0].type);

  const extractTimerValues = value.posts.map((what) => {
    const total = (what.duration + what.pause) * (what.repeat + 1);
    return total;
  });

  const totalTiming = extractTimerValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // ---------- History ----------------

  /*  const history = useNavigate();
  

  function handleClick() {
    history.push("/my-page", { data });
  } */

  /* function handleQueryParamsChange() {
  const params = {
    filters: JSON.stringify(value.posts),
    //anotherField: "Simple String", // ----------------------------- / record ????
  };
  //localStorage.clear();
  setSearchParams(encodeSearchParams(params));
  //setSaveSettings(true);
} */

  //const peggy = handleQueryParamsChange;

  // ---------- end History ----------------

  //const [totalAllTimers, setTotalAllTimers] = useState(totalTiming); // durée de l'ensemble du workout
  const [totalAllTimers, setTotalAllTimers] = usePersistedState(
    "total-all-timers",
    totalTiming
  );

  //const [msgAction, setMsgAction] = useState("ready?"); // message de fin
  const [msgAction, setMsgAction] = usePersistedState("msg", "ready?");

  //const [numTimer, setNumTimer] = useState(0); // la ref du timer pour le countdown
  const [numTimer, setNumTimer] = usePersistedState("num-timer", 0);

  //const [actualTimer, setActualTimer] = useState(totalTimer); // la ref du timer à appeler
  const [actualTimer, setActualTimer] = usePersistedState(
    "actual-timer",
    totalTimer
  );

  //const [totalAllSeconds, setTotalAllSeconds] = useState(extractTimerValues[0]); // durée pour un timer en particulier
  const [totalAllSeconds, setTotalAllSeconds] = usePersistedState(
    "total-all-seconds",
    extractTimerValues[0]
  );

  //const [initTotalAllSeconds, setInitTotalAllSeconds] = useState(totalAllSeconds);
  const [initTotalAllSeconds, setInitTotalAllSeconds] = usePersistedState(
    "init-total-all-seconds",
    totalAllSeconds
  );

  //const [title, setTitle] = useState(value.posts[0].title !== "" ? value.posts[0].title : "No title");
  const [title, setTitle] = usePersistedState(
    "title",
    value.posts[0].title !== "" ? value.posts[0].title : "No title"
  );

  //const [valRepeat, setValRepeat] = useState(value.posts[0].repeat + 1); // valeur initiale
  const [valRepeat, setValRepeat] = usePersistedState(
    "val-repeat",
    value.posts[0].repeat + 1
  );

  //const [repeat, setRepeat] = useState(valRepeat); // valeur à décrémenter
  const [repeat, setRepeat] = usePersistedState("repeat", valRepeat);

  //const [valPause, setValPause] = useState(value.posts[0].pause !== "" ? value.posts[0].pause : 0); // valeur initiale
  const [valPause, setValPause] = usePersistedState(
    "val-pause",
    value.posts[0].pause !== "" ? value.posts[0].pause : 0
  );

  //const [pause, setPause] = useState(valPause); // valeur à décrémenter
  const [pause, setPause] = usePersistedState("pause", valPause);

  //const [remaining, setRemaining] = useState(totalTiming);
  const [remaining, setRemaining] = usePersistedState("remaining", totalTiming);

  //const [workout, setWorkout] = useState(totalTimer);
  const [workout, setWorkout] = usePersistedState("workout", totalTimer);

  //const valDuration = useState(value.posts[0].duration); // valeur initiale
  const valDuration = usePersistedState(
    "val-duration",
    value.posts[0].duration
  );

  //const duration = useState(valDuration); // valeur à décrémenter
  const duration = usePersistedState("duration", valDuration);

  //const valDurationAndPause = useState(value.posts[0].duration + value.posts[0].pause); // valeur intiale */
  const valDurationAndPause = usePersistedState(
    "val-duration-and-pause",
    value.posts[0].duration + value.posts[0].pause
  );

  //const [durationAndPause, setDurationAndPause] = useState(valDurationAndPause); // valeur à décrementer
  const [durationAndPause, setDurationAndPause] = usePersistedState(
    "duration-and-pause",
    valDurationAndPause
  );

  function toggle() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalAllTimers > 0 && isActive) {
        // tant que le timer général n'est pas à zéro: décrement sa valeur
        setTotalAllTimers((totalAllTimers) => totalAllTimers - 1);

        setMsgAction((msgAction) => "work");
        // -- dans un des timer: decrement la valeur du timer en cours
        if (totalAllSeconds > 0) {
          setTotalAllSeconds((duration) => duration - 1);

          // decrement duration + pause
          if (durationAndPause > 1) {
            setDurationAndPause((durationAndPause) => durationAndPause - 1);
            if (durationAndPause > pause + 1) {
              setMsgAction((msgAction) => "work");
            } else {
              setMsgAction((msgAction) => "pause");
              setPause((pause) => pause - 1);
            }
          }
          if (durationAndPause === 1) {
            setRepeat(repeat - 1);
            setDurationAndPause(
              value.posts[numTimer].duration + value.posts[numTimer].pause
            );
            setMsgAction((msgAction) => `work:~\n new round`);
            setPause(
              value.posts[numTimer].pause !== "" ? value.posts[0].pause : 0
            );
          }
        } else {
          // --- quand on change de timer
          setType(value.posts[numTimer + 1].type);
          setMsgAction((msgAction) => `work: next timer`);
          setTitle(value.posts[numTimer + 1].title);
          setNumTimer((numTimer) => numTimer + 1); // decrement ref to timer
          setActualTimer(actualTimer - 1);
          setTotalAllSeconds(extractTimerValues[numTimer + 1] - 1);
          setInitTotalAllSeconds(extractTimerValues[numTimer + 1]);
          setDurationAndPause(
            value.posts[numTimer + 1].duration + value.posts[numTimer + 1].pause
          );
          setPause(
            value.posts[numTimer + 1].pause !== "" ? value.posts[0].pause : 0
          );
          setValPause(
            value.posts[numTimer + 1].pause !== "" ? value.posts[0].pause : 0
          );
          setValRepeat(value.posts[numTimer + 1].repeat + 1);
          setRepeat(value.posts[numTimer + 1].repeat + 1);
        }
      } else if (totalAllTimers === 0) {
        // end
        setMsgAction((msgAction) => "workout completed!");
        setInitTotalAllSeconds(0);
        setActualTimer(0);
        setIsActive(false);
        setIsFinish(true);
        setDurationAndPause(0);
        setPause(0);
        setValPause(0);
        setValRepeat(0);
        setRepeat(0);
        setTitle("");
        setRemaining(0);
        setWorkout(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    setActualTimer,
    setDurationAndPause,
    setInitTotalAllSeconds,
    setIsActive,
    setIsFinish,
    setMsgAction,
    setNumTimer,
    setPause,
    setRemaining,
    setRepeat,
    setTitle,
    setTotalAllSeconds,
    setTotalAllTimers,
    setType,
    setValPause,
    setValRepeat,
    setWorkout,
    actualTimer,
    durationAndPause,
    extractTimerValues,
    isActive,
    numTimer,
    pause,
    repeat,
    totalAllSeconds,
    totalAllTimers,
    value.posts,
    duration,

    /* isActive,
    actualTimer,
    extractTimerValues,
    numTimer,
    totalTimer,
    totalAllTimers,
    totalAllSeconds,
    pause,
    repeat,
    duration,
    valDurationAndPause,
    durationAndPause, */
    //value.posts,
  ]);

  return (
    <>
      <div className="counter-content">
        <div className="counterBoxContent">
          <div className="info">
            <h3> {title} </h3>
          </div>
          <div className="counterBox">
            <div className="timerDisplaySecond">
              {totalAllSeconds}/{initTotalAllSeconds}
            </div>
            <div class="infoCounter">{msgAction}</div>
          </div>
          <div className="infoBoxContent">
            {(type === "xy" || type === "tabata") && (
              <>
                <div className="info">
                  <p className="titleInfo">times</p>
                  <p className="numInfo">
                    {repeat}/{valRepeat}
                  </p>
                  <p className="numInfoSec">num</p>
                </div>
              </>
            )}

            {type === "tabata" && (
              <>
                <div className="info">
                  <p className="titleInfo">Pause</p>
                  <p className="numInfo">
                    {pause}/{valPause}
                  </p>
                  <p className="numInfoSec">Seconds</p>
                </div>
              </>
            )}

            <div className="info">
              <p className="titleInfo">Total</p>
              <p className="numInfo">
                {totalAllTimers}/{remaining}
              </p>
              <p className="numInfoSec">Seconds</p>
            </div>
            <div className="info">
              <p className="titleInfo">workout</p>
              <p className="numInfo">
                {actualTimer}/{workout}
              </p>
              <p className="numInfoSec">num</p>
            </div>
          </div>
          <div className="buttonContent">
            <div>
              <button
                className="button-elem"
                onClick={() => {
                  navigate(-1);
                }}>
                Back to config
              </button>

              <br />
              {/*  <button
                onClick={() => {
                  console.log(value.posts);
                }}>
                history
              </button> */}
              <br />

              {/*  <Link to={`/record/?${peggy}`}>
                test ------
              </Link> */}
              <br></br>
              <br></br>
              {/* <button
                className="button-big"
                onClick={() => handleQueryParamsChange()}>
                Save Settings
              </button> */}
            </div>

            {!isFinish && (
              <>
                <button
                  className={`button-big button-big-${
                    isActive ? "active" : "inactive"
                  }`}
                  onClick={toggle}>
                  {isActive ? "Pause" : "Start"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabata;
