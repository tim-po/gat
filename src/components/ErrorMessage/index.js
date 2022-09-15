import React from 'react';
import styled from 'styled-components'

const Error = styled.div`
  font-size: 14px;
  font-weight: 600;
  width: max-content;
  margin: auto;
  border: 2px solid rgba(24, 24, 51, 0.1);
  background: ${props => props.type === 'primary' ? 'rgba(255,255,255,0.12)' : ''};
  color: ${props => props.type === 'primary' ? 'black' : 'red'};
  padding: ${props => props.type === 'primary' ? '20px' : '0'};
  border-radius: ${props => props.type === 'primary' ? '10px' : '0'};
  margin-top: ${props => props.type === 'primary' ? '30px' : '10px'};
`

const ErrorMessage = ({text, type}) => {
  return <Error type={type}>{text}</Error>
};

export default ErrorMessage;
