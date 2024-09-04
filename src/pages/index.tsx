import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/auth/login');
    } else {
      router.push(auth.role === 'administrator' ? '/admin' : '/customer');
    }
  }, [auth]);

  return <div>Loading...</div>;
};

export default Home;
