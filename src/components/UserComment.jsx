import React, { useState } from 'react'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AiFillLike } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { BiReply } from "react-icons/bi";
import Spinner from '../assests/spinner/Spinner';
import toast from 'react-hot-toast';
import getImageUrl from '../utils/getImageUrl';
import AuthorLink from './AuthorLink';
import apiClient from '../utils/apiClient';

const UserComment = ({ comments, likeTheComment, updateComment, deleteComment, onReply, blogOwnerId, depth = 0 }) => {

    const { theme } = useSelector((state) => state.themeSliceApp);
    const currentUser = useSelector((state) => state.userSliceApp.user);
    const [editorOpen, setEditorOpen] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [textAreaVal, setTextAreaVal] = useState(comments.comment || '');
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);

    const isCommentOwner = currentUser && currentUser._id === comments.userId;
    const isBlogOwner = currentUser && blogOwnerId && currentUser._id === blogOwnerId;
    const isAdmin = currentUser?.isAdmin;
    const canModerate = isCommentOwner || isBlogOwner || isAdmin;
    const canEdit = isCommentOwner || isAdmin;

    const commentSaveHandle = async () => {
        try {
            setLoading(true);
            const response = await apiClient.put(`/api/comment/edit-comment/${comments._id}`, {
                comment: textAreaVal,
                currentUser
            }, {
                headers: { Authorization: currentUser.token }
            });

            if (response.status === 200) {
                updateComment(comments._id, response.data.comment);
                setEditorOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update comment');
        } finally {
            setLoading(false);
        }
    };

    const submitReply = async () => {
        try {
            setLoading(true);
            await onReply(comments._id, replyText);
            setReplyText('');
            setReplyOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginLeft: depth > 0 ? `${depth * 20}px` : 0 }}>
            <div className={`flex border-b flex-col gap-1 px-2 my-4 py-2 ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'}`}>
                <div className='flex gap-2 items-center'>
                    <AuthorLink
                        username={comments.username}
                        profilePicture={comments.profilePicture}
                        className="text-sm"
                    />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {moment(comments.createdAt).fromNow()}
                    </span>
                </div>

                {editorOpen && canEdit ? (
                    <div className="ml-2">
                        <textarea
                            className={`transition-all border rounded-md px-2 outline-none py-1 w-full max-w-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-400' : 'bg-gray-200 border-gray-300'}`}
                            maxLength={100}
                            value={textAreaVal}
                            onChange={(e) => setTextAreaVal(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            <button className="text-xs bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setEditorOpen(false)}>Cancel</button>
                            <button disabled={loading} className="text-xs bg-green-600 text-white px-3 py-1 rounded" onClick={commentSaveHandle}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={`text-sm ml-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>- {comments.comment}</p>

                        <div className="flex items-center gap-5 ml-4 mt-2">
                            <button type='button' className={`flex items-center gap-1 ${comments.likes?.includes(currentUser?._id) && 'text-blue-500'}`}>
                                <AiFillLike size={18} onClick={() => likeTheComment(comments._id)} />
                                {comments.numberOfLikes > 0 && (
                                    <span className="text-xs">{comments.numberOfLikes}</span>
                                )}
                            </button>

                            {currentUser && (
                                <button type="button" onClick={() => setReplyOpen(!replyOpen)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-500">
                                    <BiReply size={18} /> Reply
                                </button>
                            )}

                            {canEdit && (
                                <button type='button' onClick={() => setEditorOpen(true)}>
                                    <RiEdit2Fill className='hover:text-green-400' size={18} />
                                </button>
                            )}

                            {canModerate && (
                                <button type='button' onClick={() => deleteComment(comments._id)}>
                                    <MdDeleteForever className='hover:text-red-400' size={18} />
                                </button>
                            )}
                        </div>
                    </>
                )}

                {replyOpen && currentUser && (
                    <div className="ml-4 mt-2 flex flex-col gap-2 max-w-sm">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            maxLength={50}
                            className={`rounded-md px-2 py-1 text-sm border outline-none ${theme === 'dark' ? 'bg-gray-700 border-gray-500' : 'bg-gray-100 border-gray-300'}`}
                        />
                        <div className="flex gap-2">
                            <button className="text-xs px-3 py-1 border rounded" onClick={() => setReplyOpen(false)}>Cancel</button>
                            <button disabled={loading} className="text-xs px-3 py-1 bg-teal-600 text-white rounded" onClick={submitReply}>
                                {loading ? <Spinner /> : 'Post Reply'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {comments.replies?.map((reply) => (
                <UserComment
                    key={reply._id}
                    comments={reply}
                    likeTheComment={likeTheComment}
                    updateComment={updateComment}
                    deleteComment={deleteComment}
                    onReply={onReply}
                    blogOwnerId={blogOwnerId}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
};

export default UserComment;
