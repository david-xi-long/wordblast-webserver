import { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useNotifications } from '@mantine/notifications';
import { useForm } from '@mantine/hooks';
import { Button, Divider, TextInput } from '@mantine/core';

const SignUpForm: FunctionComponent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            matchingPassword: '',
        },

        validationRules: {
            email: (value) => value.length > 0,
            password: (value) => value.length >= 8,
            matchingPassword: (value, values) => value === values?.password,
        },
    });
    const notifications = useNotifications();
    const router = useRouter();

    const submit = async (data) => {
        setIsLoading(true);

        const response = await fetch('http://localhost:8080/api/user', {
            method: 'POST',
            body: new URLSearchParams({
                email: data.email,
                password: data.password,
                matchingPassword: data.matchingPassword,
            }),
            credentials: 'include',
        });
        const body = await response.json();

        if (response.status === 200) router.push('./');

        if (response.status === 400) {
            notifications.showNotification({
                color: 'red',
                title: 'Error',
                message: 'An unexpected error occurred. Try again later.',
            });
        }

        if (response.status === 409 && body.error === 'User already exists.')
            router.push('./login');

        setIsLoading(false);
    };

    return (
        <form
            className="w-screen max-w-md p-4 flex flex-col"
            onSubmit={form.onSubmit(submit)}
        >
            <h1 className="text-xl font-bold">Sign Up</h1>

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
                    error={
                        form.errors.password &&
                        'Password must contain 8 or more characters.'
                    }
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

                <TextInput
                    required
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    error={
                        form.errors.matchingPassword &&
                        'Passwords do not match.'
                    }
                    value={form.values.matchingPassword}
                    onChange={(e) =>
                        form.setFieldValue(
                            'matchingPassword',
                            e.currentTarget.value
                        )
                    }
                />
            </div>

            <div className="self-end mt-5 space-x-4">
                <Button
                    variant="light"
                    onClick={() => router.push('./login')}
                    className="mt-1"
                >
                    Sign in instead
                </Button>

                <Button
                    type="submit"
                    variant="light"
                    loading={isLoading}
                    className="mt-1"
                >
                    Next
                </Button>
            </div>
        </form>
    );
};

export default SignUpForm;
