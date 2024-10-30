import { useEffect, useRef, useState } from 'react';
import { Button } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { translate } from './api/translate.api';
import { extractContentFromPage } from './utils/crawler';
import TranslationBox from './components/TranslationBox';
import './styles/style.css';
import { extractRandomPhrase } from './utils/phraser';
import QuizBox from './components/QuizBox';
import SentenceConstructor from './components/SentenceConstructor';
// import { phraser } from './utils/phraser';

enum CurrentPage {
  TRANSLATION,
  QUIZ,
  SENTENCE,
}

export default function App() {
  const theme = useStorage(exampleThemeStorage);

  const [currentPage, setCurrentPage] = useState<CurrentPage>(CurrentPage.TRANSLATION);

  const translateRef = useRef(null);

  const [displayBox, setDisplayBox] = useState(false);

  const [originalText, setOriginalText] = useState<string | null>(null);
  const [replacedText, setReplacedText] = useState<string | null>(null);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const definitions = ['A common greeting', 'Used to address someone'];
  const exampleSentences = ['Hello world, how are you?', 'Hello everyone!'];

  const replaceRandomText = async () => {
    const textElements = extractContentFromPage();

    if (textElements.length === 0) return;

    // Select a random element from the filtered list
    const randomIndex = Math.floor(Math.random() * textElements.length);
    const randomElement = textElements[randomIndex] as HTMLElement;

    const original_item = randomElement.innerText.trim();
    const original = extractRandomPhrase(original_item);

    // Replace the text and highlight it
    randomElement.innerHTML = `<mark>${original}</m""ark>`;

    // Update the states to reflect the changes
    setOriginalText(original_item);
    setReplacedText(original);
    setHighlightedElement(randomElement);

    randomElement.classList.add('yellowhighlight');

    // Scroll to the modified element after updating it
    randomElement.scrollIntoView({
      behavior: 'smooth', // Smooth scrolling
      block: 'center', // Align the element in the center of the viewport
    });

    // Add click event listener to toggle displayBox visibility
    randomElement.addEventListener('click', () => {
      setDisplayBox(prev => !prev); // Toggle the displayBox
    });
  };

  useEffect(() => {
    // Wait for 3 seconds and then replace a random text
    const timer = setTimeout(() => {
      replaceRandomText();
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 bg-blue-100">
      <div className="flex gap-1 text-blue-500">
        Edit <strong className="text-blue-700">pages/content-ui/src/app.tsx</strong> and save to reload.
      </div>

      <Button theme={theme} onClick={exampleThemeStorage.toggle}>
        Toggle Theme
      </Button>

      {/* Show the original and replaced text after modification */}
      {originalText && replacedText && highlightedElement && displayBox && (
        <>
          {/* Handle the switch case logic if needed */}
          {(() => {
            switch (currentPage) {
              case CurrentPage.QUIZ:
                // Render something specific to the quiz page
                return (
                  <QuizBox
                    originalText={originalText}
                    replacedText={replacedText}
                    highlightedElement={highlightedElement}
                    hideBox={() => setDisplayBox(false)}
                    change={() => setCurrentPage(CurrentPage.SENTENCE)}
                  />
                );
              case CurrentPage.SENTENCE:
                // Render something specific to the sentence constructor page
                return (
                  <SentenceConstructor
                    sentence={replacedText}
                    highlightedElement={highlightedElement}
                    hideBox={() => setDisplayBox(false)}
                    change={() => setCurrentPage(CurrentPage.TRANSLATION)}
                  />
                );
              default:
                // Render the TranslationBox by default
                return (
                  <TranslationBox
                    originalText={originalText}
                    replacedText={replacedText}
                    definitions={definitions}
                    exampleSentences={exampleSentences}
                    highlightedElement={highlightedElement} // This should be the element you want to position it relative to
                    hideBox={() => setDisplayBox(false)}
                    change={() => setCurrentPage(CurrentPage.QUIZ)}
                  />
                );
            }
          })()}
        </>
      )}
    </div>
  );
}
