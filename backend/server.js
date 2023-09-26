const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const storyModel = require("./models/Stories");
const UserModel = require("./models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://neelam30rawat:fdKGNwKppaj06BaV@cluster0.58clcqf.mongodb.net/mern"
);

const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

// const configuration = new Configuration();
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});
async function generateStory(prompt, maxWords) {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: maxWords,
  });

  const completion = response.choices[0].text;
  console.log("Generated Story:");
  console.log(completion);

  return completion;
}
passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // Specify the field names for username and password
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
app.post("/registerUser", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("in tryyyyyyy");
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      console.log("in tryyyyyyy11111");
      console.log("user already present -------");
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = new UserModel({
      username,
      password,
    });
    console.log("username -----", username);

    console.log("in tryyyyyyy22222");

    await newUser.save();
    console.log("in tryyyyyyy333", newUser);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Details incomplete" });
  }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.password === password) {
        res.status(200).json({ message: "registration success", user: user });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Smething went wrong" });
  }
});

app.post("/submitStory", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { prompt, story } = req.body;

  try {
    console.log(req.user);
    const newStory = new storyModel({
      prompt,
      story,
      upvotes: 0,
      user: req.user._id,
    });

    await newStory.save();

    res.status(201).json({ message: "Story submitted successfully" });
  } catch (error) {
    console.error("Error submitting story:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getAllStories/:userId", async (req, resp) => {
  try {
    const userId = req.params.userId;
    let storiesWithUsers = await storyModel
      .find()
      .populate({ path: "user" })
      .exec();
    const storyRes = storiesWithUsers.map((story) => {
      let upVotedByMe = false;
      if (story.upvotedBy.includes(userId)) {
        upVotedByMe = true;
      }

      story.set("upVotedByMe", upVotedByMe, { strict: false });

      return story;
    });
    console.log(storyRes);
    resp.json(storyRes);
  } catch (error) {
    console.error("Error fetching stories:", error);
    resp.status(500).json({ error: "Internal server error" });
  }
});
app.get("/getDetails/:id", async (req, resp) => {
  try {
    const userId = req.params.id;
    let storiesWithUsers = await storyModel
      .find({ user: userId })
      .populate({ path: "user" })
      .exec();

    const storyRes = storiesWithUsers.map((story) => {
      let upVotedByMe = false;
      if (story.upvotedBy.includes(userId)) {
        upVotedByMe = true;
      }

      story.set("upVotedByMe", upVotedByMe, { strict: false });
      return story;
    });
    console.log(storyRes);
    resp.json(storyRes);
  } catch (error) {
    console.error("Error fetching stories:", error);
    resp.status(500).json({ error: "Internal server error" });
  }
});

app.post("/setDetails", async (req, resp) => {
  const { story, user } = req.body;
  const storyToSave = {
    ...story,
    user: user._id,
    upVotedByMe: false,
  };
  const newStory = new storyModel(storyToSave);
  await newStory.save();
  await newStory.populate({ path: "user" });
  resp.json(newStory);
});
app.put("/upvote/:storyId/:userId", async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.params.userId;
    const story = await storyModel.findById(storyId);
    if (story.upvotedBy.includes(userId)) {
      res.status(400).json({ message: "Already upvoted" });
      return;
    }
    story.upvotedBy.push(userId);
    story.upvotes += 1;

    await story.save();

    res.status(200).json({ message: "Upvote successful" });
  } catch (error) {
    console.error("Error upvoting story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/downVote/:storyId/:userId", async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.params.userId;
    const story = await storyModel.findById(storyId);
    if (!story.upvotedBy.includes(userId)) {
      res.status(400).json({ message: "Not upvoted yet" });
      return;
    }
    story.upvotedBy = story.upvotedBy.filter((id) => id != userId);
    story.upvotes -= 1;

    await story.save();

    res.status(200).json({ message: "Upvote successful" });
  } catch (error) {
    console.error("Error upvoting story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/checkUsername/:username", async (req, res) => {
  const { username } = req.params;
  console.log("heyyyy");
  try {
    const existingUser = await UserModel.findOne({ username });
    console.log("heyyyy2");

    if (existingUser) {
      console.log("heyyyy3");

      res.json({ isTaken: true });
    } else {
      console.log("heyyyy4");

      res.json({ isTaken: false });
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/mostUpvotedStories", async (req, res) => {
  try {
    const mostUpvotedStories = await storyModel
      .find({})
      .populate({ path: "user" })
      .sort({ upvotes: -1 })
      .exec();
    mostUpvotedStories.forEach((story) => {
      console.log(story?.upvotes);
    });
    res.json(mostUpvotedStories);
  } catch (error) {
    console.error("Error fetching most upvoted stories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/getStory/:storyId", async (req, res) => {
  const storyId = req.params.storyId;

  try {
    // Fetch the story from the database based on storyId
    const story = await storyModel.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    const finalStory = await story.populate({ path: "user" });
    res.json(finalStory);
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/generate-story", async (req, res) => {
  const { user, prompt } = req.body;

  try {
    const userdet = await UserModel.find({ username: user.username });
    if (!userdet) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const generatedStory = await generateStory(prompt, 200);
    const storyToSave = {
      prompt,
      story: generatedStory,
      user: user._id,
      upVotedByMe: false,
    };
    const newStory = new storyModel(storyToSave);
    await newStory.save();
    await newStory.populate({ path: "user" });
    res.json(newStory);
    // Fetch the story from the database based on storyI
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
