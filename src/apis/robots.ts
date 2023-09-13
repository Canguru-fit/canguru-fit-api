import axios from 'axios';

const robotsAPi = axios.create({
  baseURL: 'https://diligence-dev.quill.com.br/apis/',
  headers: { 'x-api-key': 'uBnA3AGzYgF1m6Hzras86SNpTSDOQak2dNw9soE7' },
});

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
