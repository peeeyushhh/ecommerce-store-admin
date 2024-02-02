import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { scategoryId: string } }
) {
  try {
    if (!params.scategoryId) {
      return new NextResponse("Sub category id is required", { status: 400 });
    }

    const scategory = await prismadb.scategory.findUnique({
      where: {
        id: params.scategoryId
      },
      include: {
        category: true,
        simages: true,
      }
    });
  
    return NextResponse.json(scategory);
  } catch (error) {
    console.log('[SCATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { scategoryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.scategoryId) {
      return new NextResponse("Sub category id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const scategory = await prismadb.scategory.delete({
      where: {
        id: params.scategoryId
      }
    });
  
    return NextResponse.json(scategory);
  } catch (error) {
    console.log('[SCATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { scategoryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, categoryId, simages } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!simages) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!params.scategoryId) {
      return new NextResponse("Sub category id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

     await prismadb.scategory.update({
      where: {
        id: params.scategoryId
      },
      data: {
        name,
        categoryId,
        simages: {
          deleteMany:{}
        }
      }
    });

    const scategory = await prismadb.scategory.update({
      where: {
        id: params.scategoryId
      },
      data: {
        name,
        categoryId,
        simages: {
          createMany: {
            data: [
              ...simages.map((image: { url: string }) => image),
            ]
          }
        }
      }
    });
  
    return NextResponse.json(scategory);
  } catch (error) {
    console.log('[SCATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
