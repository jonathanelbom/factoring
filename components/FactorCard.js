import React, { useContext } from 'react';
import { Context } from '../pages';
import styles from './FactorCard.module.scss';
import Factoring from './Factoring';

export default function FactorCard({id, input, sourceFactors}) {
    const {state, dispatch} = useContext(Context);
    const onInputChange = (e) => {
		const value = e.target.value;
        if (value === '' || !isNaN(parseFloat(value))) {
			dispatch({
                type: 'SET_INPUT',
                value: {
                    id,
                    input: value
                }
            })
		}
	}
	const onInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            dispatch({
                type: 'SET_SOURCE_FACTORS',
                value: {
                    id,
                    input: e.target.value
                }
            });
            return true;
        }
        const allowedKeys = ['ArrowRight', 'ArrowLeft', 'Backspace'];
		if (isNaN(parseFloat(e.key)) && !allowedKeys.some((key) => key === e.key)) {
			e.stopPropagation();
			e.preventDefault();
		}
	}
    
    return (
        <div className={styles.root}>
            <div className={styles.input_controls}>
                <input
                    className={styles.number_input}
                    placeholder="Enter a number here"
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown}
                />
                <button
                    className="btn"
                    disabled={!input}
                    onClick={() => {
                        dispatch({
                            type: 'SET_SOURCE_FACTORS',
                            value: {
                                id,
                                input
                            }
                        })
                    }}
                >
                    {'Go'}
                </button>
            </div>
            {sourceFactors.length > 0 && (
                <Factoring factors={sourceFactors} />
            )}
            {sourceFactors.length < 1 && (
                <ol className={styles.factor_wrapper}>
                    <li>{'Enter a number above.'}</li>
                    <li>{'Click the "Go" button.'}</li>
                    <li> {'Drag the blue prime factor tokens on the number to factor it.'}</li>
                </ol>
            )}
        </div>
	);
}
