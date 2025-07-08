
'use server';

import { revalidatePath } from 'next/cache';
import { addClient, updateClient, createDocument as createDocumentData } from './data';
import type { Client, Document } from './types';
import * as z from 'zod';
import { redirect } from 'next/navigation';

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number is too short."),
  address: z.object({
    street: z.string().min(2, "Street is required."),
    city: z.string().min(2, "City is required."),
    state: z.string().min(2, "State is required."),
    zip: z.string().min(5, "Zip code is required."),
  }),
  status: z.enum(["Lead", "Active", "Inactive"]),
  notes: z.string().optional(),
});


export async function saveClientAction(data: z.infer<typeof clientSchema> & { id?: string }) {
    const validatedFields = clientSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid client data");
    }

    const { id, ...clientData } = validatedFields.data;

    let savedClient;
    if (id) {
        savedClient = await updateClient(id, clientData);
    } else {
        savedClient = await addClient(clientData);
    }
    
    revalidatePath('/clients');
    if (id) {
      revalidatePath(`/clients/${id}`);
    }
    revalidatePath('/documents');

    return savedClient;
}

export async function createDocumentAction(data: { klant_id: string; document_type: Document['document_type']; }) {
    if (!data.klant_id || !data.document_type) {
        throw new Error("Client and document type are required");
    }

    const newDocument = await createDocumentData(data.klant_id, data.document_type);
    
    revalidatePath('/documents');
    redirect(`/documents/${newDocument.id}`);
}
