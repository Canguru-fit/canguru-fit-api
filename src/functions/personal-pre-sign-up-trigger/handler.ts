import { linkProviderUser } from '@libs/cognitoUtils';
import personalsModel from '@schemas/personals.model';
import studentsModel from '@schemas/students.model';
import { PreSignUpTriggerEvent } from '@types/aws-lambda';

const personalUserPoolId = process.env.AWS_COGNITO_PERSONAL_POOL_ID;

export const run: (event: PreSignUpTriggerEvent) => Promise<PreSignUpTriggerEvent> = async (
  event: PreSignUpTriggerEvent
) => {
  try {
    console.log(JSON.stringify(event));
    if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      const database = event.userPoolId === personalUserPoolId ? personalsModel : studentsModel;

      const foundUser = await database.findOne({ email: event.request.userAttributes.email });

      if (foundUser) {
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
