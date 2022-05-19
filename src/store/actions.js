export const setIntercept = ({
  title, message, navigation, buttonMsg,
}) => ({
  type: 'SET_INTERCEPT',
  payload: {
    title, message, navigation, buttonMsg,
  },
});

export const removeIntercept = () => ({
  type: 'REMOVE_INTERCEPT',
});

export const setValidationIntercept = ({
  title, message, navigationOnCancel, executableFunction, parameters,
}) => ({
  type: 'SET_VALIDATION_INTERCEPT',
  payload: {
    title, message, navigationOnCancel, executableFunction, parameters,
  },
});

export const removeValidationIntercept = () => ({
  type: 'REMOVE_VALIDATION_INTERCEPT',
});

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: { ...user },
});

export const clearUser = () => ({
  type: 'CLEAR_USER',
});
