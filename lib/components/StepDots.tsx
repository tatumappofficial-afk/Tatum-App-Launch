import React from 'react'
import { colors } from '../theme'

export interface StepDotsProps {
  current: number
  total?: number
}

export const StepDots: React.FC<StepDotsProps> = ({ current, total = 4 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
    {Array.from({ length: total }, (_, i) => {
      const isDone = i < current
      const isActive = i === current
      return (
        <div
          key={i}
          style={{
            width: isActive ? 20 : 7,
            height: 7,
            borderRadius: isActive ? 4 : '50%',
            background: isActive
              ? colors.terra
              : isDone
                ? 'rgba(192,120,88,0.4)'
                : 'rgba(160,100,80,0.2)',
          }}
        />
      )
    })}
  </div>
)
