import { BASE_URL } from './constants';
import { checkResponse } from './utils';

const request = (url: string, options: RequestInit) => {
  return fetch(url, options).then(checkResponse);
};

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
