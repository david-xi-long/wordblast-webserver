import { FunctionComponent } from 'react';
import Image from 'next/image';
import BombImage from '../../../public/Bomb.png';
import Arrow from '../../../public/arrow.png';

const Bomb: FunctionComponent<{
    deg: number;
    combo: string;
}> = ({ deg, combo }) => (
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
            <p className="innerCenter font-bold">{combo}</p>
        </div>
    </div>
);

export default Bomb;
