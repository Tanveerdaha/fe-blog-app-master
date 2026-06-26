import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../utils/apiClient';
import getImageUrl from '../utils/getImageUrl';
import BlogLoader from '../assests/blogSpinner/BlogLoader';

const PublicProfile = () => {
    const { username } = useParams();
    const { theme } = useSelector((state) => state.themeSliceApp);
    const [profile, setProfile] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setNotFound(false);

            try {
                const response = await apiClient.get(`/api/user/profile/${username}`);

                if (response.status === 200) {
                    setProfile(response.data.user);
                    setBlogs(response.data.blogs || []);
                }
            } catch (error) {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <BlogLoader />
            </div>
        );
    }

    if (notFound || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-semibold">User not found</h1>
                <Link to="/" className="text-blue-500 hover:underline">Back to home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto">
            <div className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-zinc-800' : 'border-gray-300 bg-white'}`}>
                <img
                    src={getImageUrl(profile.profilePicture)}
                    alt={profile.username}
                    className="w-28 h-28 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-3xl font-bold">@{profile.username}</h1>
                    <p className="text-gray-500 mt-1">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2">{blogs.length} blog{blogs.length !== 1 ? 's' : ''} published</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-5">Blogs by @{profile.username}</h2>

            {blogs.length === 0 ? (
                <p className="text-gray-500">This user has not published any blogs yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {blogs.map((blog) => (
                        <Link
                            key={blog._id}
                            to={`/blog/${blog.slug}`}
                            className={`border rounded-lg overflow-hidden hover:scale-[99%] transition-all ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                        >
                            <img src={getImageUrl(blog.blogImgFile)} alt={blog.blogTitle} className="w-full h-44 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold">{blog.blogTitle}</h3>
                                <span className="text-xs border px-2 py-1 rounded-full mt-2 inline-block">{blog.blogCategory}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicProfile;
