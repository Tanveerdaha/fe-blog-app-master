import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../utils/apiClient";
import Spinner from "../assests/spinner/Spinner";
import { NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import toast from "react-hot-toast";
import getImageUrl from '../utils/getImageUrl';
import ConfirmModal from './ConfirmModal';
import ListingTable from './ListingTable';

const AllUsers = () => {
    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);
    const [loader, setLoader] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [getAllUsers, setAllUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState("");
    const [startPage, setStartPage] = useState(2);
    const [isDeleting, setIsDeleting] = useState(false);

    const wrapperClass = `min-h-0 shadow-sm border my-2 rounded-md w-full md:mx-5 overflow-x-auto scrollbar mx-2 md:mx-0 ${
        theme === 'dark' ? 'border-zinc-700' : 'border-gray-200'
    }`;

    const headClass = `text-base ${theme === 'dark' ? 'text-gray-100 bg-gray-700' : 'text-gray-700 bg-gray-300'}`;
    const rowClass = `text-xs md:text-sm transition-all rounded-md ${
        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-slate-100'
    }`;

    const fetchUsers = async () => {
        try {
            setLoader(true);
            const userInfo = await apiClient.get('/api/user/getusers', {
                headers: {
                    Authorization: user.token,
                },
            });
            const response = userInfo.data.user;
            setAllUsers(response);
            setShowMoreButton(response.length > 8);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (user?.isAdmin) {
            fetchUsers();
        }
    }, [user?.isAdmin]);

    const deleteUserHandle = (id) => {
        setShowModal(true);
        setUserId(id);
    };

    const cancelHandle = () => {
        setShowModal(false);
    };

    const deleteUser = async () => {
        try {
            setIsDeleting(true);

            const userDelete = await apiClient.delete(`/api/user/deleteuser/${userId}`, {
                data: {
                    user: user
                },
                headers: {
                    Authorization: user.token
                }
            });

            if (userDelete.status === 200) {
                setAllUsers((users) => users.filter((item) => item._id !== userId));
                setShowModal(false);
                toast.success('User has been deleted successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    };

    const showMoreUserButton = async () => {
        const nextPage = startPage;

        try {
            const showMoreUser = await apiClient.get(`/api/user/getusers?page=${nextPage}`, {
                headers: {
                    Authorization: user.token
                }
            });

            if (showMoreUser.status === 200) {
                if (showMoreUser.data.user.length > 0) {
                    setStartPage((prevPage) => prevPage + 1);
                    setAllUsers((prev) => [...prev, ...showMoreUser.data.user]);
                } else {
                    setShowMoreButton(false);
                }
            }
        } catch (error) {
            toast.error('Failed to load more users');
        }
    };

    return (
        <>
            <div className={wrapperClass}>
                <ListingTable className="my-5">
                    <ListingTable.Head className={headClass}>
                        <ListingTable.HeadCell className="text-center font-semibold px-5 md:text-sm text-xs">
                            Updated on
                        </ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">
                            profilePicture
                        </ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">
                            Username
                        </ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">
                            Email
                        </ListingTable.HeadCell>
                        <ListingTable.HeadCell className="font-semibold md:text-sm text-xs">
                            Admin
                        </ListingTable.HeadCell>
                        <ListingTable.HeadCell className="font-semibold md:text-sm text-xs">
                            Delete
                        </ListingTable.HeadCell>
                    </ListingTable.Head>

                    {loader ? (
                        <ListingTable.Body>
                            <ListingTable.Row>
                                <ListingTable.Cell colSpan={6} className="text-center py-10">
                                    <Spinner />
                                </ListingTable.Cell>
                            </ListingTable.Row>
                        </ListingTable.Body>
                    ) : getAllUsers.length === 0 ? (
                        <ListingTable.Body>
                            <ListingTable.Row>
                                <ListingTable.Cell colSpan={6} className="text-center py-10 text-gray-500">
                                    No users found
                                </ListingTable.Cell>
                            </ListingTable.Row>
                        </ListingTable.Body>
                    ) : (
                        getAllUsers.map((listedUser) => (
                            <ListingTable.Body key={listedUser._id}>
                                <ListingTable.Row className={rowClass}>
                                    <ListingTable.Cell className="text-center text-xs md:text-sm">
                                        {new Date(listedUser.updatedAt).toLocaleDateString()}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className="flex justify-center">
                                        <NavLink to={`/user/${listedUser.username}`}>
                                            <img
                                                src={getImageUrl(listedUser.profilePicture)}
                                                alt={`${listedUser.username} profile`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </NavLink>
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className={`pl-5 border-l border-r text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300 border-gray-700' : ''}`}>
                                        <NavLink to={`/user/${listedUser.username}`} className="text-teal-500 hover:underline">
                                            {listedUser.username}
                                        </NavLink>
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className="pl-5">
                                        {listedUser.email}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className="text-xs md:text-sm pl-3">
                                        {listedUser.isAdmin ? (
                                            <TiTick color="green" size={25} />
                                        ) : (
                                            <RxCross2 size={23} color="red" />
                                        )}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:underline"
                                            onClick={() => deleteUserHandle(listedUser._id)}
                                        >
                                            Delete
                                        </button>
                                    </ListingTable.Cell>
                                </ListingTable.Row>
                            </ListingTable.Body>
                        ))
                    )}
                </ListingTable>

                {showMoreButton && (
                    <div className="text-center my-5 pb-4">
                        <button
                            type="button"
                            onClick={showMoreUserButton}
                            className={`transition-all active:scale-95 hover:bg-blue-900 py-2 font-semibold text-sm px-2 border-2 rounded-md ${
                                theme === 'dark'
                                    ? 'bg-gray-700 active:bg-gray-800 text-gray-200 border-gray-400'
                                    : 'active:bg-gray-600 active:text-white hover:text-white bg-gray-300 text-gray-800 border-gray-500'
                            }`}
                        >
                            Show more..
                        </button>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={showModal}
                onClose={cancelHandle}
                onConfirm={deleteUser}
                message="Are you sure you want to delete this user?"
                isLoading={isDeleting}
            />
        </>
    );
};

export default AllUsers;
