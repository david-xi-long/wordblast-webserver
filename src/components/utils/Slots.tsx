import { ReactElement, useEffect, useState } from 'react';
import { uid } from '../../scripts/utils/math';

type Slot<T> =
    | { uid: string; used: true; item: T }
    | { uid: string; used: false; item: undefined };

interface IProps<T> {
    items: T[];
    map: (item: T) => ReactElement<any, any>;
}

const Slots = <T extends { uid: string }>({ items, map }: IProps<T>) => {
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

        setSlots([...usedSlots, ...unusedSlots]);
    }, [items]);

    return (
        <div className="flex flex-wrap justify-center items-center gap-3">
            {slots.map((s) => (
                <div
                    key={s.uid}
                    className={`h-[6.75rem] w-64 p-1.5 pr-6 flex-shrink-0 flex flex-col justify-between rounded-md ${
                        s.used ? 'bg-neutral-800' : 'bg-neutral-900'
                    }`}
                >
                    {s.used && map(s.item)}
                </div>
            ))}
        </div>
    );
};

export default Slots;
