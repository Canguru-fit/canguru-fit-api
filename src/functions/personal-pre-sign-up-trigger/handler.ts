import { linkProviderUser } from '@libs/cognitoUtils';
import personalsModel from '@schemas/personals.model';

import { PreSignUpTriggerEvent } from '@types/aws-lambda';

export const run: (event: PreSignUpTriggerEvent) => Promise<PreSignUpTriggerEvent> = async (
  event: PreSignUpTriggerEvent
) => {
  try {
    console.log(JSON.stringify(event));
    if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      const personal = await personalsModel.findOne({ email: event.request.userAttributes.email });

      if (personal) {
        const [, googleUserName] = event.userName.split('_');
        await linkProviderUser(event.request.userAttributes.email, googleUserName, event.userPoolId);
        return event;
      }
    }

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
