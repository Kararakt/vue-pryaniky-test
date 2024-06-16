export const handleResponseError = (response: any) => {
  if (response.error_message !== 'OK') {
    throw new Error('Неверные данные или ошибка на сервере');
  }
};
