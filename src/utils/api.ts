import { BASE_URL } from './constants';
import { request } from './utils';
import { Task } from '../models/models';

const headers: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-auth': `${localStorage.getItem('jwt')}`,
};

export const getData = () => {
  return request(`${BASE_URL}/userdocs/get`, {
    method: 'GET',
    headers: headers,
  });
};

export const createTask = (task: Task) => {
  return request(`${BASE_URL}/userdocs/create`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: headers,
  });
};

export const deleteTask = (id: string) => {
  return request(`${BASE_URL}/userdocs/delete/${id}`, {
    method: 'POST',
    headers: headers,
  });
};

export const updateTask = (task: Task, id: string) => {
  return request(`${BASE_URL}/userdocs/set/${id}`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: headers,
  });
};
