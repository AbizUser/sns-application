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