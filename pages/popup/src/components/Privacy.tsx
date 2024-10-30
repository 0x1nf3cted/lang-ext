import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FaCirclePlus } from 'react-icons/fa6';
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
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
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
  },
}));

function Privacy() {
  const [url, setUrl] = useState<string>('');
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [isCurrentWebsiteBlocked, setIsCurrentWebsiteBlocked] = useState<boolean>(false);

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
        const host = domain.hostname;
        setUrl(host);

        chrome.storage.sync.get(['blockedWebsite'], result => {
          const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
          const isBlocked = existingWebsites.some(website => website.website === host);
          setIsCurrentWebsiteBlocked(isBlocked);
        });
      }
    };

    fetchUrl();

    chrome.storage.sync.get(['nsfw'], result => {
      if (result.nsfw !== undefined) {
        setNsfw(result.nsfw);
      }
    });
  }, [url]);

  const handleNsfw = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNsfwValue = event.target.checked;
    setNsfw(newNsfwValue);
    chrome.storage.sync.set({ nsfw: newNsfwValue });
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-md text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <strong className="text-gray-700">Privacy Settings</strong>
      </div>

      {/* NSFW Language Filter */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 font-bold">NSFW Language Filter:</p>
        <IOSSwitch checked={nsfw} onChange={handleNsfw} />
      </div>

      {/* Block Current Website */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 font-bold">Block This Website:</p>
        <IOSSwitch checked={isCurrentWebsiteBlocked} onChange={blockCurrentWebsite} />
      </div>

      {/* Block Websites Link */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 font-bold">Manage Blocked Websites:</p>
        <Link to="/blocked">
          <FaCirclePlus size={24} className="cursor-pointer text-gray-600" />
        </Link>
      </div>
    </div>
  );
}

export default Privacy;
