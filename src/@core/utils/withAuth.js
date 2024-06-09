// utils/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const loginPath = '/'; // The path for the login page

        if (!token && router.pathname !== loginPath) {
          router.replace(loginPath); // Redirect to login page if token is not present and not on the login page
        }
      }
    }, [router]);

    // If the token is not present, we don't render the component until the redirect happens
    // We can show a loading indicator or a blank screen here if needed
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const loginPath = '/'; // The path for the login page

      if (!token && router.pathname !== loginPath) {
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
