const setIntercept = (title, message, navigation) => ({
  action: 'SET_INTERCEPT', title, message, navigation,
});

const removeIntercept = () => ({
  action: 'REMOVE_INTERCEPT',
});

export { setIntercept, removeIntercept };
