import { NextPage } from 'next';
import GameSocket from '../scripts/game/GameSocket';

const gameSocket = new GameSocket();

const Page: NextPage = () => (
    <div>
        <button type="button" onClick={gameSocket.connect}>
            Connect
        </button>
    </div>
);

export default Page;
