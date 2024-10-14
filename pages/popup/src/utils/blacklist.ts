import { BlockedWebsite } from '@src/pages/BlockedWebsites';
import { v4 as uuidv4 } from 'uuid'; // Import UUID function

export const addWebsite = (host: string) => {
  if (host.trim() === '') return; // Ignore empty input

  const newWebsite: BlockedWebsite = {
    website: host,
    id: uuidv4(), // Generate a new UUID
  };

  chrome.storage.sync.get(['blockedWebsite'], result => {
    const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
    const updatedWebsites = [...existingWebsites, newWebsite];

    chrome.storage.sync.set({ blockedWebsite: updatedWebsites }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving website:', chrome.runtime.lastError);
        return;
      }
    });
  });
};

export const deleteWebsite = (website: string) => {
  chrome.storage.sync.get(['blockedWebsite'], result => {
    const existingWebsites: BlockedWebsite[] = result.blockedWebsite || [];
    const updatedWebsites = existingWebsites.filter(site => site.website !== website); // Filter out the website to delete

    chrome.storage.sync.set({ blockedWebsite: updatedWebsites }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error deleting website:', chrome.runtime.lastError);
        return;
      }
    });
  });
};
