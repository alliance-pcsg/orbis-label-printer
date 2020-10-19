import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup } from '@angular/forms';
import { CloudAppSettingsService, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { ToastrService } from 'ngx-toastr';
import { Settings } from '../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  saving: boolean = false;

  constructor(
    private appService: AppService,
    private settingsService: CloudAppSettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.settingsService.getAsFormGroup().subscribe( settings => {
      this.settingsForm = Object.keys(settings.value).length==0 ?
        FormGroupUtil.toFormGroup(new Settings()) :
        settings;
    });
  }

  saveSettings() {
    this.saving = true;
    this.settingsService.set(this.settingsForm.value).subscribe(
      response => {
        this.toastr.success('Settings saved.');
        this.settingsForm.markAsPristine();
      },
      err => this.toastr.error(err.message),
      ()  => this.saving = false
    );
  }

}