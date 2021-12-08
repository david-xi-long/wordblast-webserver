import {
    createContext,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import getGameEndpoint from '../../scripts/utils/endpoint';

interface IAuthenticationContext {
    isAuthenticated?: boolean;
    setIsAuthenticated?: Dispatch<SetStateAction<boolean | undefined>>;
    userUid?: string;
    setUserUid?: Dispatch<SetStateAction<string>>;
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
    isAuthenticated: undefined,
    setIsAuthenticated: undefined,
    userUid: undefined,
    setUserUid: undefined,
});

const Authentication: FunctionComponent = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<
        undefined | boolean
    >();
    const [userUid, setUserUid] = useState('');

    const getAuthInfo = async () => {
        const response = await fetch(`${getGameEndpoint()}/api/user`, {
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
        <AuthenticationContext.Provider
            value={{ isAuthenticated, setIsAuthenticated, userUid, setUserUid }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};

export default Authentication;
