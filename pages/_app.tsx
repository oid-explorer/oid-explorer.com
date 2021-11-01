import type {AppProps} from 'next/app'
import Head from "next/head";

import Header from "../components/header"
import Footer from "../components/footer"
import '../styles/globals.css'

export default function MyApp({Component, pageProps}: AppProps) {
    return (
        <div className={"relative min-h-screen"}>
            <Head>
                <title>OID Explorer</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header/>
            <div className={"pb-24"}>
                <Component {...pageProps} />
            </div>
            <Footer/>
        </div>
    )
}
