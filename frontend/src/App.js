import React, { useEffect, useState } from "react";
import "./App.css";
import StoryForm from "./component/StoryForm";
import StoryCard from "./component/StoryCard";
import Axios from "axios";
import RegisterForm from "./component/RegisterForm";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import StoryDetail, { loader as StoryLoader } from "./component/StoryDetail";
import MainComp from "./MainComp";
import ErrorPage from "./component/ErrorPage";

const dummyStory = {
  prompt: "A beautiful car",
  story: "bsadknsad",
  upvotes: 4,
};

const buttonTypes = {
  MY_STORIES: "mystory",
  ALL_STORIES: "allsotries",
  MOST_UPVOTED: "most_upvoted",
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainComp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/story/:storyId",
    element: <StoryDetail fullStory={true} />,
    errorElement: <ErrorPage />,
    loader: StoryLoader,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
