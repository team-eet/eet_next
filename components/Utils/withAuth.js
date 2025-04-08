import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
    const AuthenticatedComponent = (props) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

            if (!userData) {
                router.replace('/login'); // Redirect if not logged in
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
