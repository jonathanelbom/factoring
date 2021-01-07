import Head from 'next/head'
import Factoring from '../components/Factoring';
import Dragger from '../components/Dragger';
import styles from './App.module.scss'

export const primesLong = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
export const primes = [2, 3, 5, 7]; //, 11, 13, 17, 19, 23, 29];
export const makeId = () => `id-${Math.random().toString(16).slice(2)}`;
export const getFactors = (primes) => new Array(2 + Math.ceil(Math.random() * 4)).fill('').map((index) => (primes[Math.floor(Math.random() * primes.length)]));
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

export default function App() {
  return (
    <div className={styles.App}>
    	<Head>
        	<title>Create Next App</title>
        	<link rel="icon" href="/favicon.ico" />
      	</Head>
      	<main className={styles.main}>
		  	<div className={styles.draggers_section}>
				<div className={styles.draggers_title}>{'Factors:'}</div>
				<div className={styles.draggers}>
					{primes.map((prime, index) => (
						<Dragger key={`dragger-${index}`} value={prime} />
					))}
				</div>
			</div>
			<div className={styles.factor_wrapper}>
			  	<div className="title">{'Factor me:'}</div>
				<Factoring />
			</div>
      	</main>
    </div>
  )
}
