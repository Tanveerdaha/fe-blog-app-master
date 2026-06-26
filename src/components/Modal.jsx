import apiClient from '../utils/apiClient';
import { useState } from 'react';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

const Modal = ({ setShowModal, user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const closeModal = () => {
        if (!isDeleting) {
            setShowModal(false);
        }
    };

    const deleteUser = async () => {
        try {
            setIsDeleting(true);
            dispatch(deleteUserStart());
            const deleteUserInfo = await apiClient.delete(`/api/user/deleteuser/${user._id}`, {
                data: {
                    user: user
                },
                headers: {
                    Authorization: user.token
                }
            });

            if (deleteUserInfo.status === 200) {
                dispatch(deleteUserSuccess(null));
                setShowModal(false);
                navigate('/login');
                toast.success('Account deleted successfully');
            }
        } catch (error) {
            toast.error('An error occurred while deleting user!');
            dispatch(deleteUserFailure(error));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ConfirmModal
            open
            onClose={closeModal}
            onConfirm={deleteUser}
            message="Are you sure you want to delete your account?"
            confirmLabel="Yes, I'm sure"
            isLoading={isDeleting}
        />
    );
};

export default Modal;
