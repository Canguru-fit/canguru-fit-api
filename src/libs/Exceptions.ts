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

  public static readonly DATA_NOT_FOUND = {
    message: 'Data not found',
    status: 404,
    code: '010',
  };

  constructor(error: IError, stack?: any) {
    super(error.message);
    this.status = error.status;
    this.code = error.code;
    this.stack = stack;
    this.field_errors = error.field_errors;
  }
}

export default Exception;
