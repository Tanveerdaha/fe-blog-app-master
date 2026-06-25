import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase/firebaseConfig';
import apiClient from '../utils/apiClient';
import { loginStart, loginSuccess, loginFailure } from '../features/userSlice'
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OAuth = () => {


    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const googleFirebaseAuthBtn = async () => {

        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });

        try {
            const googleSignIn = await signInWithPopup(auth, googleProvider);
            const { user } = googleSignIn;

            const userData = {
                username: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            }

            dispatch(loginStart());
            const addGoogleUser = await apiClient.post('/api/user/googleuser', userData);
            if (addGoogleUser.data.user) {
                dispatch(loginSuccess(addGoogleUser.data.user));
                navigate('/');
            }

        } catch (error) {
            dispatch(loginFailure(error));
            console.log(error);
            const errMsg = error.response?.data?.message || error.message || 'Google authentication failed!';
            toast.error(errMsg);
        }

    }




    return (
        <>
            <div className="">
                <button type="button" className=" border border-orange-500 flex items-center justify-center gap-2 active:scale-x-95 rounded-md w-full py-2 transition-all" onClick={googleFirebaseAuthBtn}>
                    <FcGoogle size={20} />
                    <span>Continue with google</span>
                </button>
            </div>
        </>
    )
}
export default OAuth;