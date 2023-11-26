"use server"; //learn:by adding this we will mark all the exported functions within the file as server functions.These server functions can then imported into both client and serve components making them extremely versatile.

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //learn:The amount field is specifically set to coerce (forced to change) from a string to a number while also validating its type.
  status:z.enum(['pending','paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  //extract values of the formdata
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100; //learn:It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
  const date = new Date().toISOString().split("T")[0];


  //Inserting the data into the database
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES(${customerId}, ${amountInCents}, ${status}, ${date})
  `;


  //learn: Next.js has a client side router cache that stores the route segments in the user's browser for a time.Along with prefetching, this cache ensures that the users can quickly navigate between routes while reducing the number of requests made to the server. Since we are updating the data displayed in the invoices route, we want to clear this cache and trigger a new request to the server. we can do this with `revalidatePath` function from Next.js . So once the database has been updated, the mentioned path will be revalidated and the fresh data will be fetched from the server.
  revalidatePath('/dashboard/invoices');

  //learn:Once the data is fetched, we want to redirect the user back to the "/dashboard/invoices" page. we can do that with `revalidate` function from Next.js .
  redirect('dashboard/invoices');
  

}
