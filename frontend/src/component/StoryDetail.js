import React, { useEffect, useState } from "react";
import Axios from "axios";
import StoryCard from "./StoryCard";
import { useLoaderData } from "react-router-dom";

const getStory = async (storyId) => {
  try {
    console.log(`http://localhost:3001/getStory/${storyId}`);
    const response = await Axios.get(
      `http://localhost:3001/getStory/${storyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching story:", error);
  }
};

export async function loader({ params }) {
  const story = await getStory(params.storyId);
  return { story };
}

function StoryDetail({ fullStory }) {
  const { story } = useLoaderData();

  return (
    <div>
      {story ? <StoryCard story={story} fullstory={true} /> : <p>Loading...</p>}
    </div>
  );
}

export default StoryDetail;
