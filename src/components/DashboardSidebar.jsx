import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, NavLink, useNavigate, Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { signOutSuccess, signOutUserFailure } from '../features/userSlice';
import apiClient from '../utils/apiClient';
import { MdPostAdd } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { PiChartPieSliceFill } from "react-icons/pi";
import { BiCommentDetail } from "react-icons/bi";

const DashboardSidebar = () => {

    const { theme } = useSelector((state) => state.themeSliceApp);
    const { user } = useSelector((state) => state.userSliceApp);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const getTab = urlParams.get('tab');
        setTab(getTab);
    }, [location.search]);

    const signOutHandle = async () => {
        try {
            const signOutUser = await apiClient.post('/api/user/signoutuser');

            if (signOutUser.data.success === true) {
                dispatch(signOutSuccess());
                navigate('/login');
            }
        } catch (error) {
            dispatch(signOutUserFailure(error));
        }
    };

    const linkClass = (name) => `flex transition-all justify-center gap-1 items-center ${tab === name && 'bg-zinc-700 mx-3 text-white rounded-md py-1'}`;

    return (
        <>
            <div className={`transition-all border-r w-full my-5 flex flex-col gap-4 md:w-52 md:min-h-screen ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`} >

                <NavLink to={'?tab=profile'} className={linkClass('profile')}>
                    <span><CgProfile size={25} /></span>
                    <div className='flex gap-2 items-center'>
                        <p>Profile</p>
                        <span className='bg-gray-900 py-1 px-1 rounded-md text-blue-300 text-xs'>
                            {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                    </div>
                </NavLink>

                <NavLink to={'?tab=my-blogs'} className={linkClass('my-blogs')}>
                    <span><MdPostAdd size={23} /></span>
                    <span>My Blogs</span>
                </NavLink>

                <NavLink to={`?tab=my-comments`} className={linkClass('my-comments')}>
                    <span><BiCommentDetail size={20} /></span>
                    <span>My Comments</span>
                </NavLink>

                <Link to="/create-blog" className="flex justify-center gap-1 items-center text-green-500 font-semibold hover:underline mx-3">
                    <MdPostAdd size={20} />
                    <span>Create Blog</span>
                </Link>

                {user?.isAdmin && (
                    <>
                        <hr className={theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} />
                        <NavLink to={`?tab=dash`} className={linkClass('dash')}>
                            <span><PiChartPieSliceFill size={21} /></span>
                            <span>Admin Stats</span>
                        </NavLink>
                        <NavLink to={`?tab=users`} className={linkClass('users')}>
                            <span><FaUsersCog size={21} /></span>
                            <span>All Users</span>
                        </NavLink>
                        <NavLink to={`?tab=comments`} className={linkClass('comments')}>
                            <span><FaRegCommentDots size={20} /></span>
                            <span>All Comments</span>
                        </NavLink>
                    </>
                )}

                <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={signOutHandle}>
                    <span><CiLogout size={20} /></span>
                    <span>Sign out</span>
                </div>
            </div>
        </>
    );
};
export default DashboardSidebar;
