import type { NextPage } from 'next';
import Head from 'next/head';
import MainPage from '../components/MainPage';

const Home: NextPage = () => (
    <>
        <Head>
            <title>WordBlast</title>
        </Head>
        <MainPage />
    </>
);

export default Home;
