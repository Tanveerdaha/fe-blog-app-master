import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import BlogPopupModal from "./BlogPopupModal";
import BlogLoader from "../assests/blogSpinner/BlogLoader";
import getImageUrl from '../utils/getImageUrl';
import ListingTable from './ListingTable';

const MyBlogs = () => {
    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);
    const [userBlogs, setUserBlogs] = useState([]);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [blogModal, setBlogModal] = useState(false);
    const [blogId, setBlogId] = useState("");
    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(2);

    useEffect(() => {
        const getBlogs = async () => {
            setLoader(true);
            try {
                const fetchBlogs = await apiClient.get(
                    `/api/blog/get-all-blogs?userId=${user._id}`,
                    { headers: { Authorization: user.token } }
                );

                if (fetchBlogs.status === 200) {
                    setUserBlogs(fetchBlogs.data.blogs);
                    setShowMoreButton(fetchBlogs.data.blogs.length >= 8);
                }
            } catch (error) {
                toast.error("Failed to load your blogs");
            } finally {
                setLoader(false);
            }
        };

        if (user?._id) {
            getBlogs();
        }
    }, [user._id, user.token]);

    const deleteBlogHandle = (id) => {
        setBlogId(id);
        setBlogModal(true);
    };

    const fetchBlogs = async (pageNum = 2) => {
        try {
            const response = await apiClient.get(
                `/api/blog/get-all-blogs?userId=${user._id}&page=${pageNum}`,
                { headers: { Authorization: user.token } }
            );

            if (response.status === 200) {
                setUserBlogs((prev) => [...prev, ...response.data.blogs]);
                setPage(pageNum + 1);
                setShowMoreButton(response.data.blogs.length >= 8);
            }
        } catch (error) {
            toast.error("Failed to load more blogs");
        }
    };

    return (
        <>
            <div className="w-full px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">My Blogs</h1>
                <Link
                    to="/create-blog"
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
                >
                    Create Blog
                </Link>
            </div>

            <div
                className={`transition-all min-h-0 border my-2 mx-2 rounded-md w-full md:mx-5 overflow-x-auto scrollbar ${theme === "dark" ? "border-zinc-700" : "border-gray-300"}`}
            >
                <ListingTable className="my-5">
                    <ListingTable.Head className={`text-base ${theme === "dark" ? "text-gray-100 bg-zinc-700" : "text-gray-700 bg-gray-300"}`}>
                        <ListingTable.HeadCell>Updated on</ListingTable.HeadCell>
                        <ListingTable.HeadCell>Image</ListingTable.HeadCell>
                        <ListingTable.HeadCell>Blog Title</ListingTable.HeadCell>
                        <ListingTable.HeadCell>Category</ListingTable.HeadCell>
                        <ListingTable.HeadCell>Edit</ListingTable.HeadCell>
                        <ListingTable.HeadCell>Delete</ListingTable.HeadCell>
                    </ListingTable.Head>

                    {loader ? (
                        <ListingTable.Body>
                            <ListingTable.Row>
                                <ListingTable.Cell colSpan="6" className="text-center">
                                    <BlogLoader />
                                </ListingTable.Cell>
                            </ListingTable.Row>
                        </ListingTable.Body>
                    ) : userBlogs.length === 0 ? (
                        <ListingTable.Body>
                            <ListingTable.Row>
                                <ListingTable.Cell colSpan="6" className="text-center py-10">
                                    <p className="text-gray-500 mb-3">You have not created any blogs yet.</p>
                                    <Link to="/create-blog" className="text-blue-500 hover:underline">Create your first blog</Link>
                                </ListingTable.Cell>
                            </ListingTable.Row>
                        </ListingTable.Body>
                    ) : (
                        userBlogs.map((data) => (
                            <ListingTable.Body key={data._id}>
                                <ListingTable.Row className={`text-center text-xs md:text-sm ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                                    <ListingTable.Cell>{new Date(data.updatedAt).toLocaleDateString()}</ListingTable.Cell>
                                    <ListingTable.Cell className="flex justify-center">
                                        <NavLink to={`/blog/${data.slug}`}>
                                            <img src={getImageUrl(data.blogImgFile)} alt="blog" className="w-10 h-10 md:w-20 md:h-14 object-cover rounded-md" />
                                        </NavLink>
                                    </ListingTable.Cell>
                                    <ListingTable.Cell>
                                        <NavLink to={`/blog/${data.slug}`} className="hover:underline">{data.blogTitle}</NavLink>
                                    </ListingTable.Cell>
                                    <ListingTable.Cell>{data.blogCategory}</ListingTable.Cell>
                                    <ListingTable.Cell>
                                        <NavLink to={`/update-blog/${data._id}`} className="text-green-500 hover:underline">Edit</NavLink>
                                    </ListingTable.Cell>
                                    <ListingTable.Cell>
                                        <button className="text-red-500 hover:underline" onClick={() => deleteBlogHandle(data._id)}>Delete</button>
                                    </ListingTable.Cell>
                                </ListingTable.Row>
                            </ListingTable.Body>
                        ))
                    )}
                </ListingTable>

                {showMoreButton && (
                    <div className="text-center my-5">
                        <button onClick={() => fetchBlogs(page)} className="px-4 py-2 border rounded-md text-sm font-semibold">
                            Show more
                        </button>
                    </div>
                )}
            </div>

            {blogModal && (
                <BlogPopupModal
                    blogModal={blogModal}
                    setBlogModal={setBlogModal}
                    blogId={blogId}
                    setUserBlogs={setUserBlogs}
                />
            )}
        </>
    );
};

export default MyBlogs;
