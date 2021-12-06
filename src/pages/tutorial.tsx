import { NextPage } from 'next';

const SignupPage: NextPage = () => (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
        <div className="center-screen">
            <h1 className="max-w-3xl">How to Play</h1>
        </div>
        <h2 className="max-w-7xl text-center">
            Each player receives 3 lives and 20 seconds to type a word.<br/ >
            On each turn, a player receives a syllable. In turn, each player has
            to type a word that contains the syllable. <br/ >
            Be quick! If the bomb explodes during your turn, you lose a life!<br/ >
        </h2>
        <div className="center-screen">
            <h1 className="max-w-3xl">Modes</h1>
        </div>
        <h2 className="max-w-7xl text-center">
            Quick Play is the mode that a player can join or create a game to play with other random players.<br/ >
            Custom Game is the mode that requires login to create or join a private game with friends.<br/ >
            You can copy game code in the lobby to play with friends without login, too!<br/ > Enjoy!
        </h2>
        <style jsx>{`
            .center-screen {
                text-align: center;
            }
            body {
                background-color: rgb(38, 38, 38);
            }

            h2 {
                font-size: 25px;
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
