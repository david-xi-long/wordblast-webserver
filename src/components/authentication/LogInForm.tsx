import { FunctionComponent, useState } from 'react';
import { Input, FormControl, Button, Divider, Alert } from '@vechaiui/react';
import { cx } from '@vechaiui/utils';
import {
    FormErrorMessage,
    FormLabel,
    RequiredIndicator,
} from '@vechaiui/forms';
import { useRouter } from 'next/dist/client/router';
import { useForm } from 'react-hook-form';

const LogInForm: FunctionComponent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();

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

        if (response.status === 200) router.push('./');

        if (response.status === 400) setIsIncorrect(true);

        setIsLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="w-screen max-w-md p-8 flex flex-col"
        >
            <h1 className="text-xl font-bold">Log In</h1>

            <Divider className={cx('my-4', 'dark:border-neutral-700')} />

            <FormControl id="email">
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
                        {...register('password', { required: true })}
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
            </FormControl>

            {isIncorrect && (
                <Alert variant="subtle" className="mt-5">
                    Incorrect email or password.
                </Alert>
            )}

            <Button.Group className="self-end mt-5 space-x-4">
                <Button
                    type="button"
                    variant="ghost"
                    color="primary"
                    className="mt-1"
                    onClick={() => router.push('./signup')}
                >
                    Create account
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

export default LogInForm;
