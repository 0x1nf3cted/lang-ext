import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { addWebsite, deleteWebsite } from '@src/utils/blacklist';
import { BlockedWebsite } from '@src/pages/BlockedWebsites';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

function Privacy() {
  const [url, setUrl] = useState<string>("");
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [isCurrentWebsiteBlocked, setIsCurrentWebsiteBlocked] = useState<boolean>(false);

  // Toggles the blocking of the current website
  const blockCurrentWebsite = async () => {
    if (isCurrentWebsiteBlocked) {
      deleteWebsite(url);
      setIsCurrentWebsiteBlocked(false);
    } else {
      addWebsite(url);
      setIsCurrentWebsiteBlocked(true);
    }
  };

  useEffect(() => {
    const fetchUrl = async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0] && tabs[0].url) {
        const currentTabUrl = tabs[0].url;
        const domain = new URL(currentTabUrl);
        const host = domain.hostname; // Get the hostname
        setUrl(host);

        // Check if the website is blocked
        chrome.storage.sync.get(['blockedWebsite'], (result) => {
          const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
          const isBlocked = existingWebsites.some(website => website.website === host);
          setIsCurrentWebsiteBlocked(isBlocked);
        });
      }
    };
    
    fetchUrl();

    // Fetch saved NSFW setting from Chrome storage
    chrome.storage.sync.get(['nsfw'], (result) => {
      if (result.nsfw !== undefined) {
        setNsfw(result.nsfw);
      }
    });
  }, [url]);

  const handleNsfw = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNsfwValue = event.target.checked;
    setNsfw(newNsfwValue);

    // Save the updated NSFW setting to Chrome storage
    chrome.storage.sync.set({ nsfw: newNsfwValue }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving NSFW setting:", chrome.runtime.lastError);
      }
    });
  };

  return (
    <div className='flex flex-col w-full bg-blue-700 gap-y-6 rounded-md p-2 mt-4'>
      <h1 className='text-xl text-white'>Privacy</h1>
      <div className='flex w-full flex-row justify-between items-center'>
        <p className='text-white text-md'>NSFW language filter</p>
        <IOSSwitch checked={nsfw} onChange={handleNsfw} />
      </div>
      <div className='flex w-full flex-row justify-between items-center'>
        <p className='text-white text-md'>Block this website</p>
        <IOSSwitch checked={isCurrentWebsiteBlocked} onChange={blockCurrentWebsite} />
      </div>
      <div className='flex w-full flex-row justify-between items-center'>
        <p className='text-white text-md'>Block websites</p>
        <Link to="/blocked">
          <FaCirclePlus size={24} color='white' className='cursor-pointer self-center mr-2' />
        </Link>
      </div>
    </div>
  );
}

export default Privacy;
