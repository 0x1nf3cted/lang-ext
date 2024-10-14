import React from 'react'
import { useState } from 'react';
import { FaSave, FaEdit } from 'react-icons/fa'; // You can choose any icon from react-icons
import { GiCheckMark } from "react-icons/gi";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";


function BlockwordCard({ word, onDelete }: { word: Blockedword; onDelete: (id: string) => void }) {

    const deleteword = (id: string) => {
        chrome.storage.sync.get(['blockedword'], (result) => {
            const existingwords: Blockedword[] = result.blockedword || [];
            const updatedwords = existingwords.filter((site) => site.id !== id); // Filter out the word to delete

            chrome.storage.sync.set({ blockedword: updatedwords }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error deleting word:", chrome.runtime.lastError);
                    return;
                }
                onDelete(id); // Call the onDelete function to update the parent state
            });
        });
    };


    return (
        <div className='flex flex-row border-1 w-full py-4 px-2 text-white rounded-md'>
            <EditableInput word={word} />
            <div>
                <CiTrash color='red' size={28} className=' cursor-pointer' onClick={() => {
                    deleteword(word.id)
                }} />
            </div>
        </div>
    )
}

export default BlockwordCard


const EditableInput = ({ word }: { word: Blockedword }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(word.word);

    // Handle input value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Toggle editing state
    const toggleEdit = () => {
        setIsEditing(true); // Set editing to true when clicked
    };
    const modifyword = (word: Blockedword) => {
        const editWord = word.word
        const editId = word.id
        if (editWord.trim() === '' || editId === null) return; // Ignore empty input or null ID

        chrome.storage.sync.get(['blockedword'], (result) => {
            const existingwords: Blockedword[] = result.blockedword || [];
            const updatedwords = existingwords.map((word) => {
                if (word.id === editId) {
                    return { ...word, word: inputValue }; // Modify the word
                }
                return word; // Return the word unchanged
            });

            chrome.storage.sync.set({ blockedword: updatedwords }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error modifying word:", chrome.runtime.lastError);
                    return;
                }
            });
        });
    };
    // Save the input value and exit editing mode
    const handleSave = () => {
        console.log('Saved value:', inputValue);
        modifyword(word)
        setIsEditing(false);
    };


    return (
        <div className="flex items-center">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        style={{ color: "black" }}
                        value={inputValue}
                        onChange={handleChange}
                        className="border rounded p-1"
                        onBlur={handleSave} // Automatically save when input loses focus
                    />
                    <button onClick={handleSave} className="ml-2">
                        <GiCheckMark size={28} color='green' />
                    </button>
                </>
            ) : (
                <>
                    <span className="mr-2 cursor-pointer" onClick={toggleEdit}>
                        {inputValue}
                    </span>
                    <button onClick={toggleEdit}>
                        <BiEdit size={28} color='green' />
                    </button>
                </>
            )}
        </div>
    );
};



