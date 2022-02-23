export const sendMessageAsPromise = (id: string, data?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({id}, response => {
      resolve(response);
    });
  });
}