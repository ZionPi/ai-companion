import React, { useState, useEffect } from 'react';

const OnlineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const statusStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isOnline ? 'green' : 'gray',
    display: 'inline-block',
    marginLeft: '5px',
    
  };

  return (
    <div className='text-xs mt-2 ml-1'>
      {isOnline ? '在线' : '离线'}
      <span  style={statusStyle} />
    </div>
  );
};

export default OnlineStatusIndicator;
