import { FunctionComponent } from 'react';
import Image from 'next/image';
import BombImage from '../../../public/Bomb.png';
import Arrow from '../../../public/arrow.png';

const Bomb: FunctionComponent<{
    deg: number;
    combo: string;
}> = ({ deg, combo }) => (
    <div style={{
        cursor: 'none',
        pointerEvents: 'none'
    }} className="relative flex justify-center items-center bomb-animation">
        <div
            className="absolute"
            style={{
                transform: `rotate(${deg}deg)`,
            }}
        >
            <Image src={Arrow} height={225} width={30} />
        </div>

        <div className="absolute bomb">
            <Image src={BombImage} height={115} width={115} />
            <p className="innerCenter font-bold">{combo}</p>
        </div>
    </div>
);

export default Bomb;
