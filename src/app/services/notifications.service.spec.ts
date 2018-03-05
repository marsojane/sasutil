import { Injectable } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { MatSnackBar } from '@angular/material'
import { NotificationsService } from './notifications.service'
import { Subject } from 'rxjs/Subject'

describe('NotificationsService', () => {
	let notificationsService, snackBarSpy: jasmine.SpyObj<MatSnackBar>
	beforeEach(() => {
		const sbspy = jasmine.createSpyObj('MatSnackBar', ['open'])
		TestBed.configureTestingModule({
			providers: [
				NotificationsService,
				{ provide: MatSnackBar, useValue: sbspy }
			] 
		})
		notificationsService = TestBed.get(NotificationsService)
		snackBarSpy = TestBed.get(MatSnackBar)
		spyOn<NotificationsService>(notificationsService, 'notify').and.callThrough() // delegate to original implementation
		spyOn<NotificationsService>(notificationsService, 'notificationsChange')
		notificationsService.notify('info', 'This is a testmessage', !0)
	})

	it('should create the NotificationsService', () => {
		expect(notificationsService).toBeTruthy()
	})

	it('property eventMgr should return an instance of Subject', () => {
		expect(notificationsService.eventMgr instanceof Subject).toBe(true)
	})

	it('should create a snackbar spy.', () => {
		expect(snackBarSpy).toBeDefined()
		expect(snackBarSpy.open).toBeDefined()
	})

	it('should call the notify method', () => {
		expect(notificationsService.notify).toHaveBeenCalled()
	})

	it('should dispatch notificationsChange event', () => {
		expect(notificationsService.notificationsChange).toHaveBeenCalled()
	})

	it('should open the snackbar', () => {
		expect(snackBarSpy.open.calls.count()).toEqual(1)
	})

	it('should have filled sideNotifications', () => {
		expect(notificationsService.sideNotifications.length).toBeGreaterThan(0)
	})

	it('should clear the sideNotifications', () => {
		notificationsService.clear()
		expect(notificationsService.sideNotifications.length).toEqual(0)
	})
})
