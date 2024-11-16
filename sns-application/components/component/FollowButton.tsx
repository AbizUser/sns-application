import React from 'react'
import { Button } from '../ui/button'


interface FollowButtonProps {
  isCurrentUser: boolean;
  isFollowing: boolean;
}

const FollowButton = ({isCurrentUser, isFollowing}: FollowButtonProps) => {

  const getButtonContent = () => {
    if (isCurrentUser) {
      return "プロフィール編集";
    }
    if (isFollowing) {
      return "フォロー中";
    }
    return "フォローする"
  }

  const getButtonVariant = () => {
    if (isCurrentUser) {
      return "outline";
    }

    if (isFollowing) {
      return "secondary";
    }

    return "default";
  }

  return (
    <div>
      <Button variant={getButtonVariant()} className="w-full">{getButtonContent()}</Button>
    </div>
  )
}

export default FollowButton
