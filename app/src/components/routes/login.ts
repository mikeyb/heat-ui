/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Heat Ledger Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
@RouteConfig('/login')
@Component({
  selector: 'login',
  styles: [`
    login .smalller-font {
      font-size: 10px;
    }
    login a {
      color: #9E9E9E !important;
    }
    login .compressed-input-container md-input-container {
      margin-top: 5px;
      margin-bottom: 5px;
    }
    login .clickable-icon {
      cursor: pointer;
      font-size: 18px;
    }
    login .wallet {
      width: 260px;
      padding-top: 24px;
      padding-bottom: 24px;
    }
    login .outer-container {
      width: 100%;
      max-width: 380px;
    }
    login .account-preview {
      color: #BDBDBD;
    }
  `],
  template: `
    <div layout="column" flex layout-align="start center">
      <div layout="column" layout-padding class="outer-container">
        <div layout="column" layout-align="start center" layout-padding>
          <img src="assets/heatwallet.png" class="wallet">
        </div>
        <div layout="column" flex>
          <md-input-container flex>
            <label>Secret phrase</label>
            <textarea rows="2" flex ng-model="vm.secretPhrase" id="create-new-textarea" ng-trim="false" ng-change="vm.secretPhraseChanged()"></textarea>
            <md-icon md-font-library="material-icons" ng-click="vm.copy('create-new-textarea', 'Secret phrase copied')" class="clickable-icon">content_copy</md-icon>
          </md-input-container>
        </div>
        <div layout="row" layout-align="center center">
          <md-button class="md-primary md-raised" ng-click="vm.loginSecretPhrase()" ng-disabled="!vm.secretPhrase" aria-label="Sign in">Sign in</md-button>
        </div>
        <div layout="column" layout-align="center center">
          <span class="account-preview">{{vm.calculatedAccountId}}</span>
          <span ng-show="vm.secretPhraseHasHiddenChars" class="account-preview">
            Secret phrase has hidden characters!&nbsp;<a href="#" ng-click="vm.removeSecretPhraseHiddenChars()">remove</a>
          </span>
        </div>
        <div layout="row" layout-align="center center" ng-if="vm.env.type==EnvType.NODEJS">
          <md-input-container>
            <label>Switch API server</label>
            <md-select ng-model="vm.apiServer" ng-change="vm.apiServerChanged()">
              <md-option ng-value="server" ng-repeat="server in vm.availableAPIServers">{{server}}</md-option>
            </md-select>
          </md-input-container>
        </div>
      </div>
    </div>
    <div layout="row">
      <news-button layout="column"></news-button>
    </div>

  <!--
    <div layout="column" layout-padding class="outer-container">
      <div layout="column" flex ng-if="vm.page == 0">
        <div layout="column" layout-align="start center" layout-padding>
          <img src="assets/heatwallet.png" class="wallet">
        </div>
        <div layout="column" ng-show="vm.isNewInstall">
          <md-button class="md-raised md-primary" ng-click="vm.gotoPage(1)" flex aria-label="Create">Create New Account</md-button>
          <md-button class="md-raised" ng-click="vm.gotoPage(2)" flex aria-label="Add">Add Existing Account</md-button>
        </div>
        <div layout="column" flex ng-hide="vm.isNewInstall">
          <md-input-container>
            <label>Account</label>
            <md-select ng-model="vm.account" ng-change="vm.pincode=null;vm.secretPhrase=null;vm.publicKey=null;">
              <md-option ng-repeat="key in vm.localKeys" value="{{key}}">{{key}}</md-option>
            </md-select>
          </md-input-container>
          <md-input-container flex ng-show="vm.account">
            <label>Pin Code</label>
            <input ng-model="vm.pincode" required name="pincode" ng-change="vm.pincodeChanged()" maxlength="5">
          </md-input-container>
          <div layout="row">
            <md-button class="md-primary md-raised" ng-click="vm.login()" ng-disabled="!vm.secretPhrase" flex aria-label="Sign in">Sign in</md-button>
          </div>
          <div layout="row" layout-align="center" class="smalller-font">
            <md-button ng-click="vm.gotoPage(1)" flex aria-label="Create">create account</md-button>
            <md-button ng-click="vm.gotoPage(2)" flex aria-label="Add">add account</md-button>
          </div>
        </div>
      </div>
      <div layout="column" flex ng-if="vm.page == 1" ng-init="vm.generateNewSecretPhrase()" class="compressed-input-container">
        <center>
          <p class="md-title">Create New Account</p>
        </center>
        <div layout="column" flex>
          <md-input-container flex>
            <label>Secret phrase</label>
            <textarea rows="2" flex ng-model="vm.secretPhrase" readonly id="create-new-textarea" ng-trim="false"></textarea>
            <md-icon md-font-library="material-icons" ng-click="vm.copy('create-new-textarea', 'Secret phrase copied')" class="clickable-icon">content_copy</md-icon>
          </md-input-container>
          <md-input-container flex>
            <label>Account</label>
            <input ng-model="vm.account" readonly name="account" id="create-new-input">
            <md-icon md-font-library="material-icons" ng-click="vm.copy('create-new-input', 'Account id copied')" class="clickable-icon">content_copy</md-icon>
          </md-input-container>
          <md-input-container flex>
            <label>Pin Code (required 5 numbers)</label>
            <input ng-model="vm.pincode" required name="pincode" maxlength="5">
          </md-input-container>
          <div layout="row">
            <md-button ng-click="vm.back($event)" flex aria-label="Back">Back</md-button>
            <md-button class="md-primary" ng-click="vm.addAccount($event)"
              ng-disabled="!vm.secretPhrase || !vm.isValidPincode(vm.pincode)" flex aria-label="Add">Add</md-button>
          </div>
        </div>
      </div>
      <div layout="column" flex ng-if="vm.page == 2" ng-init="vm.resetAll()" class="compressed-input-container">
        <center>
          <p class="md-title">Add Existing Account</p>
        </center>
        <div layout="column" flex>
          <md-input-container flex>
            <label>Secret phrase</label>
            <textarea rows="2" flex ng-model="vm.secretPhrase" id="add-existing-textarea" ng-change="vm.secretPhraseChanged()" ng-trim="false"></textarea>
            <md-icon md-font-library="material-icons" ng-click="vm.copy('add-existing-textarea', 'Secret phrase copied')" class="clickable-icon">content_copy</md-icon>
          </md-input-container>
          <md-input-container flex>
            <label>Account</label>
            <input ng-model="vm.account" readonly name="account" id="add-existing-input">
            <md-icon md-font-library="material-icons" ng-click="vm.copy('add-existing-input', 'Account id copied')" class="clickable-icon">content_copy</md-icon>
          </md-input-container>
          <md-input-container flex>
            <label>Pin Code (required 5 numbers)</label>
            <input ng-model="vm.pincode" required name="pincode" maxlength="5">
          </md-input-container>
          <div layout="row">
            <md-button ng-click="vm.back($event)" flex aria-label="Back">Back</md-button>
            <md-button class="md-primary" ng-click="vm.addAccount($event)"
              ng-disabled="!vm.secretPhrase || !vm.isValidPincode(vm.pincode)" flex aria-label="Add">Add</md-button>
          </div>
        </div>
      </div>
    </div>
  -->

  `
})
@Inject('$scope','$q','user','$location','heat','localKeyStore',
        'secretGenerator','clipboard','$mdToast','env','settings')
class LoginComponent {

  page: number = 0;
  isNewInstall: boolean;
  pincode: string;
  secretPhrase: string;
  publicKey: string;
  account: string;
  localKeys: Array<string> = [];
  key: ILocalKey = null;
  loading: boolean = false;
  calculatedAccountId: string = 'Enter secret phrase to see account id';
  hasWhitespace = /^\s+|\s+$/gm;
  secretPhraseHasHiddenChars = false;

  apiServer: string;
  availableAPIServers = [];

  constructor(private $scope: angular.IScope,
              private $q: angular.IQService,
              private user: UserService,
              private $location: angular.ILocationService,
              private heat: HeatService,
              private localKeyStore: LocalKeyStoreService,
              private secretGenerator: SecretGeneratorService,
              private clipboard: ClipboardService,
              private $mdToast: angular.material.IToastService,
              private env: EnvService,
              private settings: SettingsService) {
    this.localKeys = localKeyStore.list();
    this.isNewInstall = this.localKeys.length == 0;
    if (!this.isNewInstall) {
      this.account = this.localKeys[0];
    }

    this.apiServer = this.settings[SettingsService.HEAT_HOST]+":"+this.settings[SettingsService.HEAT_PORT];
    this.availableAPIServers.push(
      this.settings.get(SettingsService.HEAT_HOST_REMOTE)+":"+this.settings.get(SettingsService.HEAT_PORT_REMOTE),
      this.settings.get(SettingsService.HEAT_HOST_LOCAL)+":"+this.settings.get(SettingsService.HEAT_PORT_LOCAL)
    );
  }

  apiServerChanged() {
    var parts = this.apiServer.split(":");
    this.settings.put(SettingsService.HEAT_PORT,parts.splice(-1,1)[0]);
    this.settings.put(SettingsService.HEAT_HOST, parts.join(''));
  }

  setLoading(loading: boolean) {
    this.$scope.$evalAsync(() => {
      this.loading = loading;
    });
  }

  resetAll() {
    this.pincode = null;
    this.secretPhrase = null;
    this.publicKey = null;
    this.account = null;
  }

  gotoPage(pageNum: number) {
    this.page = pageNum;
    this.resetAll();
  }

  back($event) {
    this.page = 0;
    this.resetAll();
  }

  generateNewSecretPhrase() {
    this.secretGenerator.generate('en').then((secretPhrase) => {
      this.$scope.$evalAsync(() => {
        this.secretPhrase = secretPhrase;
        this.publicKey = heat.crypto.secretPhraseToPublicKey(secretPhrase);
        this.account = heat.crypto.getAccountIdFromPublicKey(this.publicKey);
      });
    });
  }

  isValidPincode(pincode) {
    return /^\d{5}$/.test(pincode);
  }

  pincodeChanged() {
    this.key = this.localKeyStore.load(this.account, this.pincode);
    this.secretPhrase = null;
    if (this.key != null) {
      this.secretPhrase = this.key.secretPhrase;
    }
  }

  copy(element: string, successMsg: string) {
    this.clipboard.copyWithUI(document.getElementById(element), successMsg);
  }

  addAccount($event) {
    this.localKeyStore.add({
      account: this.account,
      secretPhrase: this.secretPhrase,
      pincode: this.pincode
    });
    this.login();
  }

  secretPhraseChanged() {
    this.publicKey = heat.crypto.secretPhraseToPublicKey(this.secretPhrase);
    this.account = heat.crypto.getAccountIdFromPublicKey(this.publicKey);
    this.secretPhraseHasHiddenChars = this.hasWhitespace.test(this.secretPhrase);
    this.$scope.$evalAsync(() => {
      this.calculatedAccountId = this.account;
    });
  }

  removeSecretPhraseHiddenChars() {
    this.$scope.$evalAsync(() => {
      this.secretPhrase = this.secretPhrase.replace(/^\s+/, "").replace(/\s+$/, "");
      this.secretPhraseChanged();
    });
  }

  loginSecretPhrase() {
    this.user.unlock(this.secretPhrase, false).then(() => {
      this.$location.path('home');
    });
  }

  login() {
    this.setLoading(true);
    this.isExistingAccount().then((exists) => {
      this.setLoading(false);
      if (exists) {
        this.user.unlock(this.secretPhrase, false).then(() => {
          this.$location.path('home');
        });
      }
      else {
        this.user.unlock(this.secretPhrase, true).then(() => {
          this.$location.path('new');
        });
      }
    }).catch((error) => {
      this.setLoading(false);
      this.$mdToast.show(
        this.$mdToast.simple()
            .textContent("Error: " + error.description)
            .hideDelay(6000)
      );
    });
  }

  isExistingAccount(): angular.IPromise<boolean> {
    var deferred = this.$q.defer();
    /*
    this.heat.api.getAccountBalance(this.account, "0").then(() => {
      deferred.resolve(true);
    }).catch((error: ServerEngineError) => {
      if (error.code == 5 && error.description == "Unknown account") {
        deferred.resolve(false);
      }
      else {
        deferred.reject(error);
      }
    });
    */
    return deferred.promise;
  }
}