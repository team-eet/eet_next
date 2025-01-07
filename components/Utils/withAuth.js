import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
    const AuthenticatedComponent = (props) => {
        const router = useRouter();

        useEffect(() => {
            const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

            if (!userData) {
                router.push('/login'); // Redirect to login page if not authenticated
            }
        }, []);

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
