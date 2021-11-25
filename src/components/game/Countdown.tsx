import { FunctionComponent, useEffect, useState } from 'react';
import { Progress } from '@mantine/core';
import { RoundInfo } from '../../types';

const Countdown: FunctionComponent<{ roundInfo: RoundInfo }> = ({
    roundInfo,
}) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        setTimeLeft(Math.ceil(roundInfo.timeRemaining / 1000));

        const intervalId = setInterval(() => {
            setTimeLeft((curTimeLeft) => curTimeLeft - 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [roundInfo]);

    return (
        <div className="w-full">
            <div
                className="mb-2 text-right"
                style={{
                    width: `calc(${(timeLeft / roundInfo.turnLength) * 100}%)`,
                    transition: '100ms ease',
                }}
            >
                <p className="text-2xl font-bold">{timeLeft}</p>
            </div>
            <Progress
                className="w-full"
                color="red"
                value={(timeLeft / roundInfo.turnLength) * 100}
            />
        </div>
    );
};

export default Countdown;
