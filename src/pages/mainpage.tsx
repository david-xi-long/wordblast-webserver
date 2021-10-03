import {useState, useEffect} from 'react';

function MainPage() {
    const [displayName, setDisplayName] = useState('');

    //sign in the user. should store the player's username and session ID to the backend and database
    const signIn = () => {
        console.log("Authenticating User", displayName);
    }
    
    //handle pressing 'enter' to enter game
    const submitForm = (e) => {
        if (e.keyCode === 13) {
            signIn()
        }
    }
    return (
    <div>
        <div className="mainpage">
            <code style={{fontSize: '48px'}}>wordblast.io</code>
            <br/>
            <code>enter your username and hit 'enter' to play!</code>
            <br/>
            <input className="username" placeholder="Enter a username..." onKeyDown={(e) => submitForm(e)} value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>
            <br/>
            <div className="row">
                <button className="login-button" onClick={signIn}>play</button>
                <button className="login-button" onClick={signIn}>play with friends</button>
            </div>
        </div>
        
    </div>
    )
}

export default MainPage;