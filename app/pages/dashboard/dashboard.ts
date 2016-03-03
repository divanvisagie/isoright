import {Page, NavController, NavParams, Alert, MenuController} from 'ionic-framework/ionic'
import {StandardsService} from '../../services/standards.service'
import {Certification} from '../../models/certification'
import {OnInit} from 'angular2/core'
import {CertificationElementsPage} from '../certification-elements/certification-elements'



@Page({
  providers: [StandardsService],
  templateUrl: 'build/pages/dashboard/dashboard.html'
})
export class DashboardPage implements OnInit {
  public certifications: Certification[]
  constructor(
    private _nav: NavController,
    private _standardsService: StandardsService
    // private _menu: MenuController
  ) {

    // this._menu.enable(false,'main-menu')
    // this._menu.enable(true,'toc-menu')
  }

  itemSelected(item: Certification){
    console.log(`selected ${item.name}`)
    this._nav.push(CertificationElementsPage, {
      item: item
    })
  }

  getDasboardItems(){
    this._standardsService.getCertifications().then(items => {
      this.certifications = items
    })
  }

  //we use this for any onload that we need to do in order to keep the
  // constructor uncluttered
  ngOnInit() {
    this.getDasboardItems()
  }
}
