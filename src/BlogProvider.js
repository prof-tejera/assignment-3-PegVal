import React from "react";
import { useEffect } from "react"; // --------------pour local storage
import { makeId } from "./util";
import { useState } from "react";

export const BlogContext = React.createContext({});

//const LOCAL_STORAGE_KEY = "blog-post"; // Local storage

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
}




const BlogProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  //const [posts, setPosts] = useState([]); // remettre si ça ne va pas
  const [posts, setPosts] = usePersistedState("blog-posts", []); // -------------------------------- local storage

  const closeEditor = () => {
    setSelectedPost(null);
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        setPosts, // -------------------------------------- ajouter pour drag&drop
        editorOpen: !!selectedPost,
        selectedPost,
        closeEditor,
        postCount: posts.length,

        deletePost: ({ id }) => setPosts(posts.filter((x) => x.id !== id)),
        /* deletePost: ({ id }) => {
          const p = posts.filter((p) => p.id !== id);
          setPosts(p);
        }, */

        openEditor: () => setSelectedPost({}),

        openPost: ({ id }) => {
          const p = posts.find((p) => p.id === id);
          setSelectedPost(p);
        },

        savePost: ({ id, title, duration, repeat, pause, type }) => {
          const updatedPost = {
            id,
            title,
            duration,
            repeat,
            pause,
            type,
          };

          if (id) {
            const updatedPosts = posts.map((p) =>
              p.id === id ? updatedPost : p
            );
            setPosts(updatedPosts);
          } else {
            // create a new post
            setPosts([
              ...posts,
              {
                ...updatedPost,
                id: makeId(),
              },
            ]);
          }

          closeEditor();
        },
      }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;
