import React from 'react';

const Header = ({from, to, currTo, currFrom}) => {
  return (
    <div className='bg-header'>
      <h1>Convert 1 {currFrom} to {currTo} - {from} to {to}</h1>
    </div>
  )
}

export default Header;