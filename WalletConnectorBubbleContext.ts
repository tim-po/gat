import React from 'react';

const WalletConnectorBubbleContext = React.createContext({ setBubbleValue: (newBubbleValue: string)=>{}, bubbleValue: "" });

export default WalletConnectorBubbleContext;
