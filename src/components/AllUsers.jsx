import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../utils/apiClient";
import { Table } from "flowbite-react";
import Spinner from "../assests/spinner/Spinner";
import { NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import toast from "react-hot-toast";
import getImageUrl from '../utils/getImageUrl';
import ConfirmModal from './ConfirmModal';

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

    //   Delete user Api :
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
            })
            if (userDelete.status === 200) {
                setAllUsers((users) => users.filter(users => users._id !== userId));
                setShowModal(false);
                toast.success('User has been deleted successfully');
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        } finally {
            setIsDeleting(false);
        }

    }


    const showMoreUserButton = async () => {
        const nextPage = startPage;

        try {
            const showMoreUser = await apiClient.get(`/api/user/getusers?page=${nextPage}`, {
                headers: {
                    Authorization: user.token
                }
            })
            if (showMoreUser.status === 200) {
                if (showMoreUser.data.user.length > 0) {
                    setStartPage((prevPage) => prevPage + 1)
                    setAllUsers((prev) => [...prev, ...showMoreUser.data.user]);
                } else {
                    setShowMoreButton(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };




    return (
        <>

            <div className={`min-h-screen shadow-sm border my-2 rounded-md w-full md:mx-5 table-auto overflow-x-scroll scrollbar  ${theme === 'dark' ? 'border-zinc-700' : 'border-gray-200'} mx-2 md:mx-0`}>
                {
                    getAllUsers.length > 0 &&
                    <Table hoverable className="my-5">
                        <Table.Head
                            className={` text-base   ${theme === "dark" ? "text-gray-100 bg-gray-700" : "text-gray-700 bg-gray-300"
                                } `}
                        >
                            <Table.HeadCell
                                className={`text-center font-semibold px-5 md:text-sm text-xs  ${theme === "dark" && "border-gray-500"
                                    } `}
                            >
                                Updated on
                            </Table.HeadCell>

                            <Table.HeadCell
                                className={` text-center font-semibold md:text-sm text-xs  ${theme === "dark" && "border-gray-500"
                                    } `}
                            >
                                profilePicture
                            </Table.HeadCell>

                            <Table.HeadCell
                                className={` text-center font-semibold md:text-sm text-xs  ${theme === "dark" && "border-gray-500"
                                    } `}
                            >
                                Username
                            </Table.HeadCell>

                            <Table.HeadCell
                                className={`text-center font-semibold md:text-sm text-xs  ${theme === "dark" && "border-gray-500"
                                    } `}
                            >
                                <span>Email</span>
                            </Table.HeadCell>

                            <Table.HeadCell
                                className={`pr-2  md:pr-0 font-semibold md:text-sm text-xs ${theme === "dark" && "border-gray-500"
                                    } `}
                            >
                                Admin
                            </Table.HeadCell>

                            <Table.HeadCell
                                className={`pl-2 md:pl-0 font-semibold md:text-sm text-xs  ${theme === "dark" && "border-gray-500"
                                    } `}
                            >
                                Delete
                            </Table.HeadCell>
                        </Table.Head>
                        {loader ? (
                            <Spinner />
                        ) : (
                            <>
                                {getAllUsers.map((listedUser) => {
                                    return (
                                        <Table.Body key={listedUser._id} className="">
                                            <Table.Row
                                                key={listedUser._id}
                                                className={` text-xs md:text-sm  transition-all rounded-md  ${theme === "dark"
                                                    ? "hover:bg-gray-800"
                                                    : "hover:bg-slate-100"
                                                    }`}
                                            >
                                                <Table.Cell className="text-center text-xs md:text-sm">
                                                    {new Date(listedUser.updatedAt).toLocaleDateString()}
                                                </Table.Cell>

                                                <Table.Cell className="  flex justify-center ">
                                                    <NavLink className="text-center" to={`/user/${listedUser.username}`}>
                                                        <img
                                                            src={getImageUrl(listedUser.profilePicture)}
                                                            alt={`${listedUser.username} profile`}
                                                            className="w-10 text-center rounded-full h-10 md:rounded-full "
                                                        />
                                                    </NavLink>
                                                </Table.Cell>

                                                <Table.Cell
                                                    className={`pl-5 border-l border-r text-xs text-jusc md:text-sm ${theme === "dark" && "text-gray-300 border-gray-700"
                                                        }`}
                                                >
                                                    <NavLink to={`/user/${listedUser.username}`} className="text-teal-500 hover:underline">
                                                        {listedUser.username}
                                                    </NavLink>
                                                </Table.Cell>

                                                <Table.Cell className="pl-5">
                                                    <span className="">{listedUser.email}</span>
                                                </Table.Cell>

                                                <Table.Cell className="text-xs md:text-sm text-justify pl-3">
                                                    {listedUser.isAdmin ? (
                                                        <TiTick color="green" size={25} />
                                                    ) : (
                                                        <RxCross2 size={23} color="red" />
                                                    )}
                                                </Table.Cell>

                                                <Table.Cell>
                                                    <button
                                                        className="text-red-500 hover:underline"
                                                        onClick={() => {
                                                            deleteUserHandle(listedUser._id);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    );
                                })}
                            </>
                        )}
                    </Table>
                }

                {showMoreButton && (
                    <div className="text-center my-5">
                        <button
                            onClick={showMoreUserButton}
                            className={`transition-all active:scale-95 hover:bg-blue-900 py-2 font-semibold text-sm px-2 border-2 rounded-md  ${theme === "dark"
                                ? "bg-gray-700 active:bg-gray-800 text-gray-200 border-gray-400"
                                : "active:bg-gray-600 active:text-white hover:text-white bg-gray-300 text-gray-800 border-gray-500"
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
