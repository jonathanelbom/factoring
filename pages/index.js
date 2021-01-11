import Head from 'next/head';
import {useReducer, useRef, useEffect} from 'react';
import classnames from 'classnames';
import Factoring from '../components/Factoring';
import Dragger from '../components/Dragger';
import styles from './App.module.scss'

export const primesLong = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
// export const primes = [2, 3, 5, 7, 11, 13, 17]; //, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73];
export const makeId = () => `id-${Math.random().toString(16).slice(2)}`;
export const makeRandomFactors = (primes) => new Array(2 + Math.ceil(Math.random() * 4)).fill('').map((index) => (primes[Math.floor(Math.random() * primes.length)]));
export const computeValue = (a) => a.reduce((acc, cur) => acc * cur, 1);
export const filterOutFirst = ({list, match}) => {
    let found = false;
    return list.filter((value) => {
        const doesMatch = !found && value === match;
        if (doesMatch) {
            found = true;
        }
        return !doesMatch;
    });
}
export const getFactors = (value) => {
	const originalValue = value;
	const factors = [];
	let activeIndex = 0;
	let cycle = 0;
	while (primesLong.indexOf(value) === -1 && cycle <= primesLong.length) {
		for (var i = 0; i < primesLong.length; i++) {
			const prime = primesLong[i];
			const dividend = value / prime;
			if (dividend === Math.floor(dividend)) {
				activeIndex = i;
				factors.push(prime);
				value = dividend;
				break;
			}
		}
		cycle++;
	}
	factors.push(value);
	return factors;
}
const initNumPrimes = 7;
export default function App() {
	const [state, setState] = useReducer((oldState, newState) => {
		let updatedState = {...oldState, ...newState};
		return updatedState;
	}, {
		input: '',
		numPrimes: initNumPrimes,
		numRandomPrimes: initNumPrimes,
		numInputPrimes: 0,
		primes: primesLong.slice(0, initNumPrimes),
		sourceFactors: [],
		headerPadding: 104,
	});
	const prevHeightCount = useRef(0);
	const headerElem = useRef(null);
	const onInputChange = (e) => {
		const value = e.target.value;
		if (!isNaN(parseFloat(value))) {
			setState({input: value})
		}
	}
	const onInputKeyDown = (e) => {
		if (isNaN(parseFloat(e.key))) {
			e.stopPropagation();
			e.preventDefault();
		}
	}
	const useRandomNumber = () => {
		setState({
			sourceFactors: makeRandomFactors(primesLong.slice(0, state.numPrimes)),
			numPrimes: state.numRandomPrimes
		});
	}
	const useInputNumber = () => {
		const factors = getFactors(parseInt(state.input), 10);
		const lastFactor = factors[factors.length - 1];
		const numInputPrimes = primesLong.indexOf(lastFactor);
		if (numInputPrimes < 0) {
			setState({
				input: ''
			});
			alert(`\nUh Oh!\n\nFactorTHAT cannot factor numbers with a prime factors above 1000.\n\n${state.input} has been factored as far as:\n[${factors.join(', ')}]`)
		} else {
			setState({
				sourceFactors: factors,
				numPrimes: numInputPrimes,
				input: ''
			});
			requestAnimationFrame(() =>{
				updatePadding();
			});
		}
	}
	const showHelp = () => {
		setState({sourceFactors: []});
	}
	const lessTokens = () => changeTokens(false);
	const moreTokens = () => changeTokens(true);
	const changeTokens = (add) => {
		let newNumPrimes = add 
			? state.numRandomPrimes + 1
			: state.numRandomPrimes - 1
		newNumPrimes = Math.min(Math.max(newNumPrimes, 7), primesLong.length);
		if (newNumPrimes !== state.numRandomPrimes) {
			setState({
				numRandomPrimes: newNumPrimes,
				numPrimes: newNumPrimes,
			});
			requestAnimationFrame(() =>{
				updatePadding();
			});
		}
	}
	const updatePadding = () => {
		if (headerElem.current) {
			const headerPadding = headerElem.current.clientHeight;
			if (headerPadding !== state.headerPadding) {
				setState({headerPadding});
			}
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', updatePadding);
		}
		return () => {
			window.removeEventListener('resize', updatePadding);
		};
	}, []);
	console.log('state.sourceFactors:', state.sourceFactors);
  return (
    <div className={styles.App}>
    	<Head>
        	<title>FactorTHAT</title>
        	<link rel="icon" href="/favicon.ico" />
      	</Head>
		<header className={styles.header} ref={headerElem}>
			<div className={styles.header_primary}>
				<div className={styles.logo}>
					<span>{'Factor'}</span>
					<span>{'THAT'}</span>
				</div>
				<div className={styles.primary_controls}>
					<div className={styles.input_group}>
						<input
							className={classnames(styles.number_input)}
							placeholder="Type a number here"
							value={state.input}
							onChange={onInputChange}
							onKeyDown={onInputKeyDown}
						/>
						<button
							className={classnames('btn')}
							onClick={useInputNumber}
							disabled={!state.input}
						>
							{'Use this number'}
						</button>
					</div>
					<button
						className={classnames(styles.random_btn, 'btn')}
						onClick={useRandomNumber}
					>
						{'Use a random number'}
					</button>
					<button
						className={classnames(styles.help_btn, 'btn')}
						onClick={showHelp}
					>
						{'?'}
					</button>
				</div>
			</div>
			<div className={styles.header_secondary}>
				<div className={styles.draggers_title}>{'Prime factors'}</div>
				<div className={styles.draggers}>
					{primesLong.slice(0, state.numPrimes).map((prime, index) => (
						<Dragger key={`dragger-${index}`} value={prime} />
					))}
				</div>
				<div className={styles.draggers_more_less}>
					<button className={classnames('btn')} onClick={lessTokens} disabled={state.numPrimes <= 7} >{'Less'}</button>
					<button className={classnames('btn')} onClick={moreTokens} disabled={state.numPrimes > primesLong.length} >{'More'}</button>
				</div>
			</div>

		</header>
      	<main
		  	className={styles.main}
			  style={{
				paddingTop: `${state.headerPadding}px`
			  }}
		>
		  	{state.sourceFactors.length < 1 && (
				<div className={styles.instructions}>
					<p>{'Welcome to FactorTHAT, an online tool to help you practice factoring.'}</p>
					<ul>
						<li>{'Use the controls in the top right to enter your own number to factor or to generate a random number to factor.'}</li>
						<li>{'Drag the prime factor tokens onto the number to factor it.'}</li>
						<li>{'Use the less and more buttons to increase or decrease the prime factor tokens that are available to use.'}</li>
					</ul>
					<p>{'Ready? Click on a button in the top right to get started!'}</p>

				</div>
			)}
			{state.sourceFactors.length > 1 && (
				<div className={styles.factor_wrapper}>
					<div className="title">{'(Drag prime factor tokens on the number below to factor it)'}</div>
					<Factoring factors={state.sourceFactors} key={`factoring-${state.sourceFactors.join('-')}`} />
				</div>
			)}
      	</main>
    </div>
  )
}
