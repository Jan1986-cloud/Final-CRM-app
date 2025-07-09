
import type { Client, Company, Document, Article } from './types';
import { adminDb, isAdminSdkInitialized } from './firebase';
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

let hasLoggedDatastoreError = false;
const logDatastoreModeError = () => {
    if (hasLoggedDatastoreError) return;
    console.warn("********************************************************************************************************");
    console.warn("*** PROJECT CONFIGURATION ERROR: Firestore is in Datastore Mode. *************************************");
    console.warn("*** This application requires Firestore in Native Mode. You must create a new project. ***************");
    console.warn("*** Falling back to OFFLINE MODE. Data is not being saved. *******************************************");
    console.warn("********************************************************************************************************");
    hasLoggedDatastoreError = true;
};

const isDatastoreModeError = (error: any): boolean => {
    return !!error.message?.includes('Firestore in Datastore Mode');
}


// --- MOCK DATABASE FOR LOCAL DEVELOPMENT ---
let nextId = 100;
const mockDb: { clients: Client[], articles: Article[], documents: Document[] } = {
  clients: [
    { id: 'mock_1', name: 'Globex Corporation', email: 'contact@globex.com', phone: '555-0101', address: { street: '123 Industrial Way', city: 'Springfield', state: 'IL', zip: '62701' }, status: 'Active', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), notes: 'High-value client, potential for a large-scale project in Q3.' },
    { id: 'mock_2', name: 'Stark Industries', email: 'pepper.potts@stark.com', phone: '555-0102', address: { street: '10880 Malibu Point', city: 'Malibu', state: 'CA', zip: '90265' }, status: 'Lead', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), notes: 'Initial contact made. Follow up scheduled for next week.' }
  ],
  articles: [
    { id: 'mock_art_1', artikel_naam: 'Pro Widget', artikel_omschrijving_kort: 'The latest and greatest widget.', artikel_omschrijving_lang: 'A full description of the Pro Widget.', artikel_fotos: [], artikel_urls: [], artikel_magazijnlocatie: 'A5-3', artikel_prijs_excl_btw: 199.99, artikel_korting_percentage: 0, artikel_btw_percentage: 21, artikel_eenheid: 'piece' },
    { id: 'mock_art_2', artikel_naam: 'Basic Gadget', artikel_omschrijving_kort: 'A reliable, everyday gadget.', artikel_omschrijving_lang: 'A full description of the Basic Gadget.', artikel_fotos: [], artikel_urls: [], artikel_magazijnlocatie: 'B2-1', artikel_prijs_excl_btw: 49.95, artikel_korting_percentage: 5, artikel_btw_percentage: 21, artikel_eenheid: 'piece' }
  ],
  documents: [],
};
const getNextId = () => `mock_${++nextId}`;
// --- END MOCK DATABASE ---


// --- Client Data ---

export async function getClients(): Promise<Client[]> {
  if (!isAdminSdkInitialized) {
    console.warn("Firebase not configured. Using mock data for clients.");
    return JSON.parse(JSON.stringify(mockDb.clients)).sort((a: Client, b: Client) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  try {
    const snapshot = await adminDb.collection('clients').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => serialize<Client>(doc));
  } catch (error: any) {
    if (isDatastoreModeError(error)) {
        logDatastoreModeError();
        return JSON.parse(JSON.stringify(mockDb.clients)).sort((a: Client, b: Client) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  if (!isAdminSdkInitialized) {
    console.warn(`Firebase not configured. Using mock data for getClientById(${id}).`);
    const client = mockDb.clients.find(c => c.id === id);
    return client ? JSON.parse(JSON.stringify(client)) : null;
  }
  try {
    const doc = await adminDb.collection('clients').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return serialize<Client>(doc);
  } catch (error: any) {
    if (isDatastoreModeError(error)) {
        logDatastoreModeError();
        const client = mockDb.clients.find(c => c.id === id);
        return client ? JSON.parse(JSON.stringify(client)) : null;
    }
    console.error(`Error fetching client ${id}:`, error);
    return null;
  }
}

export async function addClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    if (!isAdminSdkInitialized) {
        console.warn("Firebase not configured. Using mock data for addClient.");
        const newClient: Client = {
            id: getNextId(),
            ...clientData,
            createdAt: new Date().toISOString(),
        };
        mockDb.clients.push(newClient);
        return JSON.parse(JSON.stringify(newClient));
    }
    const clientPayload = {
        ...clientData,
        createdAt: new Date(),
    };
    const docRef = await adminDb.collection('clients').add(clientPayload);
    return { id: docRef.id, ...clientPayload, createdAt: clientPayload.createdAt.toISOString() };
}

export async function updateClient(id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    if (!isAdminSdkInitialized) {
        console.warn(`Firebase not configured. Using mock data for updateClient(${id}).`);
        const clientIndex = mockDb.clients.findIndex(c => c.id === id);
        if (clientIndex === -1) throw new Error("Mock client not found");
        mockDb.clients[clientIndex] = { ...mockDb.clients[clientIndex], ...clientData };
        return JSON.parse(JSON.stringify(mockDb.clients[clientIndex]));
    }
    const docRef = adminDb.collection('clients').doc(id);
    await docRef.update(clientData);
    const updatedDoc = await docRef.get();
    return serialize<Client>(updatedDoc);
}

export async function deleteClient(id: string): Promise<void> {
    if (!isAdminSdkInitialized) {
        console.warn(`Firebase not configured. Using mock data for deleteClient(${id}).`);
        const initialLength = mockDb.clients.length;
        mockDb.clients = mockDb.clients.filter(c => c.id !== id);
        if (mockDb.clients.length === initialLength) throw new Error("Mock client not found for deletion");
        return;
    }
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
    if (!isAdminSdkInitialized) {
        console.warn("Firebase not configured. Using mock data for documents.");
        const docs = mockDb.documents.map(doc => ({
            ...doc,
            clientName: mockDb.clients.find(c => c.id === doc.klant_id)?.name || 'Unknown Client'
        }));
        return JSON.parse(JSON.stringify(docs)).sort((a: Document, b: Document) => new Date(b.document_datum).getTime() - new Date(a.document_datum).getTime());
    }
    try {
        const snapshot = await adminDb.collection('documenten').orderBy('document_datum', 'desc').get();
        if (snapshot.empty) return [];

        const docs = snapshot.docs.map(doc => serialize<Document>(doc));
        
        const clientIds = [...new Set(docs.map(doc => doc.klant_id))];
        if (clientIds.length === 0) return docs;

        const clientSnapshot = await adminDb.collection('clients').where(adminDb.FieldPath.documentId(), 'in', clientIds).get();
        const clientMap = new Map(clientSnapshot.docs.map(doc => [doc.id, doc.data().name]));

        return docs.map(doc => ({
            ...doc,
            clientName: clientMap.get(doc.klant_id) || 'Unknown Client'
        }));
    } catch (error: any) {
        if (isDatastoreModeError(error)) {
            logDatastoreModeError();
            const docs = mockDb.documents.map(doc => ({
                ...doc,
                clientName: mockDb.clients.find(c => c.id === doc.klant_id)?.name || 'Unknown Client'
            }));
            return JSON.parse(JSON.stringify(docs)).sort((a: Document, b: Document) => new Date(b.document_datum).getTime() - new Date(a.document_datum).getTime());
        }
        console.error("Error fetching documents:", error);
        return [];
    }
}

export async function getDocumentById(id: string): Promise<Document | null> {
    if (!isAdminSdkInitialized) {
        console.warn(`Firebase not configured. Using mock data for getDocumentById(${id}).`);
        const doc = mockDb.documents.find(d => d.id === id);
        if (!doc) return null;
        const clientName = mockDb.clients.find(c => c.id === doc.klant_id)?.name || 'Unknown Client';
        return JSON.parse(JSON.stringify({ ...doc, clientName }));
    }
    try {
        const doc = await adminDb.collection('documenten').doc(id).get();
        if (!doc.exists) return null;
        return serialize<Document>(doc);
    } catch (error: any) {
        if (isDatastoreModeError(error)) {
            logDatastoreModeError();
            const doc = mockDb.documents.find(d => d.id === id);
            if (!doc) return null;
            const clientName = mockDb.clients.find(c => c.id === doc.klant_id)?.name || 'Unknown Client';
            return JSON.parse(JSON.stringify({ ...doc, clientName }));
        }
        console.error(`Error fetching document ${id}:`, error);
        return null;
    }
}

export async function createDocument(klant_id: string, document_type: Document['document_type']): Promise<Document> {
    if (!isAdminSdkInitialized) {
        console.warn("Firebase not configured. Using mock data for createDocument.");
        const client = mockDb.clients.find(c => c.id === klant_id);
        if (!client) throw new Error("Mock client not found");

        const prefix = { 'Quote': 'Q', 'Work Order': 'WO', 'Invoice': 'I' }[document_type];
        const docCount = mockDb.documents.filter(d => d.document_type === document_type).length;
        
        const newDoc: Document = {
            id: getNextId(),
            document_type: document_type,
            document_nummer: `${prefix}-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${(docCount + 1).toString().padStart(3,'0')}`,
            document_datum: new Date().toISOString(),
            document_status: 'concept',
            klant_id: klant_id,
            regels: [],
            totaal_subtotaal_excl_btw: 0,
            totaal_btw_bedrag: 0,
            totaal_incl_btw: 0,
            clientName: client.name,
        };
        mockDb.documents.push(newDoc);
        return JSON.parse(JSON.stringify(newDoc));
    }
    const client = await getClientById(klant_id);
    if (!client) throw new Error("Client not found");

    const prefix = { 'Quote': 'Q', 'Work Order': 'WO', 'Invoice': 'I' }[document_type];
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
    if (!isAdminSdkInitialized) {
        console.warn("Firebase not configured. Using mock data for articles.");
        return JSON.parse(JSON.stringify(mockDb.articles)).sort((a: Article, b: Article) => a.artikel_naam.localeCompare(b.artikel_naam));
    }
    try {
        const snapshot = await adminDb.collection('artikelen').orderBy('artikel_naam').get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => serialize<Article>(doc));
    } catch (error: any) {
        if (isDatastoreModeError(error)) {
            logDatastoreModeError();
            return JSON.parse(JSON.stringify(mockDb.articles)).sort((a: Article, b: Article) => a.artikel_naam.localeCompare(b.artikel_naam));
        }
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function getArticleById(id: string): Promise<Article | null> {
    if (!isAdminSdkInitialized) {
        console.warn(`Firebase not configured. Using mock data for getArticleById(${id}).`);
        const article = mockDb.articles.find(a => a.id === id);
        return article ? JSON.parse(JSON.stringify(article)) : null;
    }
    try {
        const doc = await adminDb.collection('artikelen').doc(id).get();
        if (!doc.exists) return null;
        return serialize<Article>(doc);
    } catch (error: any) {
        if (isDatastoreModeError(error)) {
            logDatastoreModeError();
            const article = mockDb.articles.find(a => a.id === id);
            return article ? JSON.parse(JSON.stringify(article)) : null;
        }
        console.error(`Error fetching article ${id}:`, error);
        return null;
    }
}

export async function addArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    if (!isAdminSdkInitialized) {
        console.warn("Firebase not configured. Using mock data for addArticle.");
        const newArticle: Article = { id: getNextId(), ...articleData };
        mockDb.articles.push(newArticle);
        return JSON.parse(JSON.stringify(newArticle));
    }
    const docRef = await adminDb.collection('artikelen').add(articleData);
    return { id: docRef.id, ...articleData };
}

export async function updateArticle(id: string, articleData: Partial<Omit<Article, 'id'>>): Promise<Article> {
    if (!isAdminSdkInitialized) {
        console.warn(`Firebase not configured. Using mock data for updateArticle(${id}).`);
        const articleIndex = mockDb.articles.findIndex(a => a.id === id);
        if (articleIndex === -1) throw new Error("Mock article not found");
        mockDb.articles[articleIndex] = { ...mockDb.articles[articleIndex], ...articleData };
        return JSON.parse(JSON.stringify(mockDb.articles[articleIndex]));
    }
    const docRef = adminDb.collection('artikelen').doc(id);
    await docRef.update(articleData);
    const updatedDoc = await docRef.get();
    return serialize<Article>(updatedDoc);
}

export async function deleteArticle(id: string): Promise<void> {
    if (!isAdminSdkInitialized) {
        console.warn(`Firebase not configured. Using mock data for deleteArticle(${id}).`);
        const initialLength = mockDb.articles.length;
        mockDb.articles = mockDb.articles.filter(a => a.id !== id);
        if (mockDb.articles.length === initialLength) throw new Error("Mock article not found for deletion");
        return;
    }
    await adminDb.collection('artikelen').doc(id).delete();
}
