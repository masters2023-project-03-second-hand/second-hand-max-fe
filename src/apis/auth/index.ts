import { fetchData, fetchDataWithToken } from 'apis/fetchData';
import {
  SignInUserResponse,
  SignUpUserResponse,
  UpdateAccessTokenResponse,
} from './types';
import {
  BASE_URL,
  OAUTH_PROVIDER,
  OAUTH_REDIRECT_URI,
} from '@constants/ENV_VARIABLES';
import { useUserStore } from 'stores/useUserStore';

export const signUpUser = async ({
  code,
  id,
  file,
  addressIds,
}: {
  code: string;
  id: string;
  file?: File;
  addressIds: number[];
}): Promise<SignUpUserResponse> => {
  const formData = new FormData();

  if (file) {
    formData.append('profile', file);
  }

  const data = JSON.stringify({ loginId: id, addressIds });
  formData.append('signupData', new Blob([data], { type: 'application/json' }));

  const response = await fetchData(
    `/auth/${OAUTH_PROVIDER}/signup?code=${code}&redirectUrl=${OAUTH_REDIRECT_URI}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  return response.json();
};

export const signInUser = async ({
  code,
  id,
}: {
  code: string;
  id: string;
}): Promise<SignInUserResponse> => {
  const response = await fetchData(
    `/auth/${OAUTH_PROVIDER}/login?code=${code}&redirectUrl=${OAUTH_REDIRECT_URI}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginId: id,
      }),
    },
  );

  return response.json();
};

export const signOutUser = () => {
  const { refreshToken } = useUserStore.getState().getTokens();

  return fetchDataWithToken('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
};

export const updateAccessToken = async (
  refreshToken: string,
): Promise<UpdateAccessTokenResponse> => {
  const response = await fetch(BASE_URL + '/auth/token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};
