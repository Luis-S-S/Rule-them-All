/* eslint-disable default-param-last */
const initialState = {
  user: null,
  authValidation: true,
  intercept: null,
  validationIntercept: null,
  isLoading: true,
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...payload },
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
      };
    case 'SET_INTERCEPT':
      return {
        ...state,
        intercept: { ...payload },
      };
    case 'REMOVE_INTERCEPT':
      return {
        ...state,
        intercept: null,
      };
    case 'SET_VALIDATION_INTERCEPT':
      return {
        ...state,
        validationIntercept: { ...payload },
      };
    case 'REMOVE_VALIDATION_INTERCEPT':
      return {
        ...state,
        validationIntercept: null,
      };
    case 'SET_LOADING_TRUE':
      return {
        ...state,
        isLoading: true,
      };
    case 'SET_LOADING_FALSE':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

export { initialState, reducer };
