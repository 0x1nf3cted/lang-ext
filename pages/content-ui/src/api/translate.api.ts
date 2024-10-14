import { url } from './base.api';
import axios from 'axios';

export const translate = async (phrase: string): Promise<any> => {
  try {
    const language = await new Promise<string>((resolve) => {
      chrome.storage.sync.get(['language'], (result) => {
        resolve(result.language || ''); // Default to empty string if language is not set
      });
    });

    const difficulty = await new Promise<string>((resolve) => {
      chrome.storage.sync.get(['difficulty'], (result) => {
        resolve(result.difficulty || ''); // Default to empty string if difficulty is not set
      });
    });

    const data = {
      phrase: phrase,
      language: language,
      difficulty: difficulty,
    };

    const response = await axios.post(`${url}/translate`, data);
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error("Couldn't retrieve the translation");
  }
};
