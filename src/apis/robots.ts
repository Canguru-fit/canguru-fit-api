import axios from 'axios';

const robotsAPi = axios.create({
  baseURL: 'https://diligence-dev.quill.com.br/apis/',
  headers: { 'x-api-key': 'uBnA3AGzYgF1m6Hzras86SNpTSDOQak2dNw9soE7' },
});

const plexiApi = axios.create({
  // baseURL: 'https://sandbox.plexi.com.br',
  baseURL: 'https://api.plexi.com.br',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization:
      'Bearer KwxLEa0gpJDqU3C0UCxdlObUcyC5TxPfv8iEQuilciRsa0Mz8C6e7OM921eFYvZigxHzBwjavlg9WF81Xysu6jgTKK8iB9qUxqLs',
  },
});

const EXATO_TOKEN = '8fb5e716c0cc4cecb7333fa05366c456';

export const startRobot = async (data: any): Promise<any> => {
  try {
    return await robotsAPi.post('/document_request', { query: { ...data } }).then((res) => res.data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const refreshRobot = async (protocols: string[]): Promise<any> => {
  try {
    return await robotsAPi.post('/get_requested_documents', { protocol: protocols }).then((res) => res.data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const startExatoRobot = async ({ url, params }): Promise<any> => {
  console.log('Url', url);
  console.log('Params', { params: { token: EXATO_TOKEN, ...params } });

  try {
    return await axios.get(`${url}`, { params: { token: EXATO_TOKEN, ...params } }).then((res) => res.data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const startPlexiRobot = async ({ url, params }): Promise<any> => {
  console.log('Url', url);

  try {
    return plexiApi.post(`${url}`, { ...params }).then((res) => res.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    throw new Error(error.message);
  }
};

export const refreshPlexiRobot = async (protocol: string): Promise<any> => {
  try {
    const res = await plexiApi.get(`/api/maestro/result/${protocol}`).then((res) => res.data);
    return res;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    throw new Error(error.message);
  }
};
