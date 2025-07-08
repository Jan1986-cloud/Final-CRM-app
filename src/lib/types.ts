export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  status: 'Lead' | 'Active' | 'Inactive';
  createdAt: string; // ISO string
  notes: string;
};

export type Company = {
  name: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

export type Document = {
  id: string;
  clientName: string;
  type: 'Quote' | 'Work Order' | 'Invoice';
  createdAt: string;
  status: 'Draft' | 'Sent' | 'Paid';
};
