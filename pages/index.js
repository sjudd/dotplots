import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Profile from '../components/profile.js';
import DotPlot from '../components/DotPlot.js';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dot Plot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DotPlot />
      </main>
    </div>
  )
}
