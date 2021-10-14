import { Input, FormControl, Button, Divider } from '@vechaiui/react';
import { cx } from '@vechaiui/utils';
import {
    FormErrorMessage,
    FormLabel,
    RequiredIndicator,
} from '@vechaiui/forms';
import { useNotification } from '@vechaiui/notification';
import { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useForm } from 'react-hook-form';

const SignUpForm: FunctionComponent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();
    const notification = useNotification();
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
            notification({
                title: 'Error',
                description: 'An unexpected error occurred. Try again later.',
                status: 'error',
            });
        }

        if (response.status === 409 && body.error === 'User already exists.')
            router.push('./login');

        setIsLoading(false);
    };

    return (
        <form
            className="w-screen max-w-md p-8 flex flex-col"
            onSubmit={handleSubmit(submit)}
        >
            <h1 className="text-xl font-bold">Sign Up</h1>

            <Divider className={cx('my-4', 'dark:border-neutral-700')} />

            <FormControl id="email" invalid={errors.email !== undefined}>
                <FormLabel>
                    Email address
                    <RequiredIndicator />
                </FormLabel>
                <Input
                    type="email"
                    placeholder="your@email.com"
                    {...register('email', { required: true })}
                />
                {errors.email?.type === 'required' && (
                    <FormErrorMessage>Email is required.</FormErrorMessage>
                )}
            </FormControl>

            <FormControl id="password" className="mt-4">
                <FormLabel>
                    Password
                    <RequiredIndicator />
                </FormLabel>
                <Input.Group>
                    <Input
                        className="pr-14"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                            required: true,
                            minLength: 8,
                        })}
                    />
                    <Input.RightElement className="w-14">
                        <Button
                            type="button"
                            size="xs"
                            variant="solid"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </Button>
                    </Input.RightElement>
                </Input.Group>
                {errors.password?.type === 'required' && (
                    <FormErrorMessage>Password is required.</FormErrorMessage>
                )}
                {errors.password?.type === 'minLength' && (
                    <FormErrorMessage>
                        Password must contain 8 or more characters.
                    </FormErrorMessage>
                )}
            </FormControl>

            <FormControl id="matchingPassword" className="mt-4">
                <FormLabel>
                    Confirm Password
                    <RequiredIndicator />
                </FormLabel>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('matchingPassword', {
                        required: true,
                        validate: {
                            passwordMatch: (v) => v === getValues('password'),
                        },
                    })}
                />
                {errors.matchingPassword?.type === 'required' && (
                    <FormErrorMessage>Password is required.</FormErrorMessage>
                )}
                {errors.matchingPassword?.type === 'passwordMatch' && (
                    <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                )}
            </FormControl>

            <Button.Group className="self-end mt-6 space-x-4">
                <Button
                    type="button"
                    variant="ghost"
                    color="primary"
                    className="mt-1"
                    onClick={() => router.push('./login')}
                >
                    Sign in instead
                </Button>
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    className="mt-1"
                    loading={isLoading}
                >
                    Next
                </Button>
            </Button.Group>
        </form>
    );
};

export default SignUpForm;
