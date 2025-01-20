import './App.css';
import { Connection } from '@solana/web3.js';
import { Dashboard } from './components/Dashboard';
import { get_pools } from './sdk/utils/utils';
import { useEffect, useState } from 'react';
import { 
    ConnectionContext, 
    ErrorContext, 
    PoolsContext, 
    PositionsContext, 
    PriceContext
} from './contexts/Contexts';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {

    const DEFAULT_RPC = process.env.REACT_APP_RPC || 'https://solana-rpc.publicnode.com'; // Replace with a valid default RPC URL
    const DEFAULT_BIRDEYE_KEY = process.env.REACT_APP_API_KEY || 'fbb974cbcf6b4f93b9cf15bbe24033e7'; // Replace with a default API key if needed

    const [rpc, setRpc] = useState(DEFAULT_RPC);
    const [apiKey, setApiKey] = useState(DEFAULT_BIRDEYE_KEY);
    const [connection, setConnection] = useState(() => new Connection(DEFAULT_RPC));
    const [openPositions, setOpenPositions] = useState([]);
    const [openSortedPositions, setOpenSortedPositions] = useState([]);
    const [closedPositions, setClosedPositions] = useState([]);
    const [closedSortedPositions, setClosedSortedPositions] = useState([]);
    const [disabledPools, setDisabledPools] = useState([]);
    const [pools, setPools] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [usedTokensList, setUsedTokensList] = useState([]);
    const [tokenPrices, setTokenPrices] = useState({});
    const [error, setError] = useState(undefined);

    useEffect(() => {
        const getPools = async () => {
            try {
                const pls = await get_pools(connection);
                const tkns = await (await fetch('https://token.jup.ag/all')).json();
                setPools(pls);
                setTokens(tkns);
            } catch (err) {
                console.error('Error fetching pools or tokens:', err);
                setError(err.message);
            }
        };
        getPools();
    }, [connection]);

    useEffect(() => {
        setConnection(new Connection(rpc));
    }, [rpc]);

    return (
        <ConnectionContext.Provider value={{
            rpc, 
            setRpc, 
            apiKey, 
            setApiKey, 
            connection
        }}>   
            <PoolsContext.Provider value={{
                pools, 
                tokens, 
                disabledPools, 
                setDisabledPools
            }}>
                <PositionsContext.Provider value={{
                    openPositions, 
                    closedPositions, 
                    setClosedPositions, 
                    setOpenPositions,
                    openSortedPositions,
                    setOpenSortedPositions,
                    closedSortedPositions,
                    setClosedSortedPositions
                }}>
                    <PriceContext.Provider value={{tokenPrices, setTokenPrices}}>
                        <ErrorContext.Provider value={{error, setError}}>
                            <div className="App">
                                <Header />
                                <Dashboard />
                                <Footer />
                            </div>
                        </ErrorContext.Provider>
                    </PriceContext.Provider>
                </PositionsContext.Provider>
            </PoolsContext.Provider>
        </ConnectionContext.Provider>
    );
}

export default App;
