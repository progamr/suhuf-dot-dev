import ReactSkeleton, { SkeletonProps as ReactSkeletonProps } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonProps extends ReactSkeletonProps {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={className}>
      <ReactSkeleton {...props} />
    </div>
  );
}
