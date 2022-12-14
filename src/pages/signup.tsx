import { Card } from '@mantine/core';
import { NextPage } from 'next';
import SignUpForm from '../components/authentication/SignUpForm';

const SignupPage: NextPage = () => (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
        <Card>
            <SignUpForm />
        </Card>
    </main>
);

export default SignupPage;
