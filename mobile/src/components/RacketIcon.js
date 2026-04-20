import React from 'react';
import Svg, { Path, Ellipse, Rect, G, Circle } from 'react-native-svg';

const RacketIcon = ({ size = 40, color = "#000" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Raquette de Badminton (Structure principale) */}
      <G transform="translate(-1, 2) rotate(-15, 10, 10)">
        {/* Tête (Cadre plus épais) */}
        <Ellipse cx="10" cy="7" rx="6" ry="6.5" />
        
        {/* Tamis (Mesh - Lignes très fines pour le contraste) */}
        <G opacity="0.4" strokeWidth="0.6">
          <Path d="M10 0.5v13" />
          <Path d="M7 1.5v11" />
          <Path d="M13 1.5v11" />
          <Path d="M4 4.5h12" />
          <Path d="M3.7 7h12.6" />
          <Path d="M4.5 9.5h11" />
        </G>
        
        {/* Tige (Shaft) */}
        <Path d="M10 13.5v6" />
        
        {/* Poignée (Handle) */}
        <Rect x="8.5" y="19.5" width="3" height="3" rx="0.5" fill={color} stroke="none" />
      </G>

      {/* Volant (Shuttlecock) - Positionné pour le mouvement */}
      <G transform="translate(18, 5) rotate(45)">
        {/* Plumes (Fan shape plus distincte) */}
        <Path 
          d="M0 0 L-3 -5 M0 0 L0 -6 M0 0 L3 -5" 
          strokeWidth="1.2" 
        />
        {/* Base des plumes */}
        <Path d="M-2.5 -4.5 Q0 -3 2.5 -4.5" strokeWidth="0.8" opacity="0.7" />
        
        {/* Bouchon (Cork - Plus gros et plein pour le contraste) */}
        <Circle cx="0" cy="0.5" r="1.8" fill={color} stroke="none" />
      </G>
    </Svg>
  );
};

export default RacketIcon;
