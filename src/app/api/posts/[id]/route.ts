import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, content, published } = await request.json();
  const updatedPost = await prisma.post.update({
    where: { id: parseInt(params.id) },
    data: { title, content, published },
  });
  return NextResponse.json(updatedPost);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ message: "Post deleted" });
}
