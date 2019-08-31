import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* Settings for smart-data-table */
const SETTINGS = {
  columns: {
    firstname: {
      title: 'Firstname',
      filter: true
    },
    lastname: {
      title: 'Lastname',
      filter: true
    },
    document: {
      title: 'Document',
      filter: true
    },
    email: {
      title: 'Email',
      filter: true
    },
    phone: {
      title: 'Phone',
      filter: true
    },
  },
  mode: 'external',
  add: { addButtonContent: 'Add'},
  edit: { editButtonContent: 'Edit' },
  delete: { deleteButtonContent: 'Delete' },
  actions: { columnTitle: 'Actions', position: 'right' },
  noDataMessage: 'There is no data'
};

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  source = new LocalDataSource();
  settings = SETTINGS;
  selectedUser: any;
  modalRef: NgbModalRef;
  errorMessage: string;
  loading = true;

  constructor(
    private modalService: NgbModal,
    private routerService: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('notFound')) {
      this.errorMessage = 'User not found';
    }
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.loading = false;
        this.source.load(users);
      },
      err => {
        this.loading = false;
        this.errorMessage = err;
      }
    );

  }

  open(content: any, user: any): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      keyboard: false,
      backdrop: 'static'
    });
  }

  onDelete(): void {
    this.userService.deleteUser(this.selectedUser.id).subscribe(success => {
      if (success === true) {
        this.source.remove(this.selectedUser);
        this.modalRef.close();
      }
      this.errorMessage =
        'Ocurrió un error al tratar de guardar los cambios en la base de datos. Contacte a su proveedor';
    }, err => (this.errorMessage = err));
  }

  onEdit(id: number): void {
    this.routerService.navigate(['users', id, 'edit']);
  }
}

