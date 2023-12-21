import { useContext } from "react";
import { BlogContext } from "./BlogProvider";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useSearchParams } from "react-router-dom";
import { createSearchParams } from "react-router-dom";

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

const RecordURL = () => {
  const { posts, editorOpen, setPosts } =
    useContext(BlogContext);

  const [searchParams, setSearchParams] = useSearchParams();

  function handleQueryParamsChange() {
    const params = {
      filters: JSON.stringify(posts),
    };
    setSearchParams(encodeSearchParams(params));
    console.log(decodeSearchParams(searchParams).filters);
  }

  function loadPost() {
    setPosts(decodeSearchParams(searchParams).filters);
    console.log("test", posts);
  }


//setPosts(decodeSearchParams(searchParams).filters);


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

  return (
    <>
  
      <div>
        <button onClick={loadPost}>Load Posts</button>
      </div>
      <div className="displayResult"></div>
      <div class="counter-container">
        <div className="panel">
          <div className="header">
            <div className="text">Registered Workout </div>
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
                            class="workout-container">
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
          {posts[0] && (
            <>
              
              <div className="footer-counter">
                <Link to="/tabata">
                  <button className="button-big">Start Workout</button>
                </Link>
              </div>
            </>
          )}
        </div>
        {editorOpen}
      </div>
    </>
  );
};


export default RecordURL;
