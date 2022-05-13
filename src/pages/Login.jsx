// import { useState, useContext, useEffect } from 'react';
// import { getRedirectResult, signInWithEmailAndPassword } from 'firebase/auth';

// import { Context } from '../store';
// import { setIntercept } from '../store/actions';

// import { auth } from '../config/firebase';
// import { createDocWithId, isSignupComplete, getDocById } from '../services/firestore';
// import { googleLoginWithRedirect } from '../services/authentication';

// import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';

// export default function Login() {
//   const [form, setForm] = useState({});
//   const { dispatch } = useContext(Context);

//   const handlerOnChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handlerEmailLogin = async (e) => {
//     e.preventDefault();
//     const user = await signInWithEmailAndPassword(auth, form.email, form.password);
//   };

//   useEffect(() => {
//     async function googleLoginResult() {
//       const result = await getRedirectResult(auth);
//       if (result) {
//         try {
//           const docExists = await getDocById('users', result?.user.uid);
//           if (!docExists) {
//             await createDocWithId({ email: result?.user.email }, 'users', result?.user.uid);
//           }
//           const isComplete = await isSignupComplete(result?.user.uid);
//           dispatch(setIntercept({
//             title: 'Success',
//                    message: 'Signup successful', navigation: isComplete ? '/' : '/signup_detail',
//           }));
//         } catch (error) {
//           dispatch(setIntercept({
//             title: 'Error', message: 'Signup with Google failed', navigation: '/signup',
//           }));
//         }
//       }

//       return result?.user;
//     }

//     googleLoginResult();
//   }, []);

//   return (
//     <div className="login-container">
//       <form className="login-form">
//         <div className="form__control">
//           <label htmlFor="email">
//             Email
//             <input type="email" id="email" onChange={handlerOnChange} />
//           </label>
//         </div>
//         <div className="form__control">
//           <label htmlFor="password">
//             Password
//             <input id="password" type="password" onChange={handlerOnChange} />
//           </label>
//         </div>
//       </form>
//     </div>
//   );
// }
