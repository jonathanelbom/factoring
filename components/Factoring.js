import React, {useReducer, useRef, useEffect, Fragment} from 'react';
import classnames from 'classnames';

import DropZone from '../components/DropZone';
import {primes, getFactors, makeId} from '../pages/index';

import styles from './Factoring.module.scss'

const computeOffset = ({elem, index}) => index < 1 ? 0 : elem.current.clientWidth / 2 + 30; // line width is 30px
const computeTotalOffsetStyle = ({levels, index}) => levels.slice(0, index + 1).reduce((acc, cur) => acc + (cur.offset || 0), 0);
const initState = (state) => {
    const factors = getFactors(primes);
    return {
        factors,
        factored: [],
        remaining: [...factors],
        levels: [],
    };
}

export default function Factoring() {
    const [state, setState] = useReducer((oldState, newState) => ({
        ...oldState, ...newState
    }), {}, initState);
    const rejectDrop = ({prime, factors, id}) => {};
    const acceptDrop = ({prime, factors, elem, id, index}) => {
        const offset = computeOffset({elem, index: index + 1});
        setState({
            levels: [
                ...state.levels,
                {
                    id: makeId(),
                    prime,
                    factors,
                    elem,
                    offset,
                },
            ],
        });
    }
    const {levels} = state;
    return (
        <div className={styles.Factoring}>
            <DropZone
                factors={state.factors}
                acceptDrop={acceptDrop}
                rejectDrop={acceptDrop}
                active={state.levels.length < 1}
                index={-1}
            />
            {levels.map(({prime, factors, elem, id, offset}, index) => {
                const totalOffset = computeTotalOffsetStyle({levels, index});
                return (
                    <div
                        className={classnames(styles.level)}
                        key={`level-${index}`}
                        style={{
                            transform: `translateX(${totalOffset}px)`
                        }}
                    >
                        <div className={classnames(styles.lines)}>
                            <div className={classnames(styles.factored_line, 'line', 'line--left')} />
                            <div className={classnames(styles.factored_line, 'line', 'line--right')} />
                        </div>
                        <div className={classnames(styles.values)}>
                            <div className={classnames(styles.factored, styles.factored_left)}>
                                <div className={styles.prime}>{prime}</div>
                            </div>
                            <div className={classnames(styles.factored, styles.factored_right)}>
                                {factors.length <= 1 && (
                                    <div className={styles.prime}>{factors[0]}</div>
                                )}
                                {factors.length > 1 && (
                                    <DropZone
                                        index={index}
                                        active={index === levels.length - 1}
                                        factors={factors}
                                        acceptDrop={acceptDrop}
                                        rejectDrop={acceptDrop}
                                        id={id}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}