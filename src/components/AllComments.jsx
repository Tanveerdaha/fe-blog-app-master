import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../utils/apiClient";
import Spinner from "../assests/spinner/Spinner";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from './ConfirmModal';
import ListingTable from './ListingTable';

const AllComments = () => {
    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);
    const [loader, setLoader] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [getAllComments, setAllComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("");
    const [startPage, setStartPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);

    const wrapperClass = `min-h-0 shadow-sm border my-2 rounded-md w-full md:mx-5 overflow-x-auto scrollbar mx-2 md:mx-0 ${
        theme === 'dark' ? 'border-zinc-700' : 'border-gray-200'
    }`;

    const headClass = `text-base ${theme === 'dark' ? 'text-gray-100 bg-gray-700' : 'text-gray-700 bg-gray-300'}`;
    const rowClass = `text-xs md:text-sm transition-all rounded-md ${
        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-slate-100'
    }`;

    useEffect(() => {
        if (user?.isAdmin) {
            const getComments = async () => {
                try {
                    setLoader(true);
                    const commentInfo = await apiClient.get('/api/comment/get-all-comments', {
                        headers: {
                            Authorization: user.token,
                        },
                    });
                    const response = commentInfo.data.comments;
                    setAllComments(response);
                    setShowMoreButton(response.length > 4);
                } catch (error) {
                    toast.error('Failed to load comments');
                } finally {
                    setLoader(false);
                }
            };
            getComments();
        }
    }, [user?.isAdmin]);

    const deleteUserHandle = (id) => {
        setShowModal(true);
        setCommentIdToDelete(id);
    };

    const cancelHandle = () => {
        setShowModal(false);
    };


    // Show more comments 
    const showMoreCommentButton = async () => {
        try {
            const response = await apiClient.get(`/api/comment/get-all-comments?page=${startPage + 1}`, {
                headers: {
                    Authorization: user.token
                },
               
            });

            if (response.status === 200) {
                const newComment = response.data.comments;
                setStartPage(startPage + 1)
                console.log(newComment);
                setAllComments([...getAllComments, ...newComment])


                if (response.data.comments.length === 0) {
                    setShowMoreButton(false);
                    toast.success('All blogs have been fetched');
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };






    const yesToDeleteComment = async () => {
        try {
            setIsDeleting(true);
            const response = await apiClient.delete(`/api/comment/delete-comment/${commentIdToDelete}`, {

                data: {
                    user: user
                },
                headers: {
                    Authorization: user.token
                }
            })
            if (response.status === 200) {
                console.log(response.data);
                setAllComments(getAllComments.filter(commentValue => commentValue._id !== commentIdToDelete));
                toast.success('Comment has been deleted');
                setShowModal(false);
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div className={wrapperClass}>
                <ListingTable className="my-5">
                    <ListingTable.Head className={headClass}>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">Updated on</ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">Comments</ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">No.of likes</ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">Post Title</ListingTable.HeadCell>
                        <ListingTable.HeadCell className="text-center font-semibold md:text-sm text-xs">Username</ListingTable.HeadCell>
                        <ListingTable.HeadCell className="font-semibold md:text-sm text-xs">Delete</ListingTable.HeadCell>
                    </ListingTable.Head>

                    {loader ? (
                        <ListingTable.Body>
                            <ListingTable.Row>
                                <ListingTable.Cell colSpan={6} className="text-center py-10">
                                    <Spinner />
                                </ListingTable.Cell>
                            </ListingTable.Row>
                        </ListingTable.Body>
                    ) : getAllComments.length === 0 ? (
                        <ListingTable.Body>
                            <ListingTable.Row>
                                <ListingTable.Cell colSpan={6} className="text-center py-10 text-gray-500">
                                    No comments found
                                </ListingTable.Cell>
                            </ListingTable.Row>
                        </ListingTable.Body>
                    ) : (
                        getAllComments.map((comment) => (
                            <ListingTable.Body key={comment._id}>
                                <ListingTable.Row className={rowClass}>
                                    <ListingTable.Cell className="text-center px-2 md:px-0 text-xs md:text-sm">
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className="flex px-2 w-52 md:px-0 justify-center">
                                        <NavLink to={comment.blogSlug ? `/blog/${comment.blogSlug}` : '/'}>
                                            {comment.comment}
                                        </NavLink>
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className={`px-3 md:px-0 border-l border-r text-center text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300 border-gray-700' : ''}`}>
                                        {comment.likes?.length ?? 0}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className="text-center md:px-0 px-5">
                                        {comment.blogTitle}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell className="text-xs px-5 md:px-0 md:text-sm text-center">
                                        {comment.username}
                                    </ListingTable.Cell>

                                    <ListingTable.Cell>
                                        <button
                                            type="button"
                                            className="text-red-500 px-3 md:px-0 hover:underline"
                                            onClick={() => deleteUserHandle(comment._id)}
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
                            onClick={showMoreCommentButton}
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
                onConfirm={yesToDeleteComment}
                message="Are you sure you want to delete this comment?"
                isLoading={isDeleting}
            />
        </>
    );
};

export default AllComments;
