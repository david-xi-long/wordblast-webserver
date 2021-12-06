import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Button, Divider, TextInput } from '@mantine/core';
import { AuthenticationContext } from './Authentication';

const Statistics: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { userUid, setUserUid } = useContext(AuthenticationContext);
    const {isAuthenticated} = useContext(AuthenticationContext);
    const router = useRouter();

    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [experience, setExperience] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [WPM, setWPM] = useState(0);
    
    const callStatsEndpoint = async () => {
        if (userUid !== undefined) {
        const response = await fetch('http://localhost:8080/api/user/statistics', {
            method: 'POST',
            body: new URLSearchParams({
                Uid: userUid!
            }),
            credentials: 'include',
        });
        //const body = await response.text();
        const json = await response.json()
            .then(data => {
                setGamesPlayed(data.GamesPlayed);
                setWPM(data.WPM);
                setExperience(data.Experience);
                setTotalWords(data.TotalWords);
            });
        }
        setIsLoading(false);
        var element = document.getElementById("stats");
        if (element!== null) {
            element.style.visibility = "visible";
        }
    }
    
    const hideStats = () => {
        var element = document.getElementById("stats");
        if (element!== null) {
            element.style.visibility = "hidden";
        }
    }

    useEffect(() => {
        callStatsEndpoint();
    }, []);
    
    return (
        <div>
        { isAuthenticated && (
        <>
        <div id = "stats" style={{
            visibility: 'visible',
            position: 'absolute',
            backgroundColor: 'dimgrey',
            outline: '5px solid darkgrey',
            color: 'black',
            left: '50%',
            top: '37.5%'
            }}>
            <div className="text-2xl tracking-wide space-y-1" >
                Total Games Played: {gamesPlayed} <br></br>
                Total Valid Words: {totalWords} <br></br>
                Words Per Minute: {WPM} <br></br>
                Experience: {experience} <br></br>
            </div>
            <div className="mt-8 gap-8 flex justify-center">
                <Button
                    type="button"
                    size="md"
                    color="gray"
                    onClick={hideStats}
                >
                     Hide Stats
                </Button>
            </div>
        </div></>
        )}
        </div>
      );
};

export default Statistics;