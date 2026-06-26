import { BLOG_CATEGORIES } from '../utils/blogCategories';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addBlogStart, addBlogFailure, addBlogSuccess } from '../features/blogSlice';
import toast from 'react-hot-toast';
import apiClient from '../utils/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from '../assests/spinner/Spinner';

const CreateBlog = () => {

    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [blogImage, setBlogImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        user: user
    });
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

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const reactQuillChange = (value) => {
        setFormData({
            ...formData,
            blogBody: value
        });
    };

    const publishBlogBtn = async (e) => {
        e.preventDefault();

        if (!formData.blogTitle) {
            toast.error('Blog title is required!');
            return;
        }

        if (!formData.blogCategory) {
            toast.error('Select a category!');
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

            dispatch(addBlogStart());
            setSubmitting(true);

            const blogForm = new FormData();

            blogForm.append('blogTitle', formData.blogTitle);
            blogForm.append('blogCategory', formData.blogCategory);
            blogForm.append('blogBody', formData.blogBody);
            blogForm.append('user', JSON.stringify(user));

            console.log(formData);

            if (blogImage) {
                blogForm.append('blogImgFile', blogImage);
            }

            const addBlog = await apiClient.post(
                '/api/blog/post-blog',
                blogForm,
                {
                    headers: {
                        Authorization: user.token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (addBlog.status === 200) {

                const response = addBlog.data.blog;

                dispatch(addBlogSuccess(response));

                toast.success('Blog published successfully');

                navigate(`/blog/${response.slug}`);
            }

        } catch (error) {

            dispatch(addBlogFailure(error));

            toast.error(
                error.response?.data?.message ||
                'Failed to publish blog'
            );

            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex w-full items-center flex-col">

                <h1 className="text-3xl py-5 text-violet-500 font-semibold">
                    Create Blog
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
                            onChange={inputChangeHandle}
                        />

                        <select
                            defaultValue=""
                            className={`outline-none py-2 rounded-md px-5 border ${
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-500'
                                    : ''
                            }`}
                            required
                            name="blogCategory"
                            onChange={inputChangeHandle}
                        >
                            <option value="">Select Category</option>
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
                        imagePreview && (
                            <div className="w-full flex justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Blog Preview"
                                    className="rounded-md w-full h-96 object-cover"
                                />
                            </div>
                        )
                    }

                    <div className="my-5">
                        <ReactQuill
                            className="h-72"
                            onChange={reactQuillChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-gray-700 text-white font-semibold active:bg-gray-800 py-2 rounded-md my-5 disabled:opacity-50"
                        onClick={publishBlogBtn}
                    >
                        {submitting ? (
                            <div className="flex justify-center"><Spinner /></div>
                        ) : (
                            'Publish Blog'
                        )}
                    </button>

                </form>

            </div>
        </>
    );
};

export default CreateBlog;

