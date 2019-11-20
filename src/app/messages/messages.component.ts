import { Component, OnInit } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';

@Component({
	selector: 'messages',
	templateUrl: 'messages.component.html'
})

export class MessagesComponent implements OnInit {

	messages: Message[];
	pagination: Pagination;
	messageContainer = "Unread";

	constructor(private userService: UserService, 
		private alertify: AlertifyService, 
		private route: ActivatedRoute, 
		private authService: AuthService) { }

	ngOnInit() { 
		this.route.data.subscribe(data => {
			this.messages = data['messages'].result;
			this.pagination = data['messages'].paginatin;
		}) 
	}

	loadMessages(){
		this.userService
			.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
				this.pagination.itemsPerPage, this.messageContainer )
			.subscribe((res: PaginatedResult<Message[]>) => {
				this.messages = res.result;
				this.pagination = res.pagination;
			},
			error => {
				this.alertify.error(error);
			});
	}

	pageChanged(event: any): void {
		this.pagination.currentPage = event.page;
		this.loadMessages();
	}
}