import { linkProviderUser } from '@libs/cognitoUtils';
import { connect } from '@libs/mongooseHelper';
import personalsModel from '@schemas/personals.model';
import { PreSignUpTriggerEvent } from '@types/aws-lambda';

let conn = null;

export const run: (event: PreSignUpTriggerEvent) => Promise<PreSignUpTriggerEvent> = async (
  event: PreSignUpTriggerEvent
) => {
  try {
    console.log(JSON.stringify(event));

    conn = conn || (await connect());

    const { email } = event.request.userAttributes;

    const personal = await personalsModel.findOne({ email });
    if (personal) {
      if (event.triggerSource === 'PreSignUp_ExternalProvider') {
        const [, googleUserName] = event.userName.split('_');
        await linkProviderUser(email, googleUserName, event.userPoolId, 'Google', 'Cognito');
      } else {
        await linkProviderUser(email, event.userName, event.userPoolId, 'Cognito', 'Google');
      }
    }

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
