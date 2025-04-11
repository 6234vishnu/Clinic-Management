import { useEffect, useState } from 'react';
import '../assets/css/partials/tokenGenerateModal.css'
import Lottie from "lottie-react";
import tokenSpin from'../assets/animation/tokenSpin.lottie'


const AnimatedTokenModal = ({ token }) => {
    const [displayedToken, setDisplayedToken] = useState(0);
  
    useEffect(() => {
      let start = 0;
      const duration = 800;
      const increment = Math.ceil(token / 30);
      const interval = setInterval(() => {
        start += increment;
        if (start >= token) {
          start = token;
          clearInterval(interval);
        }
        setDisplayedToken(start);
      }, duration / 30);
      return () => clearInterval(interval);
    }, [token]);
  
    return (
      <div className="tokenGenerationRecep-tokenDisplay">
      <div className="tokenGenerationRecep-tokenSpin">
        <Lottie animationData={tokenSpin} loop={true} />
        <div className="tokenGenerationRecep-tokenNumber">{displayedToken}</div>
      </div>
    </div>
    );
  };
  
  export default AnimatedTokenModal