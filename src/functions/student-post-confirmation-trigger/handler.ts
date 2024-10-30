import { PostConfirmationTriggerEvent } from 'aws-lambda';

export const run: any = async (event: PostConfirmationTriggerEvent) => {
  try {
    console.log(JSON.stringify(event));

    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
  }
};
