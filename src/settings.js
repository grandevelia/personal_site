var apiTarget = 'https://devoeelias.herokuapp.com/';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    apiTarget = 'http://127.0.0.1:8000/';
}

export { apiTarget };