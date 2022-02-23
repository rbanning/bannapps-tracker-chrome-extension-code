export const sendMessageAsPromise = (id, data) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ id }, response => {
            resolve(response);
        });
    });
};
