import type { Client, Company, Document, Article } from './types';

export const clients: Client[] = [
  {
    id: '1',
    name: 'Innovate Corp',
    email: 'contact@innovatecorp.com',
    phone: '555-0101',
    address: { street: '123 Tech Avenue', city: 'Silicon Valley', state: 'CA', zip: '94043' },
    status: 'Active',
    createdAt: '2023-01-15T09:30:00Z',
    notes: 'Initial meeting was positive. Interested in our enterprise package. Follow up scheduled for next week.',
  },
  {
    id: '2',
    name: 'Solutions LLC',
    email: 'support@solutionsllc.com',
    phone: '555-0102',
    address: { street: '456 Business Blvd', city: 'New York', state: 'NY', zip: '10001' },
    status: 'Active',
    createdAt: '2022-11-20T14:00:00Z',
    notes: 'Long-term client. Highly satisfied with our services. Potential for up-sell on the new analytics module.',
  },
  {
    id: '3',
    name: 'Quantum Industries',
    email: 'info@quantum.io',
    phone: '555-0103',
    address: { street: '789 Quantum Way', city: 'Seattle', state: 'WA', zip: '98101' },
    status: 'Lead',
    createdAt: '2023-03-10T11:45:00Z',
    notes: 'Met at a conference. They showed strong interest in our AI-driven features. Sent them a proposal.',
  },
  {
    id: '4',
    name: 'NextGen Systems',
    email: 'hr@nextgensys.co',
    phone: '555-0104',
    address: { street: '101 Future Drive', city: 'Austin', state: 'TX', zip: '78701' },
    status: 'Inactive',
    createdAt: '2021-05-22T18:00:00Z',
    notes: 'Project completed successfully. No current projects, but expressed interest in future collaborations.',
  },
  {
    id: '5',
    name: 'Apex Enterprises',
    email: 'ceo@apex.com',
    phone: '555-0105',
    address: { street: '212 Summit Peak', city: 'Denver', state: 'CO', zip: '80202' },
    status: 'Active',
    createdAt: '2023-02-28T10:10:00Z',
    notes: 'Recently signed. Onboarding process is underway. They need extra support for data migration.',
  },
];

export const company: Company = {
  name: 'Final CRM Inc.',
  logoUrl: 'https://placehold.co/128x128.png',
  address: '789 CRM Lane, Suite 100, San Francisco, CA 94103',
  phone: '1-800-555-CRMS',
  email: 'hello@finalcrm.com',
  website: 'https://www.finalcrm.com',
};

export const documents: Document[] = [
    { id: 'doc1', klant_id: '1', clientName: 'Innovate Corp', document_type: 'Quote', document_nummer: 'Q-202301-001', document_datum: '2023-01-16T10:00:00Z', document_status: 'Sent', regels: [], totaal_subtotaal_excl_btw: 1500, totaal_btw_bedrag: 315, totaal_incl_btw: 1815 },
    { id: 'doc2', klant_id: '2', clientName: 'Solutions LLC', document_type: 'Invoice', document_nummer: 'I-202304-001', document_datum: '2023-04-01T11:00:00Z', document_status: 'Paid', regels: [], totaal_subtotaal_excl_btw: 200, totaal_btw_bedrag: 42, totaal_incl_btw: 242 },
    { id: 'doc3', klant_id: '5', clientName: 'Apex Enterprises', document_type: 'Work Order', document_nummer: 'WO-202303-001',document_datum: '2023-03-05T15:30:00Z', document_status: 'Draft', regels: [], totaal_subtotaal_excl_btw: 3000, totaal_btw_bedrag: 630, totaal_incl_btw: 3630 },
    { id: 'doc4', klant_id: '1', clientName: 'Innovate Corp', document_type: 'Invoice', document_nummer: 'I-202302-001', document_datum: '2023-02-15T12:00:00Z', document_status: 'Paid', regels: [], totaal_subtotaal_excl_btw: 1500, totaal_btw_bedrag: 315, totaal_incl_btw: 1815 },
    { id: 'doc5', klant_id: '3', clientName: 'Quantum Industries', document_type: 'Quote', document_nummer: 'Q-202303-002', document_datum: '2023-03-11T09:00:00Z', document_status: 'Sent', regels: [], totaal_subtotaal_excl_btw: 5000, totaal_btw_bedrag: 1050, totaal_incl_btw: 6050 },
];

export const articles: Article[] = [
    { id: 'art1', artikel_naam: 'Pro Widget', artikel_omschrijving_kort: 'An advanced widget for all your needs.', artikel_omschrijving_lang: 'This Pro Widget is built with the highest quality materials and designed for professionals. It features a sleek design, robust functionality, and seamless integration with our other products.', artikel_fotos: [{ foto_url: 'https://placehold.co/600x400.png', foto_omschrijving: 'Front view of the Pro Widget' }], artikel_urls: ['https://example.com/pro-widget'], artikel_magazijnlocatie: 'Aisle 5, Shelf C', artikel_prijs_excl_btw: 99.99, artikel_korting_percentage: 10, artikel_btw_percentage: 21, artikel_eenheid: 'piece' },
    { id: 'art2', artikel_naam: 'Basic Gadget', artikel_omschrijving_kort: 'A reliable and affordable gadget.', artikel_omschrijving_lang: 'The Basic Gadget provides all the essential features you need at an unbeatable price. Perfect for everyday use and simple tasks. Comes with a one-year warranty.', artikel_fotos: [{ foto_url: 'https://placehold.co/600x400.png', foto_omschrijving: 'The Basic Gadget in its packaging' }], artikel_urls: [], artikel_magazijnlocatie: 'Aisle 2, Shelf A', artikel_prijs_excl_btw: 24.50, artikel_korting_percentage: 0, artikel_btw_percentage: 21, artikel_eenheid: 'piece' },
    { id: 'art3', artikel_naam: 'Ultra Gizmo', artikel_omschrijving_kort: 'The ultimate gizmo for power users.', artikel_omschrijving_lang: 'Experience unparalleled performance with the Ultra Gizmo. Featuring a multi-core processor, high-resolution display, and an all-day battery life. This is the top-of-the-line model for those who demand the best.', artikel_fotos: [{ foto_url: 'https://placehold.co/600x400.png', foto_omschrijving: 'Side view' }, { foto_url: 'https://placehold.co/600x400.png', foto_omschrijving: 'Close-up on the controls' }], artikel_urls: ['https://example.com/ultra-gizmo', 'https://example.com/ultra-gizmo/reviews'], artikel_magazijnlocatie: 'Secure Vault 1', artikel_prijs_excl_btw: 299.00, artikel_korting_percentage: 0, artikel_btw_percentage: 21, artikel_eenheid: 'piece' },
];


// Functions to simulate data fetching
export async function getClients(): Promise<Client[]> {
  return clients;
}

export async function getClientById(id: string): Promise<Client | undefined> {
  return clients.find(c => c.id === id);
}

export async function getDocuments(): Promise<Document[]> {
  return documents;
}

export async function getDocumentById(id: string): Promise<Document | undefined> {
    return documents.find(d => d.id === id);
}

export async function getCompany(): Promise<Company> {
  return company;
}

export async function getArticles(): Promise<Article[]> {
    return articles;
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    return articles.find(a => a.id === id);
}


// Functions to simulate data mutation
export async function addClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const newClient: Client = {
        id: `c-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...clientData,
    };
    clients.unshift(newClient);
    return newClient;
}

export async function updateClient(id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const clientIndex = clients.findIndex(c => c.id === id);
    if (clientIndex === -1) throw new Error('Client not found');
    
    const updatedClient = { ...clients[clientIndex], ...clientData };
    clients[clientIndex] = updatedClient;
    return updatedClient;
}

export async function createDocument(klant_id: string, document_type: Document['document_type']): Promise<Document> {
    const client = clients.find(c => c.id === klant_id);
    if (!client) throw new Error("Client not found");

    const prefix = {
        'Quote': 'Q',
        'Work Order': 'WO',
        'Invoice': 'I'
    }[document_type];
    
    const docCount = documents.filter(d => d.document_type === document_type).length;
    
    const newDoc: Document = {
        id: `doc-${Date.now()}`,
        document_type: document_type,
        document_nummer: `${prefix}-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${(docCount + 1).toString().padStart(3,'0')}`,
        document_datum: new Date().toISOString(),
        document_status: 'concept',
        klant_id: klant_id,
        clientName: client.name,
        regels: [],
        totaal_subtotaal_excl_btw: 0,
        totaal_btw_bedrag: 0,
        totaal_incl_btw: 0,
    };
    documents.unshift(newDoc);
    return newDoc;
}

export async function addArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    const newArticle: Article = {
        id: `art-${Date.now()}`,
        ...articleData,
    };
    articles.unshift(newArticle);
    return newArticle;
}

export async function updateArticle(id: string, articleData: Partial<Omit<Article, 'id'>>): Promise<Article> {
    const articleIndex = articles.findIndex(a => a.id === id);
    if (articleIndex === -1) throw new Error('Article not found');
    
    const updatedArticle = { ...articles[articleIndex], ...articleData };
    articles[articleIndex] = updatedArticle;
    return updatedArticle;
}
