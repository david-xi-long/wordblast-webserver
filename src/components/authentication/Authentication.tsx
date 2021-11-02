import { createContext, FunctionComponent, useEffect, useState } from 'react';

interface IAuthenticationContext {
    isAuthenticated: undefined | boolean;
    userUid: undefined | string;
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
    isAuthenticated: undefined,
    userUid: undefined,
});

const Authentication: FunctionComponent = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<
        undefined | boolean
    >();
    const [userUid, setUserUid] = useState('');

    const getAuthInfo = async () => {
        const response = await fetch('http://localhost:8080/api/user', {
            credentials: 'include',
        });

        const { authenticated, uid } = await response.json();

        setIsAuthenticated(authenticated);

        if (authenticated) setUserUid(uid);
    };

    useEffect(() => {
        getAuthInfo();
    }, []);

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, userUid }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export default Authentication;
