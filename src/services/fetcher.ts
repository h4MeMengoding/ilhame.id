import axios from 'axios';

export const fetcher = (url: string) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  return axios
    .get(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    .then((response) => response.data);
};
