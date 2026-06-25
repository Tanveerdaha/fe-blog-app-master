import DashboardSidebar from "../components/DashboardSidebar"
import DashboardProfile from "../components/DashboardProfile"
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import AllBlogs from '../components/AllBlogs';
import AllUsers from "../components/AllUsers";
import AllComments from "../components/AllComments";
import DashBaordComp from "../components/DashBaordComp";

const Dashboard = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [tab, setTab] = useState('profile');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const getTab = urlParams.get('tab');

        if (!getTab) {
            navigate('/dashboard?tab=profile', { replace: true });
            setTab('profile');
        } else {
            setTab(getTab);
        }
    }, [location.search, navigate]);

    return (
        <>
            <div className="flex md:flex-row flex-col ">
                <div>
                    <DashboardSidebar />
                </div>

                <div className={`${tab === 'dash' && 'flex w-full'}`}>
                    {tab === 'dash' && <DashBaordComp />}
                </div>

                <div className={`${tab === 'profile' && 'flex justify-center w-full'}`}>
                    {tab === 'profile' && <DashboardProfile />}
                </div>

                <div className={`${tab === 'blogs' && 'flex w-full'}`}>
                    {tab === 'blogs' && <AllBlogs />}
                </div>

                <div className={`${tab === 'users' && 'flex w-full'}`}>
                    {tab === 'users' && <AllUsers />}
                </div>

                <div className={`${tab === 'comments' && 'flex w-full'}`}>
                    {tab === 'comments' && <AllComments />}
                </div>
            </div>
        </>
    )
}
export default Dashboard;
