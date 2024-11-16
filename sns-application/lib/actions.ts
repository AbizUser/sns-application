"use server"; //サーバーで実行する関数にはuse serverを付与することで使用可能になる。
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

type State = {
  error?: string | undefined;
  success: boolean;
}

export async function addPostAction(prevState: State, formData: FormData): Promise<State> {

  try {
    const { userId } = auth()

    if (!userId) {
      return { error: "ユーザーが存在しません。", success: false };
    }

    const postText = formData.get("post") as string;
    const postTextSchema = z

    .string()
    .min(1, "ポスト内容を入力してください。",)
    .max(140, "140文字以内で入力してください。");

    const valudatePostText = postTextSchema.parse(postText);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    //フォームボタンが押下されてから1秒待機

    await prisma.post.create({
      data: {
        content: valudatePostText,
        authorId: userId,
      },
    });

    revalidatePath("/"); //再検証を行う
    // revalidateTag　//再検証の詳細を指定したい場合にはこちらを指定。

    return {
      error: undefined,
      success: true,
    }

  } catch (error) {
    if (error instanceof z.ZodError ) {
      return {
        error: error.errors.map((e) => e.message).join(", "),
        success: false,
      };
    } else if (error instanceof Error) {
      return {
        error: error.message,
        success: false,
      }
    } else {
      return {
        error: "予期せぬエラーが発生しました。",
        success: false,
      }
    }
  }
}

export const likeAction = async (postId: string) => {
  const { userId } = auth();

  if(!userId) {
    throw new Error("User is not authenticated");
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      revalidatePath("/");
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        }
      })
      revalidatePath("/");
    }
  } catch (err) {
    console.log(err)
  }
}


export const followAction = async (userId) => {
  const { userId: currentUserId } = auth();

  if(!currentUserId) {
    throw new Error("User is not authenticated");
  }

  try {
    //unfollow
    const existingFollow = await prisma.like.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      }
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId:{
            followerId: currentUserId,
            followingId: userId
          }
        },
      });

    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        }
      })
    }
    revalidatePath(`profile/${userId}`);
  } catch (err) {
    console.log(err)
  }
}