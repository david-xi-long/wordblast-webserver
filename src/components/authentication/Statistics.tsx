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
    const [level, setLevel] = useState(0);
    
    const callStatsEndpoint = async () => {
        if (userUid !== undefined) {
        const response = await fetch('http://localhost:8080/api/user/statistics', {
            method: 'POST',
            body: new URLSearchParams({
                Uid: userUid!
            }),
            credentials: 'include',
        });
        const json = await response.json()
            .then(data => {
                setGamesPlayed(data.GamesPlayed);
                setWPM(data.WPM);
                setExperience(data.Experience);
                setTotalWords(data.TotalWords);
                setLevel(data.Level);
            });
        }
        setIsLoading(false);
        const element = document.getElementById("stats");
        if (element!== null) {
            element.style.visibility = "visible";
        }
    }
    
    const hideStats = () => {
        const element = document.getElementById("stats");
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
        <div className='px-3.5 pr-4 py-2.5 bg-neutral-900 ring-1 ring-neutral-800 rounded-md items-center' id = "stats" style={{
            visibility: 'visible',
            position: 'absolute',
            outline: '5px solid darkgrey',
            right: '4%',
            top: '4%'
            }}>
            <div className="text-2xl tracking-wide space-y-1" >
                <div> Total Games Played: {gamesPlayed} </div>
                <div> Total Valid Words: {totalWords} </div>
                <div> Words Per Minute: {WPM} </div>
                <div> Experience: {experience} </div>
                <div> Level: {level} </div>
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