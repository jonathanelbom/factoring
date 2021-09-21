import {useReducer, useRef} from 'react';
import classnames from 'classnames';

import {computeValue, filterOutFirst} from './utils';

import styles from './DropZone.module.scss'

export default function DropZone({factors, id, acceptDrop, rejectDrop, active, index}) {
    const [state, setState] = useReducer((oldState, newState) => ({
        ...oldState, ...newState
    }), {
        over: false,
        shake: false,
        shakeKey: 0,
        bounce: false,
        bounceKey: 0,
    });
    const elem = useRef(null);
    const onDragOver = (e) => {
        e.preventDefault();
        setState({over: true});
    };
    const onDragLeave = (e) => {
        e.preventDefault();
        setState({over: false});
    };
    const onDrop = (e) => {
        const value = e.dataTransfer.getData('text/plain');
        const parsedValue = parseInt(value, 10);
        let validDrop = false;
        if (!isNaN(parsedValue)) {
            if (factors.indexOf(parsedValue) > -1) {
                validDrop = true;
                acceptDrop({
                    id,
                    elem,
                    prime: parsedValue,
                    factors: filterOutFirst({
                        list: factors,
                        match: parsedValue,
                    }),
                    index
                });
            } else {

            }
        }
        setState({
            over: false,
            shake: !validDrop,
            bounce: validDrop,
            ...(!validDrop && {shakeKey: state.shakeKey + 1}),
            ...(validDrop && {bounceKey: state.bounceKey + 1})
        });
    };
    const className = classnames(styles.DropZone, {
        [styles.DropZone_over]: state.over,
        [styles.DropZone_rejected]: state.shake,
        [styles.DropZone_accepted]: state.bounce
    });
    const callbacks = active ? {onDragOver, onDragLeave, onDrop} : {};
    return (
        <div
            className={className}
            ref={elem}
            {...callbacks}
            key={`shake-${state.shakeKey}-${state.bounceKey}-`}
        >
            {computeValue(factors)}
        </div>
    )
}