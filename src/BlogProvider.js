import React from "react";
import { useEffect } from "react"; 
import { makeId } from "./util";
import { useState } from "react";

export const BlogContext = React.createContext({});

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

const BlogProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = usePersistedState("blog-posts", []); 

  const closeEditor = () => {
    setSelectedPost(null);
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        setPosts, 
        editorOpen: !!selectedPost,
        selectedPost,
        closeEditor,
        postCount: posts.length,

        deletePost: ({ id }) => setPosts(posts.filter((x) => x.id !== id)),

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
