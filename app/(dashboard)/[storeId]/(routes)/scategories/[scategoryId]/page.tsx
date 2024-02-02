import prismadb from "@/lib/prismadb";

import { ScategoryForm } from "./components/scategory-form";

const ScategoryPage = async ({
  params
}: {
  params: { scategoryId: string }
}) => {
  const scategory = await prismadb.scategory.findUnique({
    where: {
      id: params.scategoryId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ScategoryForm initialData={scategory} />
      </div>
    </div>
  );
}

export default ScategoryPage;
