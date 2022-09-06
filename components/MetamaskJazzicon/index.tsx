import React, {useEffect} from "react";
import './index.css'
import {useWeb3React} from "@web3-react/core";
// @ts-ignore
import jazzicon from 'jazzicon';


// CONSTANTS

// DEFAULT FUNCTIONS


const MetamaskJazzicon = () => {
    const {account} = useWeb3React()
    const avatarRef = React.createRef<HTMLDivElement>()
    useEffect(() => {
        const element = avatarRef.current;
        if (element && account) {
            const addr = account.slice(2, 10);
            const seed = parseInt(addr, 16);
            const icon = jazzicon(30, seed);
            if (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(icon);
        }
    }, [account, avatarRef]);

    return <div style={{height: 30, width: 30, transform: 'translateZ(0)'}} ref={avatarRef} />;
};

export default MetamaskJazzicon