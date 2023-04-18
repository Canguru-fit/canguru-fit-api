import tokensModel from '../../schemas/tokens.model';
import refreshTokensModel from '../../schemas/refreshTokens.model';
import axios from 'axios';

export const exchangeToken = async (): Promise<any> => {
  const refreshToken = await refreshTokensModel.findOne();

  if (!refreshToken.token) {
    throw new Error('Could not find refresh token')
  }

  let response = null

  try {
    response = await axios.get(`https://beds24.com/api/v2/authentication/token`, {
      headers: {
        refreshToken: refreshToken.token
      }
    })
  } catch (error) {
    console.log(error.message)
    throw new Error(`There was a problem while getting a new token: ${error.message}`)
  }

  return await tokensModel.create(response.data);
};


