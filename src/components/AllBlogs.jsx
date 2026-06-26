import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import BlogPopupModal from "./BlogPopupModal";
import BlogLoader from "../assests/blogSpinner/BlogLoader";
import getImageUrl from '../utils/getImageUrl';
import AuthorLink from './AuthorLink';
import ListingTable from './ListingTable';

const AllBlogs = () => {
    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);
    const [blogs, setBlogs] = useState([]);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [blogModal, setBlogModal] = useState(false);
    const [blogId, setBlogId] = useState("");
    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(2);

    const fetchBlogs = async (pageNum = 1, append = false) => {
        try {
            setLoader(!append);
            const response = await apiClient.get(
                `/api/blog/get-all-blogs?page=${pageNum}`,
                pageNum === 1 && user?.token
                    ? { headers: { Authorization: user.token } }
                    : undefined
            );

            if (response.status === 200) {
                const fetched = response.data.blogs || [];
                setBlogs((prev) => (append ? [...prev, ...fetched] : fetched));
                setShowMoreButton(fetched.length >= 8);
            }
        } catch (error) {
            toast.error("Failed to load blogs");
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (user?.isAdmin) {
            fetchBlogs(1);
        }
    }, [user?.isAdmin]);

    const deleteBlogHandle = (id) => {
        setBlogId(id);
        setBlogModal(true);
    };

    const showMoreBlogsButton = () => {
        fetchBlogs(page, true);
        setPage((prev) => prev + 1);
    };

    return (
        <>
            {user && user.isAdmin ? (
                <div
                    className={`transition-all min-h-0 border my-2 mx-2 rounded-md w-full md:mx-5 overflow-x-auto scrollbar ${theme === "dark" ? "border-zinc-700" : "border-gray-300"}`}
                >
                    <div className="px-4 py-4">
                        <h1 className="text-xl font-semibold">All Blogs</h1>
                        <p className="text-sm text-gray-500 mt-1">View all posts. Delete only — editing is done by each blog owner.</p>
                    </div>

                    <ListingTable className="my-5">
                        <ListingTable.Head
                            className={`text-base ${theme === "dark" ? "text-gray-100 bg-zinc-700" : "text-gray-700 bg-gray-300"}`}
                        >
                            <ListingTable.HeadCell className="md:text-sm text-xs px-5">Updated on</ListingTable.HeadCell>
                            <ListingTable.HeadCell className="md:text-sm text-xs">Image</ListingTable.HeadCell>
                            <ListingTable.HeadCell className="md:text-sm text-xs text-center">Blog Title</ListingTable.HeadCell>
                            <ListingTable.HeadCell className="md:text-sm text-xs px-5">Author</ListingTable.HeadCell>
                            <ListingTable.HeadCell className="md:text-sm text-xs px-5">Category</ListingTable.HeadCell>
                            <ListingTable.HeadCell className="md:text-sm text-xs px-5">Delete</ListingTable.HeadCell>
                        </ListingTable.Head>

                        {loader ? (
                            <ListingTable.Body>
                                <ListingTable.Row>
                                    <ListingTable.Cell colSpan="6" className="text-center py-10">
                                        <BlogLoader />
                                    </ListingTable.Cell>
                                </ListingTable.Row>
                            </ListingTable.Body>
                        ) : blogs.length === 0 ? (
                            <ListingTable.Body>
                                <ListingTable.Row>
                                    <ListingTable.Cell colSpan="6" className="text-center py-10">
                                        No blogs found
                                    </ListingTable.Cell>
                                </ListingTable.Row>
                            </ListingTable.Body>
                        ) : (
                            blogs.map((blog) => (
                                <ListingTable.Body key={blog._id}>
                                    <ListingTable.Row
                                        className={`text-center text-xs md:text-sm transition-all rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                                    >
                                        <ListingTable.Cell className="text-xs md:text-sm">
                                            {new Date(blog.updatedAt).toLocaleDateString()}
                                        </ListingTable.Cell>

                                        <ListingTable.Cell className="flex justify-center">
                                            <NavLink to={`/blog/${blog.slug}`}>
                                                <img
                                                    src={getImageUrl(blog.blogImgFile)}
                                                    alt={blog.blogTitle}
                                                    className="w-10 h-10 md:w-20 md:h-14 object-cover rounded-md"
                                                />
                                            </NavLink>
                                        </ListingTable.Cell>

                                        <ListingTable.Cell
                                            className={`border-l border-r px-5 text-xs md:text-sm text-left ${theme === "dark" ? "text-gray-300 border-gray-700" : ""}`}
                                        >
                                            <NavLink to={`/blog/${blog.slug}`} className="hover:underline">
                                                {blog.blogTitle}
                                            </NavLink>
                                        </ListingTable.Cell>

                                        <ListingTable.Cell className="text-xs md:text-sm">
                                            <AuthorLink
                                                username={blog.authorUsername}
                                                profilePicture={blog.authorProfilePicture}
                                            />
                                        </ListingTable.Cell>

                                        <ListingTable.Cell className="text-xs md:text-sm text-justify pl-5">
                                            {blog.blogCategory}
                                        </ListingTable.Cell>

                                        <ListingTable.Cell>
                                            <button
                                                type="button"
                                                className="text-red-500 hover:underline"
                                                onClick={() => deleteBlogHandle(blog._id)}
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
                        <div className="text-center my-5">
                            <button
                                type="button"
                                onClick={showMoreBlogsButton}
                                className={`transition-all active:scale-95 hover:bg-blue-900 py-1 font-semibold text-xs px-2 border rounded-sm ${theme === "dark"
                                    ? "bg-gray-700 active:bg-gray-800 text-gray-300 border-gray-400"
                                    : "active:bg-gray-600 active:text-white hover:text-white bg-gray-300 text-gray-800 border-gray-500"
                                    }`}
                            >
                                Show more..
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="min-h-screen flex flex-col w-full justify-center items-center gap-3 px-4">
                    <p className="text-gray-500 text-center">Admin access is required to view all blogs.</p>
                    <Link to="/dashboard?tab=profile" className="text-blue-500 hover:underline">
                        Go to profile
                    </Link>
                </div>
            )}

            {blogModal && (
                <BlogPopupModal
                    setBlogModal={setBlogModal}
                    blogId={blogId}
                    setUserBlogs={setBlogs}
                    message="Are you sure you want to delete this blog?"
                />
            )}
        </>
    );
};

export default AllBlogs;
