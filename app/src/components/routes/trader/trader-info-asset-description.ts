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
@Component({
  selector: 'traderInfoAssetDescription',
  inputs: ['currencyInfo','assetInfo'],
  styles: [`
  trader-info-asset-description {
    padding-bottom: 0px !important;
    padding-right: 0px !important;
  }
  trader-info-asset-description .description {
    overflow: auto;
    margin-bottom: 0px !important;
    margin-top: 0px !important;
  }
  trader-info-asset-description > div > div:first-child {
    margin-right: 16px !important;
  }
  trader-info-asset-description .seperator {
    padding-bottom: 8px;
  }
  `],
  template: `
    <div layout="row" flex layout-fill>
      <div layout="column">
        <pre class="description" flex>Issued by:
{{vm.issuedBy}}
{{vm.launched}}
Id:
{{vm.assetId}}
# of assets:
{{vm.numberOfAssets}}</pre>
      </div>
      <div layout="column" flex>
        <pre class="description" flex>Description:
{{vm.description}}</pre>
      </div>
    </div>
  `
})
@Inject('$scope','settings','assetInfo','$q','heat')
class TraderInfoAssetDescriptionComponent {

  // inputs
  currencyInfo: AssetInfo; // @input
  assetInfo: AssetInfo; // @input

  isBtcAsset=false;
  issuedBy: string;
  numberOfAssets: string;
  launched: string;
  description: string;
  assetId: string;

  constructor(private $scope: angular.IScope,
              private settings: SettingsService,
              private assetInfoService: AssetInfoService,
              private $q: angular.IQService,
              private heat: HeatService) {
    var ready = () => {
      if (this.currencyInfo && this.assetInfo) {
        this.isBtcAsset = this.currencyInfo.id==this.settings.get(SettingsService.HEATLEDGER_BTC_ASSET);
        this.description = "Loading description from issuer site ...";

        this.loadDescription(this.isBtcAsset ? this.currencyInfo : this.assetInfo);

        this.assetId = this.isBtcAsset ? this.currencyInfo.id : this.assetInfo.id
        this.loadInfo(this.assetId);
        unregister.forEach(fn => fn());
      }
    };
    var unregister = [$scope.$watch('vm.currencyInfo', ready),$scope.$watch('vm.assetInfo', ready)];
  }

  loadDescription(info: AssetInfo) {
    this.assetInfoService.getAssetDescription(info).then((description)=>{
      this.$scope.$evalAsync(()=> {
        this.description = description;
      })
    })
  }

  loadInfo(id: string) {
    if (id=="0") {
      this.$scope.$evalAsync(()=> {
        this.issuedBy = "heatledger.com"
        this.numberOfAssets = "25,000,000";
      });
    }
    else {
      this.heat.api.getAsset(id).then((asset)=> {
        this.$scope.$evalAsync(()=> {
          this.issuedBy = asset.account;
          this.numberOfAssets = utils.formatQNT(asset.quantityQNT, asset.decimals);
          var format = this.settings.get(SettingsService.DATEFORMAT_DEFAULT);
          var date = utils.timestampToDate(parseInt("10000" /*asset.timestamp*/));
          this.launched = dateFormat(date, format);
        });
      })
    }
  }
}