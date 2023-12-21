import { useState, useContext } from "react";
import { BlogContext } from "./BlogProvider";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSearchParams } from "react-router-dom";
import { createSearchParams } from "react-router-dom";

//import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch20 } from "@fortawesome/free-solid-svg-icons";

const encodeSearchParams = (params) => createSearchParams(params);

const decodeSearchParams = (searchParams) => {
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
};

const Blog = () => {
  //const loading = <FontAwesomeIcon icon="fa-solid fa-stopwatch-20" style={{color: "#5da25f",}} />


  const { posts, openPost, openEditor, deletePost, editorOpen, setPosts } =
    useContext(BlogContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [saveSettings, setSaveSettings] = useState(false);

  function handleQueryParamsChange() {
    const params = {
      filters: JSON.stringify(posts),
    };
    setSearchParams(encodeSearchParams(params));
    setSaveSettings(true);
  }

  function loadPost() {
    setPosts(decodeSearchParams(searchParams).filters ?? []);
    localStorage.clear();
  }

  function reset() {
    setPosts([]);
    localStorage.clear();
    setSaveSettings(false);
  }

  const handleDrag = (results) => {
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
  };

  return (
    <>
      <div className="displayResult"></div>
      <div className="counter-container">
        <div className="panel">
          <div className="load">
            <button
              onClick={loadPost}
              class="icon">
              <FontAwesomeIcon
                icon={faStopwatch20}
                style={{ color: "#e4be74" }}
                size="4x"
              /><br/>
              Load workout
            </button>
          </div>
          <div className="header">
            <div className="text">List of Workout </div>

            <Link to="/add">
              <button
                className="button-counter"
                onClick={() => openEditor()}>
                Add a timer
              </button>
            </Link>
          </div>
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable
              droppableId="ROOT"
              type="group">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {posts.map((p, index) => (
                    <Draggable
                      draggableId={p.id}
                      key={p.id}
                      index={index}>
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}>
                          <div
                            key={p.id}
                            index={index}
                            className="workout-container">
                            <div
                              style={{
                                backgroundColor: "#f2f2f2",
                                padding: 20,
                                marginBottom: 20,
                              }}>
                              <div style={{ display: "flex" }}>
                                <div
                                  className="title-workout"
                                  style={{ flex: 1 }}>
                                  {p.title}
                                </div>
                                <Link to="/add">
                                  <button
                                    onClick={() => openPost({ id: p.id })}
                                    className="button-counter">
                                    Edit
                                  </button>
                                </Link>
                                <button
                                  onClick={() => deletePost({ id: p.id })}
                                  className="button-counter">
                                  Delete
                                </button>
                              </div>

                              <div>
                                {p.type}. Duration {p.duration}s / pause{" "}
                                {p.pause}s / times {p.repeat + 1}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="footer-counter">
            {posts[0] && (
              <button
                className="button-big"
                onClick={() => reset()}>
                Reset
              </button>
            )}
            {!saveSettings && posts[0] && (
              <button
                className="button-big"
                onClick={() => handleQueryParamsChange()}>
                Save Settings
              </button>
            )}
            {saveSettings && (
              <Link to="/tabata">
                <button
                  className="button-big-red"
                  onClick={() => loadPost()}>
                  Start Workout
                </button>
              </Link>
            )}
          </div>
        </div>
        {editorOpen}
      </div>
    </>
  );
};

export default Blog;
