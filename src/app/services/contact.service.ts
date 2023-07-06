import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import contacts from '../../assets/data.json';

import { Contact, Group } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = contacts;
  private selected: Contact[] = contacts;
  private withoutGroup = 'Without Group';

  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();

  private selectedSubject = new BehaviorSubject<Contact[]>([]);
  selected$: Observable<Contact[]> = this.selectedSubject.asObservable();

  constructor() {
    this.loadContacts();
  }

  getContacts(): Observable<Contact[]> {
    return this.contacts$;
  }

  getSelected(): Observable<Contact[]> {
    return this.selected$;
  }

  getGroupedContacts(): Group[] {
    const groupsSet = this.contacts.reduce((acc, current) => {
      current.selected = false;
      current.groups?.forEach(group => acc.add(group))

      return acc;
    }, new Set([this.withoutGroup]));

    return Array.from(groupsSet)
      .map(groupName => ({
        name: groupName,
        contacts: this.contacts.filter(({ groups }) =>
          groupName === this.withoutGroup
            ? !groups
            : groups?.includes(groupName)
        )
      }))
  }

  toggleContact(contact: Contact): void {
    contact.selected = !contact.selected;
    this.loadContacts();
  }

  toggleGroup(group: Group): void {
    group.contacts.forEach(contact => contact.selected = true);
    this.loadContacts();
  }

  sendInvites(contacts: Partial<Contact>[]): void {
    const emails = [
      ...this.selected,
      ...contacts
    ].map(({ email }) => email);

    console.dir(emails);

    this.contacts.forEach(contact => contact.selected = false);
    this.loadContacts();

    // this.apiService.sendInvites(emails);
  }

  private loadContacts(): void {
    this.selected = this.contacts.filter(({ selected }) => selected);

    this.contactsSubject.next(this.contacts);
    this.selectedSubject.next(this.selected);
  }
}
