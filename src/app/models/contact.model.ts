export interface Contact {
  _id: string,
  picture: string,
  name: {
    first: string,
    last: string
  },
  company: string,
  email: string,
  phone: string,
  groups?: string[],
  selected?: boolean
}

export interface Group {
  name: string;
  contacts: Contact[];
}
