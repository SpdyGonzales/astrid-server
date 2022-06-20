import axios from "axios";
import { Response } from "express";

export const getScore = async (
  audio: Blob,
  target_phrase: string,
  difficulty_level: string
) => {
  const options = {
    method: "POST",
    url: "https://global.voice-api.astrideducation.com/api/v1/score",
    data: {
      audio,
      target_phrase,
      difficulty_level,
      user_id: process.env.SPEECH_API_KEY,
    },
  };
  return axios(options);
};
