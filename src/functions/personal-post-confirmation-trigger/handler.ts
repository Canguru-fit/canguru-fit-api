import { PostConfirmationTriggerEvent, PostConfirmationTriggerHandler } from 'aws-lambda';
import * as personalsService from '@functions/personals-api/personalsService';
import { connect } from '@libs/mongooseHelper';

let conn = null;
export const run: PostConfirmationTriggerHandler = async (event: PostConfirmationTriggerEvent) => {
  try {
    conn = conn || (await connect());
    console.log(JSON.stringify(event));
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      const { email, name, given_name = '', family_name = '' } = event.request.userAttributes;
      await personalsService.create({
        email,
        name: name || `${given_name} ${family_name}`,
        cognitoId: event.userName,
      });
    }

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
