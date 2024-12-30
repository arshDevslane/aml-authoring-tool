import React from 'react';

type Props = {
  userId?: string;
  username?: string;
};

const Header: React.FC<Props> = () => (
  <div className='py-4 w-[70px] border-r-[1px] border-black items-center flex flex-col justify-between'>
    <div className='flex gap-4 items-center'>
      <img
        src='/assets/logo.svg'
        alt='logo'
        className='h-[60px] w-[60px] rounded-full'
      />
    </div>
  </div>
);

export default Header;
