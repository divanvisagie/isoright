import {App,Page, NavController, NavParams} from 'ionic-framework/ionic'
import {MenuController} from 'ionic-framework/ionic'
import {OnInit} from 'angular2/core'

import {CertificationElement, Certification} from '../../models/certification'
import {DocumentType} from '../../models/document-type'
import {Document} from '../../models/document'

import {DashboardPage} from '../dashboard/dashboard'
import {DocumentViewerPage} from '../document-viewer/document-viewer'

import {StandardsService} from '../../services/standards.service'

@Page({
  providers: [StandardsService],
  templateUrl: 'build/pages/documents/documents.html'
})

export class DocumentsPage implements OnInit {

  public documents: Document[]

  public documentType: DocumentType
  public certification: Certification
  public certificationElement: CertificationElement
  constructor(
    private _nav: NavController,
    private _params: NavParams,
    private _menu: MenuController,
    private _standardsService: StandardsService
  ) {
    this.certification = this._params.get('certification')
    this.certificationElement = this._params.get('certificationElement')
    this.documentType = this._params.get('documentType')
  }

  getDocumentList() {
    this._standardsService.getDocuments(this.certification,
      this.certificationElement,this.documentType).then(documents => {
        this.documents = documents
      })
  }

  itemSelected(item: Document) {
    this._nav.push(DocumentViewerPage, {
      certificationElement: this.certificationElement,
      certification: this.certification,
      documentType: this.documentType,
      document: item
    })
  }

  openHome() {
    this._nav.setRoot(DashboardPage)
  }

  ngOnInit() {

    this.getDocumentList()
  }
}