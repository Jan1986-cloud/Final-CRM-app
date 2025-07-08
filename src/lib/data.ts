import type { Client, Company, Document } from './types';

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
    { id: 'doc1', clientName: 'Innovate Corp', type: 'Quote', createdAt: '2023-01-16T10:00:00Z', status: 'Sent' },
    { id: 'doc2', clientName: 'Solutions LLC', type: 'Invoice', createdAt: '2023-04-01T11:00:00Z', status: 'Paid' },
    { id: 'doc3', clientName: 'Apex Enterprises', type: 'Work Order', createdAt: '2023-03-05T15:30:00Z', status: 'Draft' },
    { id: 'doc4', clientName: 'Innovate Corp', type: 'Invoice', createdAt: '2023-02-15T12:00:00Z', status: 'Paid' },
    { id: 'doc5', clientName: 'Quantum Industries', type: 'Quote', createdAt: '2023-03-11T09:00:00Z', status: 'Sent' },
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

export async function getCompany(): Promise<Company> {
  return company;
}
