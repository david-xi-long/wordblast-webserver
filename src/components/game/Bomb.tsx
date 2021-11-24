import { FunctionComponent } from 'react';
import Image from 'next/image';
import BombImage from '../../../public/Bomb.png';
import Arrow from '../../../public/arrow.png';

const Bomb: FunctionComponent<{
    deg: number;
    combo: string;
    timeLeft: number;
}> = ({ deg, combo, timeLeft }) => (
    <div className="relative flex justify-center items-center bomb-animation">
        <div
            className="absolute"
            style={{
                transform: `rotate(${deg}deg)`,
            }}
        >
            <Image src={Arrow} height={300} width={30} />
        </div>

        <div className="absolute bomb">
            <Image src={BombImage} height={200} width={200} />
            <p className="innerCenter">{combo}</p>
            <p>Time Left: {timeLeft}</p>
        </div>
    </div>
);

export default Bomb;
