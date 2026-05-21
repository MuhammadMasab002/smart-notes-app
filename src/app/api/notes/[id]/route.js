import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  validateId,
  validateTitle,
  validateContent,
  sanitizeNoteInput,
} from "@/lib/validations";

async function resolveParams(params) {
  return await Promise.resolve(params);
}

export async function GET(request, { params }) {
  try {
    const resolvedParams = await resolveParams(params);
    const idValidation = validateId(resolvedParams?.id);

    if (!idValidation.valid) {
      return NextResponse.json(
        { error: idValidation.error },
        { status: 400 }
      );
    }

    const id = idValidation.parsed;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await resolveParams(params);
    const idValidation = validateId(resolvedParams?.id);

    if (!idValidation.valid) {
      return NextResponse.json(
        { error: idValidation.error },
        { status: 400 }
      );
    }

    const id = idValidation.parsed;

    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = {};
    const { title, content } = body;
    const cleanData = sanitizeNoteInput(title ?? "", content ?? "", body.pinned);

    if (title !== undefined) {
      const titleValidation = validateTitle(title);

      if (!titleValidation.valid) {
        return NextResponse.json(
          { error: titleValidation.error },
          { status: 400 }
        );
      }

      data.title = cleanData.title;
    }

    if (content !== undefined) {
      const contentValidation = validateContent(content);

      if (!contentValidation.valid) {
        return NextResponse.json(
          { error: contentValidation.error },
          { status: 400 }
        );
      }

      data.content = cleanData.content;
    }

    if (body.pinned !== undefined) {
      data.pinned = Boolean(body.pinned);
    }

    const note = await prisma.note.update({
      where: { id },
      data,
    });

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await resolveParams(params);
    const idValidation = validateId(resolvedParams?.id);

    if (!idValidation.valid) {
      return NextResponse.json(
        { error: idValidation.error },
        { status: 400 }
      );
    }

    const id = idValidation.parsed;

    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete note" },
      { status: 500 }
    );
  }
}