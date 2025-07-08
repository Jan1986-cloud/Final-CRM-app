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
  klant_id: string;
  clientName: string; // For display convenience
  document_type: 'Quote' | 'Work Order' | 'Invoice';
  document_nummer: string;
  document_datum: string; // ISO string
  document_status: 'concept' | 'Draft' | 'Sent' | 'Paid';
  regels: any[];
  totaal_subtotaal_excl_btw: number;
  totaal_btw_bedrag: number;
  totaal_incl_btw: number;
};
