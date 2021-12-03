import type { NextPage } from 'next';
import Head from 'next/head';
import MainPage from '../components/MainPage';

const Home: NextPage = () => (
    <>
        <Head>
            <title>WordBlast</title>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
            />
        </Head>
        <MainPage />
    </>
);

export default Home;
