/* eslint-disable default-param-last */
const initialState = {
  intercept: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_INTERCEPT':
      return {
        ...state,
        intercept: {
          title: action.title,
          message: action.message,
          navigation: action.navigation,
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
