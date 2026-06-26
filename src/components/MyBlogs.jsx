import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import BlogPopupModal from "./BlogPopupModal";
import BlogLoader from "../assests/blogSpinner/BlogLoader";
import getImageUrl from '../utils/getImageUrl';

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
                className={`transition-all min-h-screen border my-2 mx-2 rounded-md w-full items-center md:mx-5 table-auto overflow-x-scroll scrollbar ${theme === "dark" ? "border-zinc-700" : "border-gray-300"}`}
            >
                <Table hoverable className="my-5 relative z-10">
                    <Table.Head className={`text-base ${theme === "dark" ? "text-gray-100 bg-zinc-700" : "text-gray-700 bg-gray-300"}`}>
                        <Table.HeadCell>Updated on</Table.HeadCell>
                        <Table.HeadCell>Image</Table.HeadCell>
                        <Table.HeadCell>Blog Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Edit</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>

                    {loader ? (
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell colSpan="6" className="text-center">
                                    <BlogLoader />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ) : userBlogs.length === 0 ? (
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell colSpan="6" className="text-center py-10">
                                    <p className="text-gray-500 mb-3">You have not created any blogs yet.</p>
                                    <Link to="/create-blog" className="text-blue-500 hover:underline">Create your first blog</Link>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ) : (
                        userBlogs.map((data) => (
                            <Table.Body key={data._id}>
                                <Table.Row className={`text-center text-xs md:text-sm ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                                    <Table.Cell>{new Date(data.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell className="flex justify-center">
                                        <NavLink to={`/blog/${data.slug}`}>
                                            <img src={getImageUrl(data.blogImgFile)} alt="blog" className="w-10 h-10 md:w-20 md:h-14 object-cover rounded-md" />
                                        </NavLink>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <NavLink to={`/blog/${data.slug}`} className="hover:underline">{data.blogTitle}</NavLink>
                                    </Table.Cell>
                                    <Table.Cell>{data.blogCategory}</Table.Cell>
                                    <Table.Cell>
                                        <NavLink to={`/update-blog/${data._id}`} className="text-green-500 hover:underline">Edit</NavLink>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <button className="text-red-500 hover:underline" onClick={() => deleteBlogHandle(data._id)}>Delete</button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))
                    )}
                </Table>

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
