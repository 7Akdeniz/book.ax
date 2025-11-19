import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  registerStart,
  registerSuccess,
  registerFailure,
} from '../authSlice';
import {authService} from '../authService';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const {user, isAuthenticated, isLoading, error} = useAppSelector(state => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const response = await authService.login({email, password});
      dispatch(loginSuccess(response));
      return {success: true};
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login fehlgeschlagen';
      dispatch(loginFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      dispatch(registerStart());
      const response = await authService.register({email, password, firstName, lastName});
      dispatch(registerSuccess(response));
      return {success: true};
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registrierung fehlgeschlagen';
      dispatch(registerFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch(logoutAction());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
