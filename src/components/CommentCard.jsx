import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineComment } from "react-icons/ai";
import feedbackImg from '../assests/typingImg.png'
import toast from 'react-hot-toast';
import apiClient from '../utils/apiClient';
import UserComment from './UserComment';
import getImageUrl from '../utils/getImageUrl';
import Spinner from '../assests/spinner/Spinner';
import { buildCommentTree } from '../utils/commentTree';
import ConfirmModal from './ConfirmModal';

const CommentCard = ({ blogId, blogOwnerId }) => {

    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);
    const navigate = useNavigate();

    const [commentData, setCommentData] = useState('');
    const [comments, setComments] = useState([]);
    const [commentTree, setCommentTree] = useState([]);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [propsCommentId, setPropsCommentId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadComments = async () => {
        try {
            const comment = await apiClient.get(`/api/comment/get-comment/${blogId}`);

            if (comment.status === 200) {
                const list = comment.data || [];
                setComments(list);
                setCommentTree(buildCommentTree(list));
            }
        } catch (error) {
            setComments([]);
            setCommentTree([]);
        }
    };

    useEffect(() => {
        loadComments();
    }, [blogId]);

    const postUserComment = async (text, parentId = null) => {
        if (!user) {
            toast.error('You must login to post comment!');
            return;
        }

        try {
            setLoading(true);
            const addComment = await apiClient.post('/api/comment/add-comment/',
                {
                    comment: text,
                    blogId,
                    userId: user._id,
                    parentId
                },
                {
                    headers: { Authorization: user.token }
                });

            if (addComment.status === 200) {
                toast.success(parentId ? 'Reply added' : 'Comment has been added');
                setCommentData('');
                await loadComments();
            }
        } catch (error) {
            toast.error('An error occurred while adding comment!');
        } finally {
            setLoading(false);
        }
    };

    const commentSubmitHandle = (e) => {
        e.preventDefault();
        if (!commentData || commentData.length < 4) {
            toast.error('At least four characters required!');
            return;
        }
        postUserComment(commentData);
    };

    const likeTheComment = async (commentId) => {
        try {
            if (!user) {
                navigate('/login');
                return;
            }

            const doLike = await apiClient.put(`/api/comment/like-the-comment/${commentId}`, { user: user._id }, {
                headers: { Authorization: user.token },
            });

            if (doLike.status === 200) {
                setComments((prev) => prev.map((item) => (
                    item._id === commentId
                        ? { ...item, likes: doLike.data.likes, numberOfLikes: doLike.data.numberOfLikes }
                        : item
                )));
                setCommentTree(buildCommentTree(
                    comments.map((item) => (
                        item._id === commentId
                            ? { ...item, likes: doLike.data.likes, numberOfLikes: doLike.data.numberOfLikes }
                            : item
                    ))
                ));
            }
        } catch (error) {
            toast.error('Failed to like comment.');
        }
    };

    const updateComment = (commentId, updatedCommentInfo) => {
        const updated = comments.map((item) => (
            item._id === commentId ? { ...item, comment: updatedCommentInfo } : item
        ));
        setComments(updated);
        setCommentTree(buildCommentTree(updated));
    };

    const deleteComment = (commentId) => {
        setPropsCommentId(commentId);
        setModal(true);
    };

    const okToDeleteComment = async () => {
        try {
            setIsDeleting(true);
            const deleteResponse = await apiClient.delete(`/api/comment/delete-comment/${propsCommentId}`, {
                headers: { Authorization: user.token },
                data: { user }
            });

            if (deleteResponse.status === 200) {
                setModal(false);
                toast.success(deleteResponse.data.message);
                await loadComments();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReply = async (parentId, replyText) => {
        if (!replyText || replyText.length < 4) {
            toast.error('Reply must be at least 4 characters');
            return;
        }
        await postUserComment(replyText, parentId);
    };

    return (
        <div className='md:mt-10 mt-5 w-full'>
            {user ? (
                <div className="">
                    <p className='flex items-center lg:text-base sm:text-xs md:text-sm gap-3 justify-center '>
                        Sign in as:
                        <Link to={'/dashboard?tab=profile'} className='flex font-semibold text-sm text-teal-500 hover:underline cursor-pointer items-center'>
                            <img src={getImageUrl(user.profilePicture)} className='w-7 h-7 rounded-full' alt="" /> @{user.username}
                        </Link>
                    </p>
                </div>
            ) : (
                <div className="">
                    <span className='flex gap-2 text-xs md:text-sm text-teal-500 font-semibold'>
                        Login to access more features and engage with users of this blog.
                        <Link className='text-blue-400 hover:underline' to={'/login'}>Login</Link>
                    </span>
                </div>
            )}

            {user && (
                <div className="w-full md:flex-row flex flex-col justify-center md:gap-10 items-center mt-4">
                    <div className="flex justify-center items-center">
                        <img src={feedbackImg} alt="" className='w-72 md:96' />
                    </div>

                    <div className={`py-2 px-5 rounded-md ${theme === 'dark' ? 'border border-gray-600' : 'border border-gray-300'}`}>
                        <div className="flex gap-2 py-2 items-center">
                            <h1 className={`text-sm font-semibold ${commentData.length === 50 && 'text-red-500'}`}>Share your feedback</h1>
                            <AiOutlineComment size={30} />
                        </div>

                        <form className={`py-2 flex shadow-md flex-col w-full px-1 md:px-5 rounded-md ${theme === 'dark' ? 'border border-gray-600' : 'border border-gray-300'}`} onSubmit={commentSubmitHandle}>
                            <textarea
                                value={commentData}
                                onChange={(e) => setCommentData(e.target.value)}
                                placeholder='Type here...'
                                className={`transition-all outline-none w-80 rounded-md py-3 px-2 ${theme === 'dark' ? 'bg-zinc-600 focus:bg-zinc-700' : 'bg-zinc-200 focus:bg-zinc-300'}`}
                                maxLength={50}
                            />
                            <span className={`text-xs font-semibold ${commentData.length === 50 ? 'text-red-500' : 'text-green-500'}`}>
                                {50 - commentData.length} characters left
                            </span>
                            <button disabled={loading} type='submit' className={`active:scale-90 transition-all py-1 my-3 bg-gradient-to-r from-yellow-400 to-green-700 w-full font-semibold ${loading && 'opacity-50 cursor-not-allowed'}`}>
                                {loading ? <div className="flex justify-center"><Spinner /></div> : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <div className="flex gap-3 items-center my-3">
                    <p className='text-sm'>Comments</p>
                    <span className='border flex items-center justify-center px-2 text-sm rounded-md'>{comments.length}</span>
                </div>
                <hr className={`rounded-full ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
            </div>

            {commentTree.length === 0 ? (
                <p className='text-sm text-teal-500 mt-4'>No comments on this blog yet</p>
            ) : (
                commentTree.map((value) => (
                    <UserComment
                        key={value._id}
                        comments={value}
                        likeTheComment={likeTheComment}
                        updateComment={updateComment}
                        deleteComment={deleteComment}
                        onReply={handleReply}
                        blogOwnerId={blogOwnerId}
                        depth={0}
                    />
                ))
            )}

            <ConfirmModal
                open={modal}
                onClose={() => !isDeleting && setModal(false)}
                onConfirm={okToDeleteComment}
                message="Are you sure you want to delete this comment?"
                confirmLabel="Yes, delete"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default CommentCard;
