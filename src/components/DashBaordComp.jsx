import apiClient from '../utils/apiClient';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const DashBaordComp = () => {

    const [userData, setUserData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [commentsData, setCommetsData] = useState([]);

    const [totalUsers, setTotalUser] = useState(0);
    const [totalBlogPosts, setTotalBlogPost] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthsPost] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const fetchUserDetails = await apiClient.get('/api/user/getusers?user=5', {
                    headers: {
                        Authorization: user.token
                    }
                });

                if (fetchUserDetails.status === 200) {
                    setUserData(fetchUserDetails.data.user);
                    setTotalUser(fetchUserDetails.data.countUser);
                    setLastMonthUsers(fetchUserDetails.data.lastMonthUsers);
                }

            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchBlog = async () => {
            try {
                const fetchBlogDetails = await apiClient.get('/api/blog/get-all-blogs?limit=5');

                if (fetchBlogDetails.status === 200) {
                    setBlogsData(fetchBlogDetails.data.blogs);
                    setTotalBlogPost(fetchBlogDetails.data.countBlogs);
                    setLastMonthsPost(fetchBlogDetails.data.lastMonthBlogs);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchComments = async () => {
            try {
                const fetchCommentDetails = await apiClient.get('/api/comment/get-all-comments?limitComments=5', {
                    headers: {
                        Authorization: user.token
                    }
                });
                if (fetchCommentDetails.status === 200) {
                    setCommetsData(fetchCommentDetails.data.comments);
                    setTotalComments(fetchCommentDetails.data.countDocument);
                    setLastMonthComments(fetchCommentDetails.data.lastMonthComment);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (user?.isAdmin) {
            fetchUser();
            fetchBlog();
            fetchComments();
        }

    }, [user]);

    const statCardClass = `rounded-lg border p-5 ${theme === 'dark' ? 'border-gray-700 bg-zinc-800' : 'border-gray-300 bg-white'}`;

    return (
        <>
            <div className="w-full p-6">
                <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={statCardClass}>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                        <p className="text-xs mt-2">+{lastMonthUsers} this month</p>
                    </div>
                    <div className={statCardClass}>
                        <p className="text-sm text-gray-500">Total Blogs</p>
                        <p className="text-3xl font-bold">{totalBlogPosts}</p>
                        <p className="text-xs mt-2">+{lastMonthPosts} this month</p>
                    </div>
                    <div className={statCardClass}>
                        <p className="text-sm text-gray-500">Total Comments</p>
                        <p className="text-3xl font-bold">{totalComments}</p>
                        <p className="text-xs mt-2">+{lastMonthComments} this month</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={statCardClass}>
                        <h2 className="font-semibold mb-3">Recent Users</h2>
                        <ul className="space-y-2 text-sm">
                            {userData.map((u) => (
                                <li key={u._id}>{u.username} — {u.email}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={statCardClass}>
                        <h2 className="font-semibold mb-3">Recent Blogs</h2>
                        <ul className="space-y-2 text-sm">
                            {blogsData.map((b) => (
                                <li key={b._id}>{b.blogTitle}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={statCardClass}>
                        <h2 className="font-semibold mb-3">Recent Comments</h2>
                        <ul className="space-y-2 text-sm">
                            {commentsData.map((c) => (
                                <li key={c._id}>{c.comment?.slice(0, 50)}...</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBaordComp;
