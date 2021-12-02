import { FunctionComponent, useContext, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Alert, Button, Divider, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { AuthenticationContext } from './Authentication';

const LogInForm: FunctionComponent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validationRules: {
            email: (value) => value.length > 0,
            password: (value) => value.length > 0,
        },
    });
    const router = useRouter();

    const { setIsAuthenticated, setUserUid } = useContext(
        AuthenticationContext
    );

    const submit = async (data) => {
        setIsLoading(true);
        setIsIncorrect(false);

        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            body: new URLSearchParams({
                username: data.email,
                password: data.password,
            }),
            credentials: 'include',
        });

        if (response.status === 200) {
            router.push('./');

            const { userUid } = await response.json();

            setIsAuthenticated?.(true);
            setUserUid?.(userUid);
        }

        if (response.status === 400) setIsIncorrect(true);

        setIsLoading(false);
    };

    return (
        <form
            onSubmit={form.onSubmit(submit)}
            className="w-screen max-w-sm p-4 flex flex-col"
        >
            <h1 className="text-xl font-bold">Log In</h1>

            <Divider className="my-4 border-neutral-700" />

            <div className="space-y-3">
                <TextInput
                    required
                    type="email"
                    label="Email Address"
                    error={form.errors.email && 'Email is required'}
                    value={form.values.email}
                    onChange={(e) =>
                        form.setFieldValue('email', e.currentTarget.value)
                    }
                />

                <TextInput
                    required
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    error={form.errors.password && 'Password is required.'}
                    value={form.values.password}
                    onChange={(e) =>
                        form.setFieldValue('password', e.currentTarget.value)
                    }
                    rightSection={
                        <Button
                            size="xs"
                            compact
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </Button>
                    }
                    rightSectionWidth={56}
                />
            </div>

            {isIncorrect && (
                <Alert
                    color="red"
                    title="Invalid credentials."
                    className="mt-5"
                >
                    Incorrect email or password.
                </Alert>
            )}

            <div className="self-end mt-5 space-x-4">
                <Button
                    variant="light"
                    onClick={() => router.push('./signup')}
                    className="mt-1"
                >
                    Create account
                </Button>
                <Button
                    type="submit"
                    variant="light"
                    className="mt-1"
                    loading={isLoading}
                >
                    Next
                </Button>
            </div>
        </form>
    );
};

export default LogInForm;
