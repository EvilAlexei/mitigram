import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Contact, Group } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';
import { trackByFn } from '../../helpers/helpers.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  contacts$: Observable<Contact[]> = new Observable();
  groupedContacts: Group[] = [];

  protected readonly trackByFn = trackByFn;

  constructor(
    private contactService: ContactService,
  ) {
  }

  ngOnInit() {
    this.contacts$ = this.contactService.getContacts();
    this.groupedContacts = this.contactService.getGroupedContacts();
  }

  toggleContact(contact: Contact): void {
    this.contactService.toggleContact(contact);
  }

  toggleGroup(group: Group): void {
    this.contactService.toggleGroup(group);
  }
}
