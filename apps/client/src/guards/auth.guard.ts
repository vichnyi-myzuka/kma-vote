import { setUser } from '@app/client/storage';
import { getMe } from '@app/client/api';

export async function updateAuth(
  successCallback: () => void,
  failureCallback: () => void,
) {
  const user = await getMe();
  console.log('user', user);
  setUser(user);
  if (!user) {
    failureCallback();
  } else {
    successCallback();
  }
}
