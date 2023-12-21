import { useContext } from "react";
import { BlogContext } from "./BlogProvider";
import { useNavigate } from "react-router";

//import { Link } from "react-router-dom";
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//import { useSearchParams } from "react-router-dom";
//import { createSearchParams } from "react-router-dom";

//const encodeSearchParams = (params) => createSearchParams(params);

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

const RecordURL = () => {
  //const searchParams = new URLSearchParams(props.location.search);
  //const test = searchParams.get("posts");

  const { posts } = useContext(BlogContext);
  const navigate = useNavigate();

  //const totalTimer = posts.postCount;

  const extractTimerValues = posts.map((what) => {
    const total = (what.duration + what.pause) * (what.repeat + 1);
    return total;
  });

  const totalTiming = extractTimerValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // ------ history -----
  //const searchParams = new URLSearchParams(props.location.search);
  //const duration = searchParams.get("nduration");
  //const type = searchParams.get("type");

  //const [searchParams, setSearchParams] = useSearchParams();

  /* function handleQueryParamsChange() {
    const params = {
      filters: JSON.stringify(posts),
    };
    setSearchParams(encodeSearchParams(params));
    console.log(decodeSearchParams(searchParams).filters);
  }

  function loadPost() {
    setPosts(decodeSearchParams(searchParams).filters);
    console.log("test", posts);
  } */

  //setPosts(decodeSearchParams(searchParams).filters);

  // ----- drag & Drop ---------
  /*   const handleDrag = (results) => {
    //console.log("results", results);
    console.log("posts", posts);

    const { source, destination, type } = results;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    if (type === "group") {
      const reorderedStores = [...posts];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedStore] = reorderedStores.splice(sourceIndex, 1);
      reorderedStores.splice(destinationIndex, 0, removedStore);

      return setPosts(reorderedStores);
    }
  }; */

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
