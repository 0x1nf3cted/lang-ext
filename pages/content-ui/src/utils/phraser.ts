import nlp from 'compromise';
import random from 'random';

export const extractRandomPhrase = (text: string): string => {
  const doc = nlp(text);

  // Get all sentences from the text
  const sentences = doc.sentences().out('array');

  // If no sentences are found, return a message
  if (sentences.length === 0) {
    return 'No comprehensible phrase found.';
  }

  // Select a random sentence
  const randomIndex = random.int(0, sentences.length - 1);
  const selectedSentence = sentences[randomIndex];

  return selectedSentence;
};

// Example usage
