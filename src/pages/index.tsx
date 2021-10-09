import type { NextPage } from 'next';
import Head from 'next/head';
import MainPage from './mainpage';

// 1. Connect to backend socket.
// 2. Create player object.
// 3. Store it in PlayerManager (in-memory store).

// 1. Connect to game socket.
// 2. Get the player object from the PlayerManager.
// 3. Add player object to the game object.

const Home: NextPage = () => (
    <div>
        <Head>
            <title>WordBlast</title>
        </Head>
        <MainPage />
    </div>
);

export default Home;
