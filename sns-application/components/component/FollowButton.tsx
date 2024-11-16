import React from 'react'
import { Button } from '../ui/button'
import { followAction } from '@/lib/actions';


interface FollowButtonProps {
  isCurrentUser: boolean;
  isFollowing: boolean;
  userId: string
}

const FollowButton = ({isCurrentUser, isFollowing, userId}: FollowButtonProps) => {

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
    // サーバーのactionでデータを受け取る場合にはbind関数を取得する必要がある。
    <form action={followAction.bind(null, userId)}> 
      <Button variant={getButtonVariant()} className="w-full">
        {getButtonContent()}
      </Button>
    </form>
  )
}

export default FollowButton
