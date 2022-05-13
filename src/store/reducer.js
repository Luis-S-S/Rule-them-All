/* eslint-disable default-param-last */
const initialState = {
  intercept: null,
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_INTERCEPT':
      return {
        ...state,
        intercept: {
          title: payload.title,
          message: payload.message,
          navigation: payload.navigation,
        },
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
