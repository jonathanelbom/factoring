import {useReducer, useRef} from 'react';
import classnames from 'classnames';

import {primes, computeValue, filterOutFirst} from '../pages/index';

import styles from './DropZone.module.scss'

export default function DropZone({factors, id, acceptDrop, rejectDrop, active, index}) {
    const [state, setState] = useReducer((oldState, newState) => ({...oldState, ...newState}), {over: false})
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
        if (!isNaN(parsedValue)) {
            // console.log('onDrop > parsedValue:', parsedValue);
            if (factors.indexOf(parsedValue) > -1) {
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
            }
        }
        setState({over: false});
    };
    const className = classnames(styles.DropZone, {
        [styles.DropZone_over]: state.over
    });
    const callbacks = active ? {onDragOver, onDragLeave, onDrop} : {};
    return (
        <div
            className={className}
            ref={elem}
            {...callbacks}
        >
            {computeValue(factors)}
        </div>
    )
}