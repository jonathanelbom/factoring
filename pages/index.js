import React, {useReducer} from 'react';
import FactorThat from '../components/FactorThat';
import { primesLong, makeCard, getFactors } from '../components/utils';

const reducer = (state, action) => {
	const {type, value} = action;
	let {id, input} = value;
	let card;
	let newCards;
	switch (type) {
		case 'SET_INPUT':
			card = state.cards.find((card) => card.id === id);
			newCards = state.cards.filter((card) => card.id !== id);
			return {
				...state,
				cards: [
					...newCards,
					{
						...card,
						input,
						sourceFactors: [],
					},
				],
			};
		case 'SET_SOURCE_FACTORS':
			card = state.cards.find((card) => card.id === id);
			newCards = state.cards.filter((card) => card.id !== id);
			const sourceFactors = getFactors(parseInt(input), 10);
			console.log('sourceFactors:', sourceFactors);
			return {
				...state,
				cards: [
					...newCards,
					{
						...card,
						sourceFactors, 
					},
				],
			};
		default:
			return {
				...state
			}
	}
}

const initState = {
	cards: [makeCard()],
	primes: primesLong.slice(0, 20),
	// input: '',
	// numPrimes: initNumPrimes,
	// numRandomPrimes: initNumPrimes,
	// numInputPrimes: 0,
	// primes: primesLong.slice(0, initNumPrimes),
	// sourceFactors: [],
	// headerPadding: 104,
}

export const Context = React.createContext({});

export default function App() {
	const [state, dispatch] = useReducer(reducer, initState);
	return (
		<Context.Provider value={{state, dispatch}}>
			<FactorThat />
		</Context.Provider>
	);
}
