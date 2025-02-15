import { linkProviderUser } from '@libs/cognitoUtils';
import { connect } from '@libs/mongooseHelper';
import personalsModel from '@schemas/personals.model';
import { PreSignUpTriggerEvent, PreSignUpTriggerHandler } from '@types/aws-lambda';

let conn = null;

export const run: PreSignUpTriggerHandler = async (event: PreSignUpTriggerEvent, _context, callback) => {
  try {
    console.log(JSON.stringify(event));

    if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      conn = conn || (await connect());

      const { email } = event.request.userAttributes;
      const personal = await personalsModel.findOne({ email });
      if (personal) {
        const [, googleUserName] = event.userName.split('_');
        await linkProviderUser(email, googleUserName, event.userPoolId, 'Google');
      }
    }

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
