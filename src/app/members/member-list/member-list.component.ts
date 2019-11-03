import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
	selector: 'member-list',
	templateUrl: 'member-list.component.html'
})

export class MemberListComponent implements OnInit {
	users: User[];

	constructor(private userService: UserService, private alertify: AlertifyService) { }

	ngOnInit() {
		this.loadService();
	 }

	loadService() {
		this.userService.getUsers().subscribe((users: User[]) => {
			this.users = users;
		}, error => {
			this.alertify.error(error);
		})
	}
}