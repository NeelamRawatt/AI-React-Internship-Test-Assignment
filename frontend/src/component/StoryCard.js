import React, { useEffect, useState } from "react";
import "../StoryCard.css";
import Axios from "axios";
import avatar from "../images/avatar.svg";
import like from "../images/like.png";
import dislike from "../images/dislike.png";
import save from "../images/save.png";
import share from "../images/share.png";
import { Link } from "react-router-dom";

function StoryCard({ story, user, fullstory }) {
  console.log(story?.upVotedByMe);
  const [upvotes, setUpvotes] = useState(story?.upvotes);
  const [upVotedByMe, setUpVotedByMe] = useState(story?.upVotedByMe);
  const handleUpvote = async () => {
    try {
      const subUrl = upVotedByMe ? "downvote" : "upvote";
      console.log(`http://localhost:3001/${subUrl}/${story._id}`);
      const response = await Axios.put(
        `http://localhost:3001/${subUrl}/${story._id}/${user._id}`
      );
      if (response.status === 200) {
        if (upVotedByMe) {
          setUpvotes((prev) => prev - 1);
        } else {
          setUpvotes((prev) => prev + 1);
        }
        setUpVotedByMe((prev) => !prev);
      }
    } catch (error) {
      console.error("Error upvoting story:", error);
    }
  };

  const handleShareClick = () => {
    const storyUrl = `/story/${story._id}`;
    window.location.href = storyUrl;
  };

  return (
    <div className="story-card">
      <div className="user-info">
        <img className="user-icon" src={avatar} alt="User Icon" />
        <p className="username">{story?.user?.username}</p>
      </div>
      <p className="post-text">{story.prompt}</p>
      {fullstory ? (
        <p className="post-text">{story?.story}</p>
      ) : (
        <div className="text">{story?.story}</div>
      )}
      <div className="upvote-container">
        <button className="upvote-button" onClick={handleUpvote}>
          <span role="img" aria-label="heart emoji">
            {upVotedByMe ? (
              <img src={dislike} alt="DisLike" className="dislikeIcon" />
            ) : (
              <img src={like} alt="Like" className="likeIcon" />
            )}
          </span>
        </button>

        <p
          className="upvotes"
          style={{
            marginRight: "100px",
            marginLeft: "-60px",
            marginTop: "-15px",
          }}
        >
          {upvotes}
        </p>

        <img src={save} alt="save" className="saveIcon" />

        <a href="#" onClick={handleShareClick}>
          <img src={share} alt="Share" className="shareIcon" />
        </a>
      </div>

      {!fullstory && (
        <Link to={`/story/${story._id}`} style={{ color: "#FFFFFF" }}>
          Viewmore
        </Link>
      )}
    </div>
  );
}

export default StoryCard;
