import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import LogInForm from '../components/LogInForm';
import { Card } from '../components/vechai-extensions/Card';

const LoginPage: NextPage = () => {
    const router = useRouter();

    // If already authenticated, send to the home page.
    // Only run on the client.
    if (typeof window !== 'undefined') {
        fetch('http://localhost:8080/api/user', {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(({ authenticated }) => authenticated && router.replace('./'));
    }

    return (
        <main className="h-screen w-full flex flex-col justify-center items-center">
            <Card>
                <LogInForm />
            </Card>
        </main>
    );
};

export default LoginPage;
