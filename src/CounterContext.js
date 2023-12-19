import { useContext, useState } from "react";
import { BlogContext } from "./BlogProvider";
import { Link } from "react-router-dom";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

const Blog = () => {
  const { posts, openPost, openEditor, deletePost, editorOpen, setPosts } =
    useContext(BlogContext);



  const handleDrag = (results) => {
    //console.log("results", results);
    //console.log("posts", posts);

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
      <div class="counter-container">
        <div className="panel">
          <div className="header">
            <div className="text">List of Workout </div>

            <Link to="/add">
              <button
                className="button-big"
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
                  {posts.map( 
                    (
                      p,
                      index 
                    ) => (
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
                    )
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {posts[0] && (
            <div className="footer-counter">
              <Link to="/tabata">
                <button className="button-big">Start Workout</button>
              </Link>
            </div>
          )}
        </div>
        {editorOpen}
      </div>
    </>
  );
};

export default Blog;
