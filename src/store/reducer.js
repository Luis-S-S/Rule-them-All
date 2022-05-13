/* eslint-disable default-param-last */
const initialState = {
  user: null,
  intercept: null,
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...payload },
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
    default:
      return state;
  }
}

export { initialState, reducer };
