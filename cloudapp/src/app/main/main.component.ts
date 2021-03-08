import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CloudAppConfigService, CloudAppSettingsService, CloudAppRestService, CloudAppEventsService,
  Request, HttpMethod, Entity, PageInfo, RestErrorResponse
} from '@exlibris/exl-cloudapp-angular-lib';
import { FormControl } from '@angular/forms';
import { Configuration } from '../models/configuration';
import { Settings } from '../models/settings';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private pageLoad$: Subscription;
  private _apiResult: any;
  configuration: Configuration;
  settings: Settings;
  pageEntities: Entity[];
  loading: boolean;
  hasApiResult: boolean;
  isItemRecord: boolean;
  spineLabel: string;
  itemTitle: string;
  itemBarcode: string;
  locationToggle = new FormControl('temporary');
  isInTemp: boolean = false;

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private configService: CloudAppConfigService,
    private settingsService: CloudAppSettingsService
  ) { }

  ngOnInit() {
    this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  get apiResult() {
    return this._apiResult;
  }

  set apiResult(result: any) {
    this._apiResult = result;
    this.hasApiResult = result && Object.keys(result).length > 0;
  }
  
  set_settings() {
    this.settingsService.get().subscribe(settings => {
      this.settings = settings as Settings;
    });
  }

  onPageLoad = (pageInfo: PageInfo) => {
    this.loading = true;
    this.isItemRecord = false;
    this.pageEntities = pageInfo.entities;
    if ((pageInfo.entities || []).length == 1) {
      if (String(this.pageEntities[0].type) == 'ITEM') {
        this.isItemRecord = true;
        const entity = pageInfo.entities[0];
        // Set settings
        this.set_settings();
        // Set configuration, then get API result
        this.configService.get().subscribe(configuration => {
          this.configuration = configuration as Configuration;
          this.restService.call(entity.link).subscribe(result => {
            this.apiResult = result;
            this.spineLabel = this.constructSpineLabel();
            this.loading = false;
          });
        });
      } else {
        this.apiResult = {};
        this.loading = false;
      }
    }
    else {
      this.loading = false;
    }
  }
  
  constructSpineLabel(): string {
    if (this.hasApiResult == true) {
      var bib_data = this.apiResult.bib_data;
      var holding_data = this.apiResult.holding_data;
      var item_data = this.apiResult.item_data;
      var useTemp = false;
      if (this.locationToggle.value == 'temporary') {
        useTemp = true;
      }
      this.isInTemp = holding_data.in_temp_location;
      
      // Get title and barcode for window
      this.itemTitle = bib_data.title;
      this.itemBarcode = item_data.barcode;
      
      // Get library and location
      var itemLibrary = item_data.library.desc;
      var itemLocationCode = item_data.location.value;
      if (useTemp && this.isInTemp) {
        itemLibrary = holding_data.temp_library.desc;
        itemLocationCode = holding_data.temp_location.value;
      }
      
      // Get prefix
      var library_location = itemLibrary + '+' + itemLocationCode;
      var prefix = '';
      var split_prefixes = this.configuration.prefixes.split(/\r?\n/g);
      var prefix_line;
      for (var p = 0; p < split_prefixes.length; p++) {
        prefix_line = split_prefixes[p];
        if (prefix_line.substring(0, library_location.length) == library_location) {
          prefix = prefix_line.substring(library_location.length + 1);
        }
      }
      
      // Get permanent call number
      var callNumber = holding_data.permanent_call_number;
      // Alternative item call number overwrites holding call number
      if (item_data.alternative_call_number != '') {
        callNumber = item_data.alternative_call_number;
      }
      // Temporary call number overwrites both
      if (useTemp && this.isInTemp && holding_data.temp_call_number != '') {
        callNumber = holding_data.temp_call_number;
      }
      // Convert spaces to line breaks
      callNumber = callNumber.replaceAll(' ', "\n");
      
      // Get copy ID
      var copyId = holding_data.copy_id;
      
      // Return spine label
      this.isItemRecord = true;
      var spineLabel = '';
      if (prefix) {
        spineLabel = prefix + "\n";
      }
      spineLabel += callNumber;
      if (copyId != '') {
        spineLabel += "\n" + 'c. ' + copyId;
      }
      return spineLabel;
    }
    return '';
  }
  
  printSpineLabel(content) {
    
    // Format content
    var formatted_content = content.replace(/(?:\r\n|\r|\n)/g, '<br />');
    
    // Size page with print settings
    var styles = '<style>';
    styles += '@page {size: ' + this.settings.labelWidth + ' ' + this.settings.labelHeight + ';}';
    styles += 'body {';
    styles += 'font-family: "' + this.settings.fontFamily + '";';
    styles += 'font-size: ' + this.settings.fontSize + ';';
    styles += 'font-weight: ' + this.settings.fontWeight + ';';
    styles += 'line-height: ' + this.settings.lineHeight + ';';
    styles += 'margin-left:' + this.settings.marginLeft + ';';
    styles += 'margin-right:' + this.settings.marginRight + ';';
    styles += 'margin-top:' + this.settings.marginTop + ';';
    styles += 'margin-bottom:' + this.settings.marginBottom + ';';
    styles += '}';
    styles += '</style>';
    
    // Open print dialog
    var win = (window as any).open('','','left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0');
    win.document.write('<html><head><title>Spine Label</title>' + styles + '</head><body>' + formatted_content + '</body></html>');
    win.print();
    win.document.close();
    win.close();
  }
  
  toggleLocation() {
    this.spineLabel = this.constructSpineLabel();
  }

}
