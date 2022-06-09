import React from 'react';
import styled from 'styled-components'

const Error = styled.div`
  font-size: 14px;
  font-weight: 600;
  background: ${props => props.type === 'primary' ? '#e5e5e51f' : ''};
  color: ${props => props.type === 'primary' ? 'white' : 'red'};
  padding: ${props => props.type === 'primary' ? '20px' : '0'};
  border-radius: ${props => props.type === 'primary' ? '10px' : '0'};
  margin-top: ${props => props.type === 'primary' ? '30px' : '10px'};
`

const ErrorMessage = ({text, type}) => {
  return <Error type={type}>{text}</Error>
};

export default ErrorMessage;
