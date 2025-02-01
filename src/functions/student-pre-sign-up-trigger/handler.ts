import { linkProviderUser } from '@libs/cognitoUtils';
import { connect } from '@libs/mongooseHelper';
import studentsModel from '@schemas/students.model';
import { PreSignUpTriggerEvent } from '@types/aws-lambda';

let conn = null;
export const run: (event: PreSignUpTriggerEvent) => Promise<PreSignUpTriggerEvent> = async (
  event: PreSignUpTriggerEvent
) => {
  try {
    conn = conn || (await connect());
    console.log(JSON.stringify(event));
    if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      const student = await studentsModel.findOne({ email: event.request.userAttributes.email });

      if (student) {
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
