///<reference path='../../VirtualRepeatComponent.ts'/>
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
  selector: 'traderTradeHistory',
  inputs: ['currencyInfo','assetInfo','oneClickOrders'],
  styles: [`
    trader-trade-history label {
      cursor: pointer;
    }
    trader-trade-history .type-col {
      width: 45px;
    }
    trader-trade-history .time-col {
      width: 60px;
    }
    trader-trade-history .price-col {
      width: 100px;
    }
    trader-trade-history .quantity-col {
      width: 100px;
    }
    trader-trade-history .total-col {
      width: 100px;
      text-align: right;
    }
  `],
  template: `
    <div layout="column" flex layout-fill>
      <div layout="row" class="trader-component-title">Past trades&nbsp;
        <span flex></span>
        <span layout="row" ng-if="vm.user.unlocked">
          <label>
            <input type="radio" name="trader-show-trades" value="all" ng-model="vm.showTheseTrades" ng-change="vm.updateView()">
            <i>Show all trades</i>
          </label>
          <label>
            <input type="radio" name="trader-show-trades" value="my" ng-model="vm.showTheseTrades" ng-change="vm.updateView()">
            <i>Show my trades</i>
          </label>
        </span>
        <elipses-loading ng-show="vm.loading"></elipses-loading>
      </div>
      <md-list flex layout-fill layout="column" ng-if="vm.currencyInfo&&vm.assetInfo">
        <md-list-item>
          <div class="truncate-col type-col">Type</div>
          <div class="truncate-col time-col" flex>Time</div>
          <div class="truncate-col price-col">Price</div>
          <div class="truncate-col quantity-col">{{vm.assetInfo.symbol}}</div>
          <div class="truncate-col total-col" flex>Total ({{vm.currencyInfo.symbol}})</div>
        </md-list-item>
        <md-virtual-repeat-container md-top-index="vm.topIndex" flex layout-fill layout="column" virtual-repeat-flex-helper>
          <md-list-item md-virtual-repeat="item in vm" md-on-demand aria-label="Entry">
            <div class="truncate-col type-col">{{item.type}}</div>
            <div class="truncate-col time-col" flex>{{item.time}}</div>
            <div class="truncate-col price-col">{{item.priceDisplay}}</div>
            <div class="truncate-col quantity-col">{{item.quantityDisplay}}</div>
            <div class="truncate-col total-col" flex>{{item.total}}</div>
          </md-list-item>
        </md-virtual-repeat-container>
      </md-list>
    </div>
  `
})
@Inject('$scope','tradesProviderFactory','$q','user','settings','HTTPNotify')
class TraderTradeHistoryComponent extends VirtualRepeatComponent  {

  /* @inputs */
  currencyInfo: AssetInfo; // @input
  assetInfo: AssetInfo; // @input
  oneClickOrders: boolean; // @input

  showTheseTrades: string = "all";

  constructor(protected $scope: angular.IScope,
              private tradesProviderFactory: TradesProviderFactory,
              $q: angular.IQService,
              private user: UserService,
              private settings: SettingsService,
              HTTPNotify: HTTPNotifyService)
  {
    super($scope, $q);
    HTTPNotify.on(()=>{this.determineLength()}, $scope);
    var ready = () => {
      if (this.currencyInfo && this.assetInfo) {
        this.createProvider();
        unregister.forEach(fn => fn());
      }
    };
    var unregister = [$scope.$watch('vm.currencyInfo', ready),$scope.$watch('vm.assetInfo', ready)];

    $scope.$on("$destroy",() => {
      if (this.provider) {
        this.provider.destroy();
      }
    });
  }

  createProvider() {
    var format = this.settings.get(SettingsService.DATEFORMAT_DEFAULT);
    var account = this.showTheseTrades == 'all' ? null : this.user.account;
    this.initializeVirtualRepeat(
      this.tradesProviderFactory.createProvider(this.currencyInfo.id, this.assetInfo.id, account),

      /* decorator function */
      (trade: IHeatTrade|any) => {
        var date = utils.timestampToDate(trade.timestamp);
        trade.time = dateFormat(date, format);
        trade.type = trade.isBuy ? 'Buy' : 'Ask';
        trade.priceDisplay = utils.formatQNT(trade.price, this.currencyInfo.decimals);
        trade.quantityDisplay = utils.formatQNT(trade.quantity, this.assetInfo.decimals);
        var totalQNT = utils.calculateTotalOrderPriceQNT(trade.quantity, trade.price);
        trade.total = utils.formatQNT(totalQNT,this.currencyInfo.decimals)
      }
    );
  }

  onSelect(item) {}

  updateView() {
    if (this.currencyInfo && this.assetInfo) {
      console.log("update view");
      this.createProvider();
    }
  }
}