import { ReactElement, useEffect, useState } from 'react';
import { uid } from '../../scripts/utils/math';

type Slot<T> =
    | { uid: string; used: true; item: T }
    | { uid: string; used: false; item: undefined };

interface IProps<T> {
    middle: ReactElement<any, any>;
    items: T[];
    map: (item: T) => ReactElement<any, any>;
}

const CircleSlots = <T extends { uid: string }>({
    middle,
    items,
    map,
}: IProps<T>) => {
    const [slots, setSlots] = useState<Slot<T>[]>([]);

    useEffect(() => {
        const usedSlots: Slot<T>[] = items.map((i) => ({
            uid: i.uid,
            used: true,
            item: i,
        }));

        const unusedSlots: Slot<T>[] = Array(8 - usedSlots.length)
            .fill(0)
            .map(() => ({
                uid: uid(),
                used: false,
                item: undefined,
            }));

        usedSlots.splice(4, 0, { uid: uid(), used: false, item: undefined });

        setSlots([...usedSlots, ...unusedSlots]);
    }, [items]);

    return (
        <div className="grid grid-cols-3 gap-20">
            {slots.map((s, i) => {
                let backgroundColor = s.used
                    ? 'bg-neutral-700'
                    : 'bg-neutral-800';
                backgroundColor = i === 4 ? 'bg-transparent' : backgroundColor;

                return (
                    <div
                        key={s.uid}
                        className={`h-32 w-32 flex justify-center items-center ${backgroundColor}`}
                    >
                        {i === 4 && middle}
                        {i !== 4 && s.used && map(s.item)}
                    </div>
                );
            })}
        </div>
    );
};

export default CircleSlots;
