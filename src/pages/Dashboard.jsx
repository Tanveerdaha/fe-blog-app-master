import DashboardSidebar from "../components/DashboardSidebar"
import DashboardProfile from "../components/DashboardProfile"
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import AllUsers from "../components/AllUsers";
import AllComments from "../components/AllComments";
import DashBaordComp from "../components/DashBaordComp";
import AllBlogs from "../components/AllBlogs";
import MyBlogs from "../components/MyBlogs";
import MyComments from "../components/MyComments";

const ADMIN_TABS = ['dash', 'blogs', 'users', 'comments'];

const Dashboard = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userSliceApp);
    const [tab, setTab] = useState('profile');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const getTab = urlParams.get('tab');

        if (!getTab) {
            navigate('/dashboard?tab=profile', { replace: true });
            setTab('profile');
            return;
        }

        if (ADMIN_TABS.includes(getTab) && !user?.isAdmin) {
            navigate('/dashboard?tab=my-blogs', { replace: true });
            setTab('my-blogs');
            return;
        }

        setTab(getTab);
    }, [location.search, navigate, user?.isAdmin]);

    return (
        <>
            <div className="flex md:flex-row flex-col w-full">
                <div>
                    <DashboardSidebar />
                </div>

                <div className="flex-1 w-full">
                    {tab === 'dash' && user?.isAdmin && <DashBaordComp />}
                    {tab === 'blogs' && user?.isAdmin && <AllBlogs />}
                    {tab === 'profile' && <DashboardProfile />}
                    {tab === 'my-blogs' && <MyBlogs />}
                    {tab === 'my-comments' && <MyComments />}
                    {tab === 'users' && user?.isAdmin && <AllUsers />}
                    {tab === 'comments' && user?.isAdmin && <AllComments />}
                </div>
            </div>
        </>
    );
};
export default Dashboard;
