import { BASE_URL } from './constants';
import { request } from './utils';

export const login = (username: string, password: string) => {
  return request(`${BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
