import React from "react";
import { useState, useEffect } from "react";
import { BlogContext } from "./BlogProvider";
import { useNavigate } from "react-router"; 

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

const Tabata = () => {
  const navigate = useNavigate(); 
  const value = React.useContext(BlogContext); 
  const totalTimer = value.postCount;
  const [isActive, setIsActive] = usePersistedState("is-active", false);
  const [isFinish, setIsFinish] = usePersistedState("is-finish", false);
  const [type, setType] = usePersistedState("type", value.posts[0].type);

  const extractTimerValues = value.posts.map((what) => {
    const total = (what.duration + what.pause) * (what.repeat + 1);
    return total;
  });

  const totalTiming = extractTimerValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const [totalAllTimers, setTotalAllTimers] = usePersistedState("total-all-timers", totalTiming);
  const [msgAction, setMsgAction] = usePersistedState("msg", "Ready? Steady?");
  const [numTimer, setNumTimer] = usePersistedState("num-timer", 0);
  const [actualTimer, setActualTimer] = usePersistedState("actual-timer", totalTimer);
  const [totalAllSeconds, setTotalAllSeconds] = usePersistedState("total-all-seconds", extractTimerValues[0]);
  const [initTotalAllSeconds, setInitTotalAllSeconds] = usePersistedState("init-total-all-seconds", totalAllSeconds);
  const [title, setTitle] = usePersistedState("title", value.posts[0].title !== "" ? value.posts[0].title : "No title");
  const [valRepeat, setValRepeat] = usePersistedState("val-repeat", value.posts[0].repeat + 1);
  const [repeat, setRepeat] = usePersistedState("repeat", valRepeat);
  const [valPause, setValPause] = usePersistedState("val-pause", value.posts[0].pause !== "" ? value.posts[0].pause : 0);
  const [pause, setPause] = usePersistedState("pause", valPause);
  const [remaining, setRemaining] = usePersistedState("remaining", totalTiming);
  const [workout, setWorkout] = usePersistedState("workout", totalTimer);
  const valDuration = usePersistedState("val-duration", value.posts[0].duration);
  const duration = usePersistedState("duration", valDuration);
  const valDurationAndPause = usePersistedState("val-duration-and-pause", value.posts[0].duration + value.posts[0].pause);
  const [durationAndPause, setDurationAndPause] = usePersistedState("duration-and-pause", valDurationAndPause);

  function toggle() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalAllTimers > 0 && isActive) {
        setTotalAllTimers((totalAllTimers) => totalAllTimers - 1);
        setMsgAction((msgAction) => "Go! Workout...");
        if (totalAllSeconds > 0) {
          setTotalAllSeconds((duration) => duration - 1);
          if (durationAndPause > 1) {
            setDurationAndPause((durationAndPause) => durationAndPause - 1);
            if (durationAndPause > pause + 1) {
              setMsgAction((msgAction) => "Workout...");
            } else {
              setMsgAction((msgAction) => "Pause...");
              setPause((pause) => pause - 1);
            }
          }
          if (durationAndPause === 1) {
            setRepeat(repeat - 1);
            setDurationAndPause(
              value.posts[numTimer].duration + value.posts[numTimer].pause
            );
            setMsgAction((msgAction) => `New Round!`);
            setPause(
              value.posts[numTimer].pause !== "" ? value.posts[0].pause : 0
            );
          }
        } else {
          setType(value.posts[numTimer + 1].type);
          setMsgAction((msgAction) => `Next Timer!`);
          setTitle(value.posts[numTimer + 1].title);
          setNumTimer((numTimer) => numTimer + 1); 
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
        setMsgAction((msgAction) => "Workout Completed!");
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
            <div className="infoCounter">{msgAction}</div>
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
