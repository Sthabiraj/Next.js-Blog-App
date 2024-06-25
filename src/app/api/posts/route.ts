import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, content, authorId } = await request.json();
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  });
  return NextResponse.json(post);
}
