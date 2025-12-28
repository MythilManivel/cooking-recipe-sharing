import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback
} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

/* -------------------- Axios Instance -------------------- */
const api = axios.create({
  baseURL: '/api'
});

/* -------------------- Initial State -------------------- */
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null
};

/* -------------------- Action Types -------------------- */
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

/* -------------------- Reducer -------------------- */
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
};

/* -------------------- Context -------------------- */
const AuthContext = createContext();

/* -------------------- Provider -------------------- */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* -------------------- Logout -------------------- */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  }, []);

  /* -------------------- Interceptors -------------------- */
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && state.isAuthenticated) {
          logout();
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [state.token, state.isAuthenticated, logout]);

  /* -------------------- Load User -------------------- */
  const loadUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: data.user, token: state.token }
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token) loadUser();
    else dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
  }, [state.token, loadUser]);

  /* -------------------- Auth APIs -------------------- */
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data });
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data });
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false };
    }
  };

  const clearError = () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

  /* -------------------- Context Value -------------------- */
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------- Custom Hook -------------------- */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
