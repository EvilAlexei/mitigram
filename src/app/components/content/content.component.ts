import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup, FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';

import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';
import { trackByFn } from '../../helpers/helpers.js';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {
  selected$: Observable<Contact[]> = new Observable();
  customContacts: Partial<Contact>[] = [];

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, emailDuplicateValidator(this.customContacts)]),
    name: new FormGroup({
      first: new FormControl('', Validators.required),
      last: new FormControl('', Validators.required),
    })
  });

  @ViewChild(FormGroupDirective) private forDir!: FormGroupDirective;

  protected readonly trackByFn = trackByFn;

  constructor(
    private contactService: ContactService,
  ) {
  }

  ngOnInit(): void {
    this.selected$ = this.contactService.getSelected();
  }

  toggleContact(target: Contact): void {
    this.contactService.toggleContact(target);
  }

  removeCustomContact(target: Partial<Contact>): void {
    this.customContacts = this.customContacts.filter(({ email }) => email !== target.email);
  }

  onSubmit(): void {
    this.customContacts.push(this.contactForm.value as Partial<Contact>);
    this.forDir.resetForm();
  }

  sendInvites(): void {
    this.contactService.sendInvites(this.customContacts);
  }
}

function emailDuplicateValidator(contacts: Partial<Contact>[]): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    return contacts.find(({ email }) => email === value) ? { duplicate: true } : null;
  }
}
