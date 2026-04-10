import React from 'react'
import { colors } from '../theme'

export interface StarRatingProps {
  percent: number
  starCount?: number
  size?: number
}

export const StarRating: React.FC<StarRatingProps> = ({
  percent,
  starCount = 5,
  size = 11,
}) => {
  const stars = '\u2605'.repeat(starCount)

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      fontSize: size,
      letterSpacing: 1,
      lineHeight: 1,
    }}>
      <div style={{ color: colors.surface2 }}>{stars}</div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        color: colors.terra,
        whiteSpace: 'nowrap',
        width: `${percent}%`,
      }}>{stars}</div>
    </div>
  )
}
