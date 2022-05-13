const setIntercept = ({ title, message, navigation }) => ({
  type: 'SET_INTERCEPT',
  payload: { title, message, navigation },
});

const removeIntercept = () => ({
  type: 'REMOVE_INTERCEPT',
});

export { setIntercept, removeIntercept };
