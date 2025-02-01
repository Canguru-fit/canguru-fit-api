import { connect } from '@libs/mongooseHelper';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

let conn = null;
export const run: (event: PostConfirmationTriggerEvent) => Promise<PostConfirmationTriggerEvent> = async (
  event: PostConfirmationTriggerEvent
) => {
  try {
    console.log(JSON.stringify(event));

    conn = conn || (await connect());
    return event;
  } catch (error) {
    console.log('post confirmation trigger error', error);
    throw new Error(error);
  }
};
