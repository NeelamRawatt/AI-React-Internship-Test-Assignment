const express = require("express");

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

module.exports = generateStory;
