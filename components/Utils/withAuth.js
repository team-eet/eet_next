import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal)


const withAuth = (WrappedComponent) => {
    const AuthenticatedComponent = (props) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

            if (!userData) {
                Swal.fire({
                    title: 'Login',
                    text: "Please login first",
                    icon: 'info',
                    showCancelButton: false,  // Hide the cancel button
                    confirmButtonText: 'OK',
                    closeOnConfirm: false, // Make sure the modal doesn't close immediately
                    customClass: {
                        confirmButton: 'btn btn-success', // Custom class for the OK button
                    },
                    buttonsStyling: false,  // Disable default SweetAlert2 button styling
                }).then((result) => {
                    if (result.isConfirmed) {
                        // If OK is clicked, redirect to the login page
                        router.replace('/login');
                    }
                });

                // router.replace('/login');
            } else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        }, []);

        if (loading) {
            return <p>Loading...</p>;
        }

        if (!isAuthenticated) {
            return null; // Don't show component while redirecting
        }

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
