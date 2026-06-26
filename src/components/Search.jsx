import apiClient from '../utils/apiClient';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { BLOG_CATEGORIES, ALL_CATEGORIES_VALUE } from '../utils/blogCategories';
import AuthorLink from './AuthorLink';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BlogLoader from '../assests/blogSpinner/BlogLoader';
import NodataImg from '../assests/No data.png';
import getImageUrl from '../utils/getImageUrl';

const buildSearchParams = (searchblog, sortblog, blogcategory) => {
    const params = new URLSearchParams();

    if (searchblog?.trim()) {
        params.set('searchBlog', searchblog.trim());
    }

    if (sortblog) {
        params.set('sort', sortblog);
    }

    if (blogcategory && blogcategory !== ALL_CATEGORIES_VALUE) {
        params.set('category', blogcategory);
    }

    return params;
};

const Search = () => {

    const { theme } = useSelector((state) => state.themeSliceApp);
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        searchblog: '',
        sortblog: 'desc',
        blogcategory: ALL_CATEGORIES_VALUE
    });

    const inputChangeHandle = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchBlogs = useCallback(async (searchParams, pageNum = 1, append = false) => {
        const params = new URLSearchParams(searchParams);

        if (pageNum > 1) {
            params.set('page', String(pageNum));
        }

        try {
            setLoading(true);
            const response = await apiClient.get(`/api/blog/get-all-blogs?${params.toString()}`);

            if (response.status === 200) {
                const fetched = response.data.blogs || [];
                setBlogs((prev) => (append ? [...prev, ...fetched] : fetched));
                setShowMoreButton(fetched.length >= 8);
            }
        } catch (error) {
            toast.error('Failed to load search results');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const URL = new URLSearchParams(location.search);
        const searchBlog = URL.get('searchBlog') || '';
        const category = URL.get('category') || ALL_CATEGORIES_VALUE;
        const sort = URL.get('sort') || 'desc';

        setFormData({
            searchblog: searchBlog,
            blogcategory: category,
            sortblog: sort === 'asc' ? 'asc' : 'desc'
        });

        if (location.search) {
            setPage(1);
            fetchBlogs(location.search.replace(/^\?/, ''), 1, false);
        } else {
            setBlogs([]);
            setShowMoreButton(false);
        }
    }, [location.search, fetchBlogs]);

    const submitHandle = (e) => {
        e.preventDefault();
        const params = buildSearchParams(
            formData.searchblog,
            formData.sortblog,
            formData.blogcategory
        );
        const query = params.toString();
        navigate(query ? `/search?${query}` : '/search');
    };

    const showMoreBlogs = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBlogs(location.search.replace(/^\?/, ''), nextPage, true);
    };

    const hasActiveSearch = Boolean(location.search);

    return (
        <>
            <div className="min-h-screen md:flex-row flex-col flex">

                <div className="">
                    <form onSubmit={submitHandle} className={`border-r mt-10 shadow-sm md:w-64 w-full mb-5 md:mb-0 md:min-h-screen px-5 ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'}`}>

                        <div className="flex flex-col ">

                            <label className='text-sm font-semibold'>Search</label>
                            <input
                                type="text"
                                placeholder='Search blog..'
                                className={`py-2 text-sm rounded-md border outline-none mt-1 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-500 focus:bg-gray-600' : 'bg-white border-gray-400 focus:bg-gray-50'}`}
                                onChange={inputChangeHandle}
                                name='searchblog'
                                value={formData.searchblog}
                            />

                            <label className='text-sm font-semibold mt-2 mb-1'>Sort</label>

                            <select
                                name="sortblog"
                                className={`px-5 py-2 border rounded-md text-sm outline-none ${theme === 'dark' ? 'bg-gray-700 border-gray-500 focus:bg-gray-600' : 'bg-white focus:bg-gray-50 border-gray-400'}`}
                                onChange={inputChangeHandle}
                                value={formData.sortblog}
                            >
                                <option value="desc">Latest</option>
                                <option value="asc">Oldest</option>
                            </select>

                            <label className='text-sm font-semibold mt-2 mb-1'>Category</label>
                            <select
                                name="blogcategory"
                                className={`px-5 py-2 rounded-md text-sm outline-none ${theme === 'dark' ? 'bg-gray-700 focus:bg-gray-600 border-gray-500' : 'bg-white border-gray-400 focus:bg-gray-50'}`}
                                onChange={inputChangeHandle}
                                value={formData.blogcategory}
                            >
                                <option value={ALL_CATEGORIES_VALUE}>All categories</option>
                                {BLOG_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="text-center mt-3 flex flex-col gap-2">
                            <button type='submit' className='py-2 text-xs w-full rounded-sm px-5 bg-gradient-to-r from-indigo-400 to-violet-500 text-white font-semibold'>
                                Apply filters
                            </button>
                            {hasActiveSearch && (
                                <button
                                    type="button"
                                    onClick={() => navigate('/search')}
                                    className={`py-2 text-xs w-full rounded-sm px-5 border font-semibold ${theme === 'dark' ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-700'}`}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {
                    loading ? <BlogLoader /> :

                        <div className="flex flex-col w-full items-center">
                            <div className="flex flex-wrap px-5 w-full my-10 gap-4 justify-center">
                                {
                                    blogs.length > 0
                                        ?
                                        blogs.map((value) => (
                                            <div
                                                key={value._id}
                                                className={`shadow-md border hover:scale-[99%] duration-300 transition-all w-96 rounded-tl-xl rounded-br-xl pb-5 cursor-pointer ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>

                                                <Link to={`/blog/${value?.slug}`}>
                                                    <img src={getImageUrl(value?.blogImgFile)} className='duration-300 hover:scale-[99%] transition-all w-96 h-60 rounded-tl-xl rounded-br-xl' alt={value.blogTitle} />

                                                    <div className="px-3">
                                                        <p className='text-lg md:text-xl'>{value?.blogTitle}</p>
                                                        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                                                            <span className='text-xs md:text-sm border px-4 rounded-full'>{value?.blogCategory}</span>
                                                            {value?.authorUsername && (
                                                                <AuthorLink
                                                                    username={value.authorUsername}
                                                                    profilePicture={value.authorProfilePicture}
                                                                    className="text-xs"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                        :
                                        <div className="w-full flex flex-col items-center">
                                            <img src={NodataImg} className='w-96' alt="No data" />
                                            <h1 className='text-xl font-bold'>
                                                {hasActiveSearch ? 'No blogs found for these filters' : 'Enter a search term or apply filters'}
                                            </h1>
                                        </div>
                                }
                            </div>

                            {showMoreButton && blogs.length > 0 && (
                                <button
                                    onClick={showMoreBlogs}
                                    className={`mb-10 transition-all active:scale-95 hover:bg-blue-900 py-2 font-semibold text-sm px-4 border-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 active:bg-gray-800 text-gray-200 border-gray-400'
                                        : 'active:bg-gray-600 active:text-white hover:text-white bg-gray-300 text-gray-800 border-gray-500'
                                        }`}
                                >
                                    Show more
                                </button>
                            )}
                        </div>
                }

            </div>
        </>
    );
};

export default Search;
