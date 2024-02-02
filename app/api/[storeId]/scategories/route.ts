import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    if (!simages || !simages.length) {
      return new NextResponse("bimages are required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const scategory = await prismadb.scategory.create({
      data: {
        name,
        categoryId,
        storeId: params.storeId,
        simages: {
          createMany: {
            data: [
              ...simages.map((image: {url:string}) => image)
            ]
          }
        }
      }
    });
  
    return NextResponse.json(scategory);
  } catch (error) {
    console.log('[SCATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const scategories = await prismadb.scategory.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(scategories);
  } catch (error) {
    console.log('[SCATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
