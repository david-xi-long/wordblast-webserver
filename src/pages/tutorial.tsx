import { NextPage } from 'next';

const SignupPage: NextPage = () => (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
        <div className="center-screen">
            <h1 className="max-w-3xl">How to Play</h1>
        </div>
        <h4 className="max-w-4xl text-center">
            On each turn, a player receives a syllable. In turn, each player has
            to type a word that contains the syllable. Be quick! If the bomb
            explodes during your turn , you lose a life.
        </h4>

        <style jsx>{`
            .center-screen {
                text-align: center;
            }
            body {
                background-color: rgb(38, 38, 38);
            }

            h4 {
                font-size: 17px;
                color: rgb(171, 171, 171);
            }
            h1 {
                font-size: 70px;

                color: rgb(171, 171, 171);
            }
        `}</style>
    </main>
);

export default SignupPage;
