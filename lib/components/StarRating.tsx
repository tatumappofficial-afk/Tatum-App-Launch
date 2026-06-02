import React from 'react'
import { View } from 'react-native'
import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg'
import { colors } from '../theme'

export interface StarRatingProps {
  /** Rating value out of maxRating */
  rating: number
  maxRating?: number
  starCount?: number
  size?: number
  filledColor?: string
  emptyColor?: string
}

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

function Star({
  size,
  fill,
  filledColor,
  emptyColor,
}: {
  size: number
  fill: 'full' | 'half' | 'empty'
  filledColor: string
  emptyColor: string
}) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Empty star background */}
        <Path d={STAR_PATH} fill={emptyColor} />
        {/* Filled overlay */}
        {fill === 'full' && <Path d={STAR_PATH} fill={filledColor} />}
        {fill === 'half' && (
          <>
            <Defs>
              <ClipPath id="half">
                <Rect x="0" y="0" width="12" height="24" />
              </ClipPath>
            </Defs>
            <Path d={STAR_PATH} fill={filledColor} clipPath="url(#half)" />
          </>
        )}
      </Svg>
    </View>
  )
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 10,
  starCount = 5,
  size = 14,
  filledColor = colors.terra,
  emptyColor = colors.surface2,
}) => {
  // Convert to star scale: 8/10 → 4/5 stars
  const starValue = (rating / maxRating) * starCount
  // Round to nearest 0.5
  const rounded = Math.round(starValue * 2) / 2

  return (
    <View style={{ flexDirection: 'row', gap: size * 0.15 }}>
      {Array.from({ length: starCount }, (_, i) => {
        let fill: 'full' | 'half' | 'empty' = 'empty'
        if (i + 1 <= rounded) fill = 'full'
        else if (i + 0.5 <= rounded) fill = 'half'
        return <Star key={i} size={size} fill={fill} filledColor={filledColor} emptyColor={emptyColor} />
      })}
    </View>
  )
}
