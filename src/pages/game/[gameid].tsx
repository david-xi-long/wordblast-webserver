import {useRouter} from 'next/router'

function Game() {
    const router = useRouter();
    // stores the gameID
    // add code to verify that the game exists
    
    // let gameID = router.query.gameid

    return (
        <div className="flex-container">
            <div className="game">
                Game UI goes here
            </div>
            <div className="chatbox">
                Chat here
            </div>
        </div>
    
    )
}
export default Game;
