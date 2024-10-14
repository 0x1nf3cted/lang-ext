import { useEffect, useRef, useState } from 'react';
import { Button } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { translate } from './api/translate.api';
import { extractContentFromPage } from './utils/crawler';

export default function App() {
  const theme = useStorage(exampleThemeStorage);

  const translateRef = useRef(null)

  const [originalText, setOriginalText] = useState<string | null>(null);
  const [replacedText, setReplacedText] = useState<string | null>(null);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  // // Function to select and replace random text element
  // const replaceRandomText = async () => {
    
  //   // const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div'))
  //   //   .filter(el => el.innerText.trim().length > 0);

  //   const textElements = extractContentFromPage()

  //   if (textElements.length === 0) return;

  //   const randomIndex = Math.floor(Math.random() * textElements.length);
  //   const randomElement = textElements[randomIndex] as HTMLElement;
    
  //   const original = randomElement.innerText.trim();
  //   const newText = 'Replaced Text';  // You can customize this text
    
  //   // // Replace the text and highlight it
  //   // const translation = await translate(original)
  //   randomElement.innerHTML = `<mark ref=${translateRef} style="background-color: yellow; font-weight: bold;">${newText}</mark>`;
    

  //   // Update the states to reflect changes
  //   setOriginalText(original);
  //   setReplacedText(newText);
  //   setHighlightedElement(randomElement);

  //   translateRef.current.scrollIntoView()
  // };

  const replaceRandomText = async () => {
    // Use the `extractContentFromPage()` to get the text elements
    const textElements = extractContentFromPage();
  
    if (textElements.length === 0) return;
  
    // Select a random element from the filtered list
    const randomIndex = Math.floor(Math.random() * textElements.length);
    const randomElement = textElements[randomIndex] as HTMLElement;
  
    const original = randomElement.innerText.trim();
    const newText = 'Replaced Text';  // You can customize this text
  
    // Replace the text and highlight it
    randomElement.innerHTML = `<mark style="background-color: yellow; font-weight: bold;">${newText}</mark>`;
  
    // Update the states to reflect the changes
    setOriginalText(original);
    setReplacedText(newText);
    setHighlightedElement(randomElement);
  
    // Scroll to the modified element after updating it
    randomElement.scrollIntoView({
      behavior: 'smooth',  // Smooth scrolling
      block: 'center',     // Align the element in the center of the viewport
    });
  };
  

  useEffect(() => {
    // Wait for 3 seconds and then replace a random text
    const timer = setTimeout(() => {
      replaceRandomText();
    }, 3000);
    
    return () => clearTimeout(timer);  // Clean up the timer on component unmount
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
      {originalText && replacedText && highlightedElement && (
        // <div 
        //   className="p-4 bg-gray-200 border rounded-md shadow-md mt-4" 
        //   style={{
        //     position: 'absolute', 
        //     top: `${highlightedElement.getBoundingClientRect().top + window.scrollY}px`, 
        //     left: `${highlightedElement.getBoundingClientRect().left + window.scrollX + highlightedElement.offsetWidth + 10}px`
        //   }}
        // >
        //   <p><strong>Original:</strong> {originalText}</p>
        //   <p><strong>Replaced:</strong> {replacedText}</p>
        //   <button 
        //     onClick={() => {
        //       if (highlightedElement) {
        //         highlightedElement.innerHTML = originalText;  // Undo the replacement
        //         setOriginalText(null);  // Reset states
        //         setReplacedText(null);
        //         setHighlightedElement(null);
        //       }
        //     }}
        //     className="mt-2 bg-blue-500 text-white p-1 rounded"
        //   >
        //     Undo
        //   </button>
        // </div>
        <></>
      )}
    </div>
  );
}
