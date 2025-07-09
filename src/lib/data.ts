
import type { Client, Company, Document, Article } from './types';
import { adminDb } from './firebase';
import type { firestore } from 'firebase-admin';

// Helper to serialize Firestore data, converting Timestamps to ISO strings
function serialize<T>(doc: firestore.DocumentSnapshot): T {
    const data = doc.data() as any;
    // Recursively serialize Timestamps
    const serializeObject = (obj: any) => {
        for (const key in obj) {
            if (obj[key] && typeof obj[key].toDate === 'function') {
                 obj[key] = obj[key].toDate().toISOString();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                serializeObject(obj[key]);
            }
        }
        return obj;
    }
    return { id: doc.id, ...serializeObject(data) } as T;
}


// --- Client Data ---

export async function getClients(): Promise<Client[]> {
  try {
    const snapshot = await adminDb.collection('clients').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => serialize<Client>(doc));
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const doc = await adminDb.collection('clients').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return serialize<Client>(doc);
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error);
    return null;
  }
}

export async function addClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const clientPayload = {
        ...clientData,
        createdAt: new Date(),
    };
    const docRef = await adminDb.collection('clients').add(clientPayload);
    return { id: docRef.id, ...clientPayload, createdAt: clientPayload.createdAt.toISOString() };
}

export async function updateClient(id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const docRef = adminDb.collection('clients').doc(id);
    await docRef.update(clientData);
    const updatedDoc = await docRef.get();
    return serialize<Client>(updatedDoc);
}

export async function deleteClient(id: string): Promise<void> {
    // In a real app, you might want to also delete related documents, or handle this differently.
    // For now, we just delete the client.
    await adminDb.collection('clients').doc(id).delete();
}

// --- Company Data ---

export const company: Company = {
  name: 'Final CRM Inc.',
  logoUrl: 'https://placehold.co/128x128.png',
  address: '789 CRM Lane, Suite 100, San Francisco, CA 94103',
  phone: '1-800-555-CRMS',
  email: 'hello@finalcrm.com',
  website: 'https://www.finalcrm.com',
};

export async function getCompany(): Promise<Company> {
  return company;
}


// --- Document Data ---

export async function getDocuments(): Promise<Document[]> {
    try {
        const snapshot = await adminDb.collection('documenten').orderBy('document_datum', 'desc').get();
        if (snapshot.empty) return [];

        const docs = snapshot.docs.map(doc => serialize<Document>(doc));
        
        // Fetch client names for display
        const clientIds = [...new Set(docs.map(doc => doc.klant_id))];
        if (clientIds.length === 0) return docs;

        const clientSnapshot = await adminDb.collection('clients').where(adminDb.FieldPath.documentId(), 'in', clientIds).get();
        const clientMap = new Map(clientSnapshot.docs.map(doc => [doc.id, doc.data().name]));

        return docs.map(doc => ({
            ...doc,
            clientName: clientMap.get(doc.klant_id) || 'Unknown Client'
        }));
    } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
    }
}

export async function getDocumentById(id: string): Promise<Document | null> {
    try {
        const doc = await adminDb.collection('documenten').doc(id).get();
        if (!doc.exists) return null;
        return serialize<Document>(doc);
    } catch (error) {
        console.error(`Error fetching document ${id}:`, error);
        return null;
    }
}

export async function createDocument(klant_id: string, document_type: Document['document_type']): Promise<Document> {
    const client = await getClientById(klant_id);
    if (!client) throw new Error("Client not found");

    const prefix = {
        'Quote': 'Q',
        'Work Order': 'WO',
        'Invoice': 'I'
    }[document_type];
    
    // This is a simplified numbering. A robust solution would use a transaction or a dedicated counter document.
    const docQuery = await adminDb.collection('documenten').where('document_type', '==', document_type).get();
    const docCount = docQuery.size;
    
    const newDocPayload = {
        document_type: document_type,
        document_nummer: `${prefix}-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${(docCount + 1).toString().padStart(3,'0')}`,
        document_datum: new Date(),
        document_status: 'concept' as const,
        klant_id: klant_id,
        regels: [],
        totaal_subtotaal_excl_btw: 0,
        totaal_btw_bedrag: 0,
        totaal_incl_btw: 0,
    };

    const docRef = await adminDb.collection('documenten').add(newDocPayload);
    
    return { 
        id: docRef.id, 
        ...newDocPayload, 
        clientName: client.name,
        document_datum: newDocPayload.document_datum.toISOString()
    };
}


// --- Article Data ---

export async function getArticles(): Promise<Article[]> {
    try {
        const snapshot = await adminDb.collection('artikelen').orderBy('artikel_naam').get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => serialize<Article>(doc));
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function getArticleById(id: string): Promise<Article | null> {
    try {
        const doc = await adminDb.collection('artikelen').doc(id).get();
        if (!doc.exists) return null;
        return serialize<Article>(doc);
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error);
        return null;
    }
}

export async function addArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    const docRef = await adminDb.collection('artikelen').add(articleData);
    return { id: docRef.id, ...articleData };
}

export async function updateArticle(id: string, articleData: Partial<Omit<Article, 'id'>>): Promise<Article> {
    const docRef = adminDb.collection('artikelen').doc(id);
    await docRef.update(articleData);
    const updatedDoc = await docRef.get();
    return serialize<Article>(updatedDoc);
}

export async function deleteArticle(id: string): Promise<void> {
    await adminDb.collection('artikelen').doc(id).delete();
}
