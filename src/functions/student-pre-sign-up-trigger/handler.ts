import { PreSignUpTriggerEvent } from 'aws-lambda';

export const run: any = async (event: PreSignUpTriggerEvent) => {
  try {
    console.log(JSON.stringify(event));

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
  }
};
