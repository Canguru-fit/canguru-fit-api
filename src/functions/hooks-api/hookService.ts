import { Request } from 'express';
import hooksModel from 'src/schemas/hooks.model';
import axios from 'axios';

export const bookingsHook = async (req: Request): Promise<any> => {
  const hooks = await hooksModel.find({name: 'BOOKINGS'});

  const forwardRequest = {
    body: {...req.body},
    ...req.query
  }

  const apiCalls = hooks.map((hook) => {
    const url = new URL(hook.url);
    for (const key in req.query) {
      url.searchParams.set(key, req.query[key].toString());
    }

    console.log('URL', url.toString());

    return axios({
      method: hook.requestType,
      url: url.toString(),
      data: forwardRequest
    });
  });

  try {
    await Promise.allSettled(apiCalls);

    console.log('Booking webhook info', forwardRequest);

    return hooks.map(hook => hook.url)
  } catch (error) {
    throw new Error('Error forwarding requests', error)
  }
};

export const propertiesHook = async (req: Request): Promise<any> => {
  const hooks = await hooksModel.find({name: 'PROPERTIES'});

  const forwardRequest = {
    ...req.body,
    ...req.query
  }

  const apiCalls = hooks.map((hook) => axios({
    method: hook.requestType,
    url: hook.url,
    data: forwardRequest
  }));


  try {
    await Promise.allSettled(apiCalls);

    console.log('Property webhook info', forwardRequest);

    return hooks.map(hook => hook.url)
  } catch (error) {
    throw new Error('Error forwarding requests', error)
  }
};

export const subscribe = async (hook): Promise<any> => {
    return await hooksModel.create(hook);
};

