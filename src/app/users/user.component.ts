import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

/* Settings for smart-data-table */
const SETTINGS = {
  columns: {
    id: {
      title: 'ID',
      filter: true
    },
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
  add: { addButtonContent: 'Add User'},
  edit: { editButtonContent: 'Edit' },
  delete: { deleteButtonContent: 'Delete' },
  actions: { columnTitle: 'Actions', position: 'right' },
  noDataMessage: 'There is no data',
  pager: {
    perPage: 5
  },
  attr: {
    class: 'table table-bordered'
  }
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
    private userService: UserService,
    private toastr: ToastrService
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

  open(content: any, user?: any): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      keyboard: false,
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete(): void {
    this.userService.deleteUser(+this.selectedUser.id).subscribe(data => {
      if (data) {
        this.toastr.success(`User successfully deleted`);
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

