import { Request, Response, NextFunction } from 'express';
import personalsModel, { Personal } from '@schemas/personals.model';
import studentsModel, { Student } from '@schemas/students.model';
import { verifyToken } from './cognitoUtils';
import Exception from './Exceptions';

type IAuthRequest = Request & { user: Personal | Student | null };
const param = {
  [process.env.AWS_COGNITO_PERSONAL_POOL_ID]: { db: personalsModel, att: 'personal' },
  [process.env.AWS_COGNITO_POOL_ID]: { db: studentsModel, att: 'student' },
};

const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const decoded = await verifyToken(req.headers.authorization);

  if (decoded) {
    const { db } = param[decoded?.UserPoolId];
    const foundUser = await db.findOne({ cognitoId: decoded?.sub });

    req.user = foundUser.toObject();
    return next();
  }
  return res.send(new Exception(Exception.UNAUTHORIZED));
};

export default authMiddleware;
