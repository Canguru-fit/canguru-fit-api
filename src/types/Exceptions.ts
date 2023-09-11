export interface IError {
  message: string;
  status: number;
  code: string;
  field_errors?: string[];
}

class Exception extends Error {
  status: number;

  code: string;

  stack?: string;

  field_errors?: string[];

  public static readonly RECORD_NOT_FOUND = {
    message: 'Record not found',
    status: 404,
    code: '002',
  };

  public static readonly RECORD_ALREADY_EXISTS = {
    message: 'Record already exists',
    status: 400,
    code: '003',
  };

  public static readonly PROPERTY_ALREADY_EXISTS_API_AS_SERVICE = {
    message: 'property already in another open opportunity',
    status: 400,
    code: '003',
  };

  public static readonly RECORD_IN_USE = {
    message: 'Record in use',
    status: 400,
    code: '004',
  };

  public static readonly ASSOCIATION_ALREADY_EXISTS = {
    message: 'Association already exists',
    status: 400,
    code: '005',
  };

  public static readonly STARTING_ROBOT = {
    message: 'Error starting robot',
    status: 400,
    code: '006',
  };

  public static readonly GETTING_ROBOT_STATUS = {
    message: 'Error getting robot status',
    status: 400,
    code: '007',
  };

  public static readonly UPLOAD_ERROR = {
    message: 'Upload error',
    status: 400,
    code: '008',
  };

  public static readonly INVALID_FILE = {
    message: 'Invalid file',
    status: 404,
    code: '009',
  };

  public static readonly FILE_NOT_FOUND = {
    message: 'File not found',
    status: 404,
    code: '010',
  };

  public static readonly ERROR_SENDING_EMAIL = {
    message: 'Error sending email',
    status: 400,
    code: '011',
  };

  public static readonly ERROR_GENERATING_FILE = {
    message: 'Error generating file',
    status: 400,
    code: '012',
  };

  public static readonly ERROR_CREATING_USER = {
    message: 'Error creating user',
    status: 400,
    code: '013',
  };

  public static readonly ERROR_CREATING_RECORD = {
    message: 'Error creating record',
    status: 400,
    code: '014',
  };

  public static readonly ERROR_GETTING_DATA = {
    message: 'Error getting data',
    status: 400,
    code: '015',
  };

  public static readonly NEED_TO_BE_FINISHED = {
    message: 'Need to be finished',
    status: 400,
    code: '016',
  };

  public static readonly UNKNOWN_STATUS_FROM_BANKER = {
    message: 'Unknown status from banker',
    status: 400,
    code: '017',
  };

  public static readonly ERROR_RESENDING_CONFIRMATION_CODE = {
    message: 'Error resending confirmation code',
    status: 400,
    code: '018',
  };

  public static readonly USER_ALREADY_CONFIRMED = {
    message: 'User is already confirmed.',
    status: 400,
    code: '019',
  };

  public static readonly PERMISSION_DENIED = {
    message: 'Permission denied.',
    status: 401,
    code: '020',
  };

  public static readonly FIELDS_NOT_FILLED = {
    message: 'Some of the fields are not written',
    status: 400,
    code: '021',
  };

  public static readonly USER_NOT_FOUND = {
    message: 'User not found',
    status: 404,
    code: '022',
  };

  public static readonly API_ERROR = {
    message: 'Error executing api',
    status: 500,
    code: '023',
  };

  public static readonly ERROR_VALIDATING_TOKEN = {
    message: 'Error while validating token',
    status: 500,
    code: '024',
  };

  public static readonly EMAIL_ALREADY_USE = {
    message: 'Email already use',
    status: 400,
    code: '25',
  };

  public static readonly INVALID_DOCUMENT_TYPE = {
    message: 'Invalid document type',
    status: 400,
    code: '26',
  };

  public static readonly STAGE_IN_PROGRESS = {
    message: 'Stage in progress',
    status: 400,
    code: '27',
  };

  public static readonly NOTIFICATION_ERROR = {
    message: 'Error send notification',
    status: 500,
    code: '028',
  };

  public static readonly ACTIVITY_ERROR = {
    message: 'Comment is empty ',
    status: 400,
    code: '029',
  };

  public static readonly LIVE_ALREADY_ENABLED = {
    message: 'One Live is already enabled',
    status: 400,
    code: '030',
  };

  public static readonly DESCRIPTION_ALREADY_EXISTS = {
    message: 'Description already exists',
    status: 400,
    code: '031',
  };

  public static readonly API_NOT_ACCEPTED = {
    message: 'Request to api external not accepted',
    status: 406,
    code: '032',
  };

  public static readonly ORDER_IN_USE = {
    message: 'Order in use',
    status: 400,
    code: '033',
  };

  public static readonly INVALID_CSV_FORMAT = {
    message: 'Invalid csv format. The csv file must contain at leat one column named E-mail',
    status: 417,
    code: '034',
  };

  public static readonly ERROR_READING_CSV = {
    message: 'There was an error while reading the csv file',
    status: 500,
    code: '035',
  };

  public static readonly ERROR_READING_HTML = {
    message: 'There was an error while reading the html file',
    status: 500,
    code: '036',
  };

  public static readonly MAX_HIGHLIGHTED_FEATURES = {
    message: 'Max highlighted features reached',
    status: 400,
    code: '038',
  };

  public static readonly MAX_FEATURED_ROOMS = {
    message: 'Max featured rooms reached',
    status: 400,
    code: '037',
  };

  public static readonly IDS_REQUIRED = {
    message: 'Property_id and room_id are required',
    status: 400,
    code: '039',
  };

  public static readonly FEATURE_ALREADY_USED = {
    message: 'Feature already used',
    status: 400,
    code: '040',
  };

  public static readonly FEATURE_CANNOT_BE_DELETED = {
    message: 'Feature cannot be deleted',
    status: 400,
    code: '041',
  };

  public static readonly ICON_ALREADY_USED = {
    message: 'Icon already used',
    status: 400,
    code: '042',
  };

  public static readonly CODE_ALREADY_USED = {
    message: 'Code already used',
    status: 400,
    code: '043',
  };

  public static readonly FEATURES_CATEGORY_IN_USE = {
    message: 'Features category in use',
    status: 400,
    code: '044',
  };

  // TODO: implementar logger error
  constructor(error: IError, stack?: any) {
    super(error.message);
    this.status = error.status;
    this.code = error.code;
    this.stack = stack;
    // this.stack = typeof stack?.split !== 'function' ? JSON.stringify(stack) : stack;
    this.field_errors = error.field_errors;
  }
}

export default Exception;
