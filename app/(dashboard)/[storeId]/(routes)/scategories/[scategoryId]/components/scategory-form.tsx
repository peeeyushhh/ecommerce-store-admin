"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Scategory } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  name: z.string().min(1),
});

type ScategoryFormValues = z.infer<typeof formSchema>

interface ScategoryFormProps {
  initialData: Scategory | null;
};

export const ScategoryForm: React.FC<ScategoryFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit sub category' : 'Create sub category';
  const description = initialData ? 'Edit a sub category.' : 'Add a new sub category';
  const toastMessage = initialData ? 'Sub category updated.' : 'Sub category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ScategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: ''
    }
  });

  const onSubmit = async (data: ScategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/scategories/${params.scategoryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/scategories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/scategories`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/scategories/${params.scategoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/scategories`);
      toast.success('Sub category deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this sub categories first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
