import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import BlogLoader from "../assests/blogSpinner/BlogLoader";

const MyComments = () => {
    const { user } = useSelector((state) => state.userSliceApp);
    const { theme } = useSelector((state) => state.themeSliceApp);
    const [comments, setComments] = useState([]);
    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(1);
    const [showMore, setShowMore] = useState(false);

    const fetchComments = async (pageNum = 1, append = false) => {
        if (!user?.token) return;

        setLoader(true);
        try {
            const response = await apiClient.get(
                `/api/comment/my-blog-comments?page=${pageNum}&limit=10`,
                { headers: { Authorization: user.token } }
            );

            if (response.status === 200) {
                const fetched = response.data.comments || [];
                setComments((prev) => (append ? [...prev, ...fetched] : fetched));
                setShowMore(fetched.length >= 10);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load comments on your blogs");
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchComments(1, false);
    }, [user?._id, user?.token]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage, true);
    };

    const wrapperClass = `transition-all min-h-screen border my-2 mx-2 rounded-md w-full md:mx-5 overflow-x-auto scrollbar ${
        theme === "dark" ? "border-zinc-700" : "border-gray-300"
    }`;

    const headClass = `text-base ${theme === "dark" ? "text-gray-100 bg-zinc-700" : "text-gray-700 bg-gray-300"}`;
    const rowClass = `text-xs md:text-sm transition-all rounded-md ${
        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
    }`;

    return (
        <div className="w-full">
            <div className="px-4 py-4">
                <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                    Comments on My Blogs
                </h1>
                <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {comments.length} comment{comments.length !== 1 ? "s" : ""} on your posts
                </p>
            </div>

            <div className={wrapperClass}>
                <Table hoverable className="my-5">
                    <Table.Head className={headClass}>
                        <Table.HeadCell className={theme === "dark" ? "border-gray-600" : ""}>Date</Table.HeadCell>
                        <Table.HeadCell className={theme === "dark" ? "border-gray-600" : ""}>Comment</Table.HeadCell>
                        <Table.HeadCell className={theme === "dark" ? "border-gray-600" : ""}>By</Table.HeadCell>
                        <Table.HeadCell className={theme === "dark" ? "border-gray-600" : ""}>Blog</Table.HeadCell>
                    </Table.Head>

                    {loader ? (
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell colSpan="4" className="text-center py-10">
                                    <BlogLoader />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ) : comments.length === 0 ? (
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell
                                    colSpan="4"
                                    className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                                >
                                    No comments on your blogs yet.
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ) : (
                        comments.map((comment) => (
                            <Table.Body key={comment._id}>
                                <Table.Row className={rowClass}>
                                    <Table.Cell className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell className={`max-w-xs ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                                        {comment.comment}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.username ? (
                                            <Link to={`/user/${comment.username}`} className="text-teal-500 hover:underline">
                                                @{comment.username}
                                            </Link>
                                        ) : (
                                            <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Unknown</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.blogSlug ? (
                                            <NavLink to={`/blog/${comment.blogSlug}`} className="text-blue-500 hover:underline">
                                                {comment.blogTitle}
                                            </NavLink>
                                        ) : (
                                            <span className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                                {comment.blogTitle || "—"}
                                            </span>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))
                    )}
                </Table>

                {showMore && (
                    <div className="text-center my-5 pb-4">
                        <button
                            onClick={loadMore}
                            className={`px-4 py-2 border rounded-md text-sm font-semibold ${
                                theme === "dark"
                                    ? "border-gray-600 text-gray-200 hover:bg-gray-800"
                                    : "border-gray-400 text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            Show more
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyComments;
