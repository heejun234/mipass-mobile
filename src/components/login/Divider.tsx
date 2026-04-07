/**
 * @author 신희준
 *
 * @description 세로/가로 구분선
 *
 * @param orientation - 구분선 방향 ('vertical' | 'horizontal', 기본값: 'vertical')
 * @param size - 구분선 크기 (세로일 때는 높이, 가로일 때는 너비, 기본값: 1)
 * @param className - 추가 CSS 클래스
 */

import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'vertical' | 'horizontal';
  size?: string | number;
  className?: string;
}

const Divider = ({ orientation = 'vertical', size = 1, className }: DividerProps) => {
  const isVertical = orientation === 'vertical';

  // className에 width/height 관련 클래스가 있으면 size를 무시
  const hasWidthClass = className?.includes('w-');
  const hasHeightClass = className?.includes('h-');

  const style = isVertical ? (hasHeightClass ? {} : { height: `${size}rem` }) : hasWidthClass ? {} : { width: `${size}rem` };

  const baseClasses = isVertical ? 'w-px bg-neutral-300' : 'h-px bg-neutral-300';

  return <div className={cn(baseClasses, className)} style={style} />;
};

export default Divider;
