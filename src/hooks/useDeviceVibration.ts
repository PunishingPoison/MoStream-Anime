const useDeviceVibration = () => {
  const startVibration = (pattern: number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return { startVibration };
};

export default useDeviceVibration;
