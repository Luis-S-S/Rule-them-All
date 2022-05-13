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

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: { ...user },
});
