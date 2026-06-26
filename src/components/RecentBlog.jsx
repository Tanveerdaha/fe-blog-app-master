import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import getImageUrl from '../utils/getImageUrl';
import AuthorLink from './AuthorLink';



const RecentBlog = ({ blogs }) => {

    const [recentBlogs, setLimitBlogs] = useState(blogs);
    const { theme } = useSelector((state) => state.themeSliceApp);



    return (
        <>
            <div className={`border w-80 rounded-md  flex justify-center items-center      ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>

                <Link to={`/blog/${recentBlogs.slug}`}>
                    <img src={getImageUrl(recentBlogs && recentBlogs.blogImgFile)} className='hover:scale-[99%] w-80 h-48 object-cover  rounded-sm transition-all' />

                    <div className="flex flex-col gap-1 px-2 py-2">
                        <p className='md:text-xl '>{recentBlogs && recentBlogs.blogTitle}</p>
                        <p className={`text-xs md:text-sm w-20 text-center border-2 rounded-full ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                            {recentBlogs && recentBlogs.blogCategory}
                        </p>
                        <AuthorLink
                            username={recentBlogs?.authorUsername}
                            profilePicture={recentBlogs?.authorProfilePicture}
                            className="text-xs mt-1"
                        />
                    </div>
                </Link >
            </div >
        </>
    )
}

export default RecentBlog;