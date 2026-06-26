import apiClient from '../utils/apiClient';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ConfirmModal from './ConfirmModal';

const BlogPopupModal = ({ setBlogModal, blogId, setUserBlogs, message = 'Are you sure you want to delete your blog?' }) => {
    const { user } = useSelector((state) => state.userSliceApp);
    const [isDeleting, setIsDeleting] = useState(false);

    const closeModal = () => {
        if (!isDeleting) {
            setBlogModal(false);
        }
    };

    const deleteBlog = async () => {
        try {
            setIsDeleting(true);
            const deleteBlogInfo = await apiClient.delete(`/api/blog/delete-blog/${blogId}/${user._id}`, {
                data: {
                    user: user
                },
                headers: {
                    Authorization: user.token
                }
            });

            if (deleteBlogInfo.status === 200) {
                toast.success('Blog has been deleted successfully');
                setBlogModal(false);
                setUserBlogs((blogs) => blogs.filter((blog) => blog._id !== blogId));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete blog');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ConfirmModal
            open
            onClose={closeModal}
            onConfirm={deleteBlog}
            message={message}
            isLoading={isDeleting}
        />
    );
};

export default BlogPopupModal;
