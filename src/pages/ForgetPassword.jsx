import React, { useState } from 'react'
import resetPasswordImg from '../assests/reset.png';
import { useSelector } from 'react-redux';
import { FaLink } from "react-icons/fa6";
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';
import Spinner from '../assests/spinner/Spinner';

const ForgetPassword = () => {

    const { theme } = useSelector((state) => state.themeSliceApp);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const sendResetPasswordLink = async () => {
        try {
            setLoading(true);
            const response = await apiClient.post('/api/user/reset-password', { email: userEmail });

            if (response.status === 200) {
                toast.success(response.data?.message || 'Reset link sent to your email.');
                setUserEmail('');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    const inputChangeHandle = (e) => {
        const { value } = e.target;
        setUserEmail(value)
    }

    const formVlidate = (emailVal) => {
        const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

        if (!emailVal) {
            toast.error('Email field is empty!')
            return false;
        }

        if (!regEx.test(emailVal)) {
            toast.error('Please enter a valid email')
            return false
        } else {
            sendResetPasswordLink();
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        formVlidate(userEmail)
    }

    return (
        <>
            <div className="min-h-screen mt-10 md:mt-0 w-full flex flex-wrap flex-col md:flex-row  items-center md:justify-center gap-5">

                <div className="left">
                    <img src={resetPasswordImg} alt="" className='md:w-[500px]' />
                </div>

                <div className=" px-5 md:px-0  md:w-1/4  w-full">
                    <form className='flex flex-col gap-5' onSubmit={submitHandler}>
                        <div className="flex gap-5  justify-center">
                            <span>
                                <FaLink size={27} color='teal' />
                            </span>
                            <span>
                                <h1 className='mb-5 text-xl text-teal-600 text-center'>Send reset password link</h1>
                            </span>
                        </div>

                        <input type="email" placeholder='Email*' className={`py-2 px-3 rounded-md outline-none   ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} `} autoComplete='off' value={userEmail} onChange={inputChangeHandle} name='email' />

                        <button type="submit" disabled={loading} className='bg-teal-600 py-2 rounded-md active:bg-teal-700 transition-all disabled:opacity-50'>
                            {loading ? <div className="flex justify-center"><Spinner /></div> : 'Submit'}
                        </button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword
