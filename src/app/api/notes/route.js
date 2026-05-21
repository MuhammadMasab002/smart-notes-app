import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.trim();
        const pinned = searchParams.get("pinned");

        const where = {};

        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        if (pinned === "true") {
            where.pinned = true;
        }

        const notes = await prisma.note.findMany({
            where,
            orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
        });

        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch notes" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const content = typeof body.content === "string" ? body.content.trim() : "";

        if (!title) {
            return NextResponse.json(
                { error: "Title is required and cannot be empty." },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                { error: "Content is required and cannot be empty." },
                { status: 400 }
            );
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create note" },
            { status: 500 }
        );
    }
}