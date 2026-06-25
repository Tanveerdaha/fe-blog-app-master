
import { useRef, useState } from 'react';
import updateUserImg from '../assests/updateUserImg.png';
import { LiaUserEditSolid } from "react-icons/lia";
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {
    userUpdateStart,
    userUpdateSuccess,
    userUpdateFailure,
    signOutSuccess,
    signOutUserFailure
} from '../features/userSlice';
import Modal from './Modal.jsx';
import { NavLink } from 'react-router-dom';

const DashboardProfile = () => {

    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);

    const dispatch = useDispatch();

    const filePickerRef = useRef();

    const [tempFileUrl, setTempFileUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);

    const inputFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setTempFileUrl(URL.createObjectURL(file));
        }
    };

    const inputInfoChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submitHandle = async (e) => {
        e.preventDefault();

        try {
            dispatch(userUpdateStart());

            const form = new FormData();

            if (imageFile) {
                form.append('profilePicture', imageFile);
            }

            if (formData.username) {
                form.append('username', formData.username);
            }

            if (formData.email) {
                form.append('email', formData.email);
            }

            if (formData.password) {
                form.append('password', formData.password);
            }

            const updateUser = await axios.put(
                `/api/user/updateuser/${user._id}`,
                form,
                {
                    headers: {
                        Authorization: user.token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

           if (updateUser.status === 200) {
               console.log(updateUser.data.user);
               dispatch(userUpdateSuccess(updateUser.data.user));
            }

        } catch (error) {
            dispatch(
                userUpdateFailure(
                    error.response?.data?.message || 'Update failed'
                )
            );

            toast.error(
                error.response?.data?.message || 'Update failed'
            );

            console.log(error);
        }
    };

    const deleteHandle = () => {
        setShowModal(true);
    };

    const signOutHandle = async () => {
        try {
            const signOutUser = await axios.post('/api/user/signoutuser');

            if (signOutUser.data.success === true) {
                dispatch(signOutSuccess());
            }

        } catch (error) {
            dispatch(signOutUserFailure(error.message));
            toast.error(error.message);
        }
    };

    const profileImage =
    tempFileUrl ||
    (
        user?.profilePicture?.startsWith('http')
            ? user.profilePicture
            : `http://localhost:5000${user.profilePicture}`
    );

console.log("Final Image URL:", profileImage);

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-center min-h-screen items-center md:gap-10 w-full md:pt-0">

                {/* Left Side */}
                <div className="md:w-2/5 w-80 md:pt-20 flex items-center">
                    <img
                        src={updateUserImg}
                        alt="Update User"
                        className="w-full"
                    />
                </div>

                {/* Right Side */}
                <div>
                    <div className="flex justify-center items-center gap-4">
                        <span className="border-2 border-violet-500 rounded-full py-1 px-1">
                            <LiaUserEditSolid
                                size={25}
                                className="text-violet-400"
                            />
                        </span>

                        <h1 className="text-2xl text-violet-400">
                            Update User
                        </h1>
                    </div>

                    <form
                        className="flex flex-col items-center"
                        onSubmit={submitHandle}
                    >
                        <input
                            type="file"
                            ref={filePickerRef}
                            className="hidden"
                            accept="image/*"
                            onChange={inputFileChange}
                        />

                        <div
                            className="w-20 h-20 rounded-full overflow-hidden cursor-pointer my-5 border border-violet-500"
                            onClick={() => filePickerRef.current.click()}
                        >
                            <img
                                src={profileImage}
                                alt="userImg"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-4">

                            <input
                                type="text"
                                placeholder="Update username"
                                name="username"
                                defaultValue={user.username}
                                onChange={inputInfoChange}
                                className={`md:w-96 w-80 rounded-md py-2 px-3 outline-none border border-violet-500 text-black
                                ${theme === 'dark'
                                        ? 'bg-gray-700 text-gray-100'
                                        : ''
                                    }`}
                            />

                            <input
                                type="email"
                                placeholder="Update email"
                                name="email"
                                defaultValue={user.email}
                                onChange={inputInfoChange}
                                className={`md:w-96 w-80 rounded-md py-2 px-3 outline-none border border-violet-500 text-black
                                ${theme === 'dark'
                                        ? 'bg-gray-700 text-gray-100'
                                        : ''
                                    }`}
                            />

                            <input
                                type="password"
                                placeholder="Update password"
                                name="password"
                                onChange={inputInfoChange}
                                className={`md:w-96 w-80 rounded-md py-2 px-3 outline-none border border-violet-500 text-black
                                ${theme === 'dark'
                                        ? 'bg-gray-700 text-gray-100'
                                        : ''
                                    }`}
                            />

                        </div>

                        <div>

                            <button
                                type="submit"
                                className="py-2 md:w-96 w-80 border border-violet-400 font-semibold my-4 rounded-md active:scale-95 transition-all hover:bg-violet-500"
                            >
                                Update
                            </button>

                            <div className="text-red-500 text-sm w-full flex justify-between">
                                <span
                                    className="cursor-pointer font-semibold"
                                    onClick={deleteHandle}
                                >
                                    Delete User
                                </span>

                                <span
                                    className="cursor-pointer font-semibold"
                                    onClick={signOutHandle}
                                >
                                    Sign out
                                </span>
                            </div>

                            {
                                user &&
                                user.isAdmin &&
                                (
                                    <button
                                        type="button"
                                        className="md:w-96 w-80 py-2 my-4 rounded-md active:scale-95 transition-all border border-green-500 hover:bg-green-600 hover:text-white"
                                    >
                                        <NavLink
                                            to="/create-blog"
                                            className="font-semibold"
                                        >
                                            Create Blog
                                        </NavLink>
                                    </button>
                                )
                            }

                        </div>

                    </form>
                </div>

                {
                    showModal &&
                    (
                        <Modal
                            setShowModal={setShowModal}
                            user={user}
                        />
                    )
                }

                <Toaster />
            </div>
        </>
    );
};

export default DashboardProfile;

