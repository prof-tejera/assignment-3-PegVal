import { useState, useContext } from "react";

import { BlogContext } from "./BlogProvider";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useSearchParams } from "react-router-dom";
import { createSearchParams } from "react-router-dom";

//import { useNavigate } from "react-router";

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
  const { posts, openPost, openEditor, deletePost, editorOpen, setPosts } =
    useContext(BlogContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [saveSettings, setSaveSettings] = useState(false);

  function handleQueryParamsChange() {
    const params = {
      filters: JSON.stringify(posts),
      //anotherField: "Simple String", // ----------------------------- / record ????
    };
    //localStorage.clear();
    setSearchParams(encodeSearchParams(params));
    setSaveSettings(true);
  }

  //data = decodeSearchParams(searchParams).filters;

  //const urlQuery = decodeSearchParams(searchParams).filters;
  //console.log("test---?", urlQuery);
  //const [url, setUrl] = useState(urlQuery);

  function loadPost() {
    setPosts(decodeSearchParams(searchParams).filters ?? []);
    localStorage.clear();
    //console.log("loading...", decodeSearchParams(searchParams).filters);
  }

  function reset() {
    setPosts([]);
    localStorage.clear();
    console.log("reset");
    setSaveSettings(false);
  }

  // ----- drag & Drop ---------
  const handleDrag = (results) => {
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
  };

  //const navigate = useNavigate();

  return (
    <>
      {/*  <div>
        <input
          value={urlFriend}
          onChange={(e) => {
            setUrlFriend(e.target.value);
            window.location.hash = encodeURIComponent(urlFriend);
          }}
        />
      </div> */}

      {/*  <div>
        <button onClick={loadPost}>Load Posts</button>
      </div> */}
      <div className="displayResult"></div>
      <div className="counter-container">
        <div className="panel">
          <div className="header">
            <div className="text">List of Workout </div>

            <Link to="/add">
              <button
                className="button-counter"
                onClick={() => openEditor()}>
                Add a timer
              </button>
            </Link>
            <button
              className="button-counter"
              onClick={loadPost}>
              Load Workout
            </button>
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
