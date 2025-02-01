import { PostConfirmationTriggerEvent, PostConfirmationTriggerHandler } from 'aws-lambda';
import * as personalsService from '@functions/personals-api/personalsService';

export const run: PostConfirmationTriggerHandler = async (event: PostConfirmationTriggerEvent) => {
  try {
    console.log(JSON.stringify(event));
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      await personalsService.create({
        email: event.request.userAttributes.email,
        name: event.request.userAttributes.name,
        cognitoId: event.userName,
      });
    }

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
