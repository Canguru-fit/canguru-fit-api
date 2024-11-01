import { connect } from '@libs/mongooseHelper';
import { PostConfirmationTriggerEvent, PostConfirmationTriggerHandler } from 'aws-lambda';
import * as personalsService from '@functions/personals-api/personalsService';

export const run: PostConfirmationTriggerHandler = async (event: PostConfirmationTriggerEvent) => {
  await connect();
  try {
    console.log(JSON.stringify(event));
    await personalsService.create({
      email: event.request.userAttributes.email,
      name: event.request.userAttributes.email,
      cognitoId: event.userName,
    });

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
