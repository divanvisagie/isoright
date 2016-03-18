import {NavController} from 'ionic-framework/ionic'
import {Injectable,EventEmitter} from 'angular2/core'
import {Http,Headers} from "angular2/http"

import {AuthenticationService} from './authentication.service'
import {SettingsService} from './settings.service'
import {UtilsService} from './utils.service'

import {LoginPage} from '../pages/login/login'


@Injectable()
export class HttpService {

  constructor(
    private _http: Http,
    private _settingsService: SettingsService,
    private _utilsService: UtilsService,
    private _authenticationService: AuthenticationService
    ) {
  }

  private handleError(statusCode: number){
    let actions = {
      401: () => {
        console.log("bad token")
        // this._nav.setRoot(LoginPage)
      }
    }
    actions[statusCode]()
  }

  public postJson(path: string, body: string) {
    return new Promise<any>(resolve => {
      this._authenticationService.getToken().then(token => {
        this._settingsService.getUrl().then(url => {
          let joined = this._utilsService.pathJoin([
            url, path
          ])
          this._http.post(joined, body)
            .subscribe(
              data => {
                resolve(data.json())
              }
            )
        })
      })
    })
  }

  public getJson(path: string) {
    return new Promise<any>(resolve => {
      this._authenticationService.getToken().then(token => {
        let headers = new Headers()
        headers.append("TOKEN",token)
        let options = {
          headers : headers
        };
        this._settingsService.getUrl().then(url => {
          let joined = this._utilsService.pathJoin([
            url, path
          ])
          this._http.get(joined,options)
            .subscribe(
              data => {
                resolve(data.json())
              },
              error => {
                this.handleError(error.status)
              }
            )
        })
      })
    })
  }
}
