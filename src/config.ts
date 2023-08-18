interface Config {
  API_BASE_URL: string;
}

const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
};

export default config;
