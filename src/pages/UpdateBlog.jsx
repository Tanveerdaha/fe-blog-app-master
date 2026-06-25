
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    updateBlogStart,
    updateBlogFailure,
    updateBlogSuccess
} from '../features/blogSlice';

const apiUrl = import.meta.env.VITE_API_URL;

const UpdateBlog = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogId } = useParams();

    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);

    const [blogImage, setBlogImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({});

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

            const getBlog = await axios.get(apiUrl+
                `/api/blog/get-all-blogs?blogId=${blogId}`
            );

            if (getBlog.status === 200) {

                const response = getBlog.data.blogs[0];

                if (response) {
                    setFormData(response);
                }
            }

        } catch (error) {
            console.log(error.message);
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

            const blogForm = new FormData();

            blogForm.append('blogTitle', formData.blogTitle);
            blogForm.append('blogCategory', formData.blogCategory);
            blogForm.append('blogBody', formData.blogBody);

            if (blogImage) {
                blogForm.append('blogImgFile', blogImage);
            }

            const updateBlog = await axios.put(apiUrl+
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
        }
    };

    const displayImage =
        imagePreview ||
        (
            formData?.blogImgFile?.startsWith('http')
                ? formData.blogImgFile
                : `${apiUrl}${formData?.blogImgFile || ''}`
        );

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

                            <option>Java</option>
                            <option>Javascript</option>
                            <option>React Js</option>
                            <option>Git</option>
                            <option>Mongo DB</option>
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
                        className="bg-gray-700 text-white font-semibold active:bg-gray-800 py-2 rounded-md my-5"
                        onClick={updateBlogPost}
                    >
                        Update Changes
                    </button>

                </form>

            </div>

            <Toaster />
        </>
    );
};

export default UpdateBlog;

