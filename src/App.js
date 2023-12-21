import "./App.css";

import BlogProvider from "./BlogProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Blog from "./CounterContext";
import DisplayDuration from "./DisplayDuration";
import Tabata from "./Tabata2";
import Editor from "./Editor";
import Documentation from "./DocumentationView";
import ErrorBoundary from "./ErrorBoundary";

import RecordURL from "./RecordURL";

const Inner = () => {
  const commonRoutes = (
    <>
      <Route
        path="/record"
        element={[<RecordURL />]}
      />
      <Route
        path="/"
        element={[<DisplayDuration />, <Blog />]}
      />
      <Route
        path="/workout"
        element={[<DisplayDuration />, <Blog />]}
      />
      <Route
        path="/tabata"
        element={[<DisplayDuration />, <Tabata />]}
      />
      <Route
        path="/document"
        element={<Documentation />}
      />
      <Route
        path="/add"
        element={[<DisplayDuration />, <Editor />]}
      />
    </>
  );
  return <Routes>{commonRoutes}</Routes>;
};

const App = () => {
  return (
    <BlogProvider>
      <BrowserRouter>
        <ErrorBoundary fallback="Oops. Une erreur c'est produite">
          <Inner />
        </ErrorBoundary>
      </BrowserRouter>
    </BlogProvider>
  );
};

export default App;
