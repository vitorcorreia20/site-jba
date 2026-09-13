import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.mestreConselheiro.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
