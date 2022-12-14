import { Card } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../components/authentication/Authentication';
import LogInForm from '../components/authentication/LogInForm';

const LoginPage: NextPage = () => {
    const router = useRouter();

    const { isAuthenticated } = useContext(AuthenticationContext);

    useEffect(() => {
        if (!isAuthenticated) return;
        router.replace('./');
    }, [isAuthenticated]);

    return (
        <main className="min-h-screen w-full flex flex-col justify-center items-center">
            <Card>
                <LogInForm />
            </Card>
        </main>
    );
};

export default LoginPage;
