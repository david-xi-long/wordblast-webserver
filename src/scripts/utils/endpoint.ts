const getGameEndpoint = () =>
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : 'http://34.145.177.221:8080';

export default getGameEndpoint;
