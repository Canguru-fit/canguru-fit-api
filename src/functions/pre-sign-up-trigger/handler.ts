import { PreSignUpTriggerEvent } from 'aws-lambda';

export const run: any = async (event: PreSignUpTriggerEvent) => {
  try {
    if (event.triggerSource === 'PreSignUp_SignUp') {
      const preSignUpObj = event;
      preSignUpObj.response.autoConfirmUser = true;
      preSignUpObj.response.autoVerifyEmail = true;
      return preSignUpObj;
    }

    return event;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('pre sign up trigger error', error);
  }
};
