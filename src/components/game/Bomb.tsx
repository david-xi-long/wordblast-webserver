import { FunctionComponent } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import BombImage from '../../../public/Bomb.png';
import Arrow from '../../../public/arrow.png';

const Bomb: FunctionComponent<{
    deg: number;
    combo: string;
}> = ({ deg, combo }) => {
    const largeSlots = useMediaQuery({ query: '(min-width: 650px)' });

    return (
        <div
            style={{
                cursor: 'none',
                pointerEvents: 'none',
            }}
            className="relative flex justify-center items-center bomb-animation"
        >
            <div
                className="absolute"
                style={{
                    transform: `rotate(${deg}deg)`,
                }}
            >
                <Image
                    src={Arrow}
                    height={largeSlots ? 225 : 160}
                    width={largeSlots ? 30 : 25}
                />
            </div>

            <div className="absolute bomb">
                <Image
                    src={BombImage}
                    height={largeSlots ? 115 : 100}
                    width={largeSlots ? 115 : 100}
                />
                <p className="innerCenter font-bold">{combo}</p>
            </div>
        </div>
    );
};

export default Bomb;
