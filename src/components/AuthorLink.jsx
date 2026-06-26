import { Link } from 'react-router-dom';
import getImageUrl from '../utils/getImageUrl';

const AuthorLink = ({ username, profilePicture, className = '' }) => {
    if (!username) return null;

    return (
        <Link
            to={`/user/${username}`}
            className={`inline-flex items-center gap-2 text-teal-500 hover:underline font-semibold ${className}`}
        >
            {profilePicture && (
                <img src={getImageUrl(profilePicture)} alt={username} className="w-6 h-6 rounded-full" />
            )}
            <span>@{username}</span>
        </Link>
    );
};

export default AuthorLink;
