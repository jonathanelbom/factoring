import Head from 'next/head';
import {useReducer, useRef, useEffect, useContext} from 'react';
import classnames from 'classnames';
import Factoring from '../components/Factoring';
import Dragger from '../components/Dragger';
import { Context } from '../pages';
import styles from './FactorThat.module.scss'
import FactorCard from './FactorCard';

export default function FactorThat() {
    const {state, dispatch} = useContext(Context);
    const {primes, cards} = state;

	return (
		<div className={styles.App}>
			<Head>
				<title>FactorTHAT</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header className={styles.header}>
				<div className={styles.header_primary}>
					<div className={styles.logo}>
						<span>{'Factor'}</span>
						<span>{'THAT'}</span>
					</div>
				</div>
				<div className={styles.header_secondary}>
					<div className={styles.draggers_title}>{'Prime factors:'}</div>
					{primes.map((prime, index) => (
						<Dragger key={`dragger-${index}`} value={prime} />
					))}
				</div>

			</header>
			<main className={styles.main}>
                {cards.map((card) => <FactorCard key={card.id} {...card}/>)}
			</main>
		</div>
	);
}
