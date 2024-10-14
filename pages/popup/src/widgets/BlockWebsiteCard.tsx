import React from 'react'
import { useState } from 'react';
import { FaSave, FaEdit } from 'react-icons/fa'; // You can choose any icon from react-icons
import { GiCheckMark } from "react-icons/gi";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";
import { BlockedWebsite } from '@src/pages/BlockedWebsites';

function BlockWebsiteCard({ website, onDelete }: { website: BlockedWebsite; onDelete: (id: string) => void }) {

    const deleteWebsite = (id: string) => {
        chrome.storage.sync.get(['blockedWebsite'], (result) => {
            const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
            const updatedWebsites = existingWebsites.filter((site) => site.id !== id); // Filter out the website to delete

            chrome.storage.sync.set({ blockedWebsite: updatedWebsites }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error deleting website:", chrome.runtime.lastError);
                    return;
                }
                onDelete(id); // Call the onDelete function to update the parent state
            });
        });
    };


    return (
        <div className='flex flex-row border-1 w-full py-4 px-2 text-white rounded-md'>
            <EditableInput website={website} />
            <div>
                <CiTrash color='red' size={28} className=' cursor-pointer' onClick={() => {
                    deleteWebsite(website.id)
                }} />
            </div>
        </div>
    )
}

export default BlockWebsiteCard


const EditableInput = ({ website }: { website: BlockedWebsite }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(website.website);

    // Handle input value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Toggle editing state
    const toggleEdit = () => {
        setIsEditing(true); // Set editing to true when clicked
    };
    const modifyWebsite = (website: BlockedWebsite) => {
        const editWord = website.website
        const editId = website.id
        if (editWord.trim() === '' || editId === null) return; // Ignore empty input or null ID

        chrome.storage.sync.get(['blockedWebsite'], (result) => {
            const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
            const updatedWebsites = existingWebsites.map((website) => {
                if (website.id === editId) {
                    return { ...website, website: inputValue }; // Modify the website
                }
                return website; // Return the website unchanged
            });

            chrome.storage.sync.set({ blockedWebsite: updatedWebsites }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error modifying website:", chrome.runtime.lastError);
                    return;
                }
            });
        });
    };
    // Save the input value and exit editing mode
    const handleSave = () => {
        console.log('Saved value:', inputValue);
        modifyWebsite(website)
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



