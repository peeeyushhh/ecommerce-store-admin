import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ScategoryColumn } from "./components/columns"
import { ScategoriesClient } from "./components/client";

const SizesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const scategories = await prismadb.scategory.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: ScategoryColumn[] = scategories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ScategoriesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
