
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import apiClient from '../utils/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    updateBlogStart,
    updateBlogFailure,
    updateBlogSuccess
} from '../features/blogSlice';
import { BLOG_CATEGORIES } from '../utils/blogCategories';
import getImageUrl from '../utils/getImageUrl';
import BlogLoader from '../assests/blogSpinner/BlogLoader';

const UpdateBlog = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogId } = useParams();

    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);

    const [blogImage, setBlogImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const blogImgChangeHandle = (e) => {
        const file = e.target.files[0];

        if (file) {
            setBlogImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const inputChangeHandle = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const reactQuillChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            blogBody: value
        }));
    };

    const fetchBlog = async () => {
        try {
            setLoading(true);
            setNotFound(false);

            const getBlog = await apiClient.get(
                `/api/blog/get-all-blogs?blogId=${blogId}`
            );

            if (getBlog.status === 200) {
                const response = getBlog.data.blogs[0];

                if (response) {
                    const isOwner = response.userId?.toString() === user._id?.toString();
                    const isAdmin = user?.isAdmin;

                    if (!isOwner && !isAdmin) {
                        toast.error('You can only edit your own blogs');
                        navigate('/dashboard?tab=my-blogs');
                        return;
                    }

                    setFormData(response);
                } else {
                    setNotFound(true);
                }
            }

        } catch (error) {
            setNotFound(true);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [blogId]);

    const updateBlogPost = async (e) => {

        e.preventDefault();

        if (!formData.blogTitle) {
            toast.error('Blog title is required!');
            return;
        }

        if (!formData.blogBody) {
            toast.error('Post body cannot be empty!');
            return;
        }

        if (formData.blogBody.length < 20) {
            toast.error('Post body must be at least 20 characters!');
            return;
        }

        try {

            dispatch(updateBlogStart());
            setSubmitting(true);

            const blogForm = new FormData();

            blogForm.append('blogTitle', formData.blogTitle);
            blogForm.append('blogCategory', formData.blogCategory);
            blogForm.append('blogBody', formData.blogBody);

            if (blogImage) {
                blogForm.append('blogImgFile', blogImage);
            }

            const updateBlog = await apiClient.put(
                `/api/blog/update-blog/${blogId}/${user._id}`,
                blogForm,
                {
                    headers: {
                        Authorization: user.token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (updateBlog.status === 200) {

                const response = updateBlog.data.blog;

                dispatch(updateBlogSuccess(response));

                toast.success('Blog updated successfully');

                navigate(`/blog/${response.slug}`);
            }

        } catch (error) {

            dispatch(updateBlogFailure(error.message));

            toast.error(
                error.response?.data?.message ||
                'Failed to update blog'
            );

            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const displayImage = imagePreview || getImageUrl(formData?.blogImgFile);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <BlogLoader />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-semibold">Blog not found</h1>
                <p className="text-gray-500">Unable to load this blog for editing.</p>
                <button
                    onClick={() => navigate('/dashboard?tab=blogs')}
                    className="px-4 py-2 bg-violet-500 text-white rounded-md font-semibold"
                >
                    Back to blogs
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex w-full items-center flex-col">

                <h1 className="text-3xl py-5 text-violet-500 font-semibold">
                    Update Blog
                </h1>

                <form className="flex flex-col w-10/12 gap-5">

                    <div className="flex gap-5">

                        <input
                            type="text"
                            placeholder="Blog Title"
                            className={`py-2 rounded-md px-3 border outline-none w-full ${
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-500'
                                    : ''
                            }`}
                            required
                            name="blogTitle"
                            value={formData.blogTitle || ''}
                            onChange={inputChangeHandle}
                        />

                        <select
                            className={`outline-none py-2 rounded-md px-5 border ${
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-500'
                                    : ''
                            }`}
                            required
                            name="blogCategory"
                            value={formData.blogCategory || ''}
                            onChange={inputChangeHandle}
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            {BLOG_CATEGORIES.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                    </div>

                    <div className="flex items-center border-2 border-dotted py-2 px-3 border-violet-500">

                        <input
                            type="file"
                            accept="image/*"
                            onChange={blogImgChangeHandle}
                        />

                    </div>

                    {
                        displayImage &&
                        (
                            <div className="w-full flex justify-center">
                                <img
                                    src={displayImage}
                                    alt="Blog"
                                    className="h-96 object-cover rounded-md w-full"
                                />
                            </div>
                        )
                    }

                    <div className="my-5">
                        <ReactQuill
                            className="h-72"
                            value={formData.blogBody || ''}
                            onChange={reactQuillChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-gray-700 text-white font-semibold active:bg-gray-800 py-2 rounded-md my-5 disabled:opacity-50"
                        onClick={updateBlogPost}
                    >
                        {submitting ? 'Updating...' : 'Update Changes'}
                    </button>

                </form>

            </div>
        </>
    );
};

export default UpdateBlog;

