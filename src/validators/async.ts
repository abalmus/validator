import 'whatwg-fetch';

export default function async(value, config) {
    return new Promise((resolve, reject) => {
        fetch(config.url, config)
        .then(response => (response.json()))
        .then(response => {
            if (response.status === 'ERROR') {
                reject(response.message);
            }

            resolve(response);
        }).catch(reason => {
            reject(reason);
        });
    });
};
