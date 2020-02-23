import { Component, OnInit } from '@angular/core';
import * as Scrap from '../../../assets/scrap-requirements.json';

enum TierKeys { bottom = 'b', top = 't' }

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss']
})

export class ScrapComponent implements OnInit {
  private scrap = Scrap['default'];
  public tiers = [0, 1, 2, 3, 4, 5, 6, 7];
  public tierKeys = TierKeys;
  public bottomTier = this.tiers[0];
  public topTier = this.tiers[-1];

  constructor() { }

  ngOnInit(): void {
    console.log(this.scrap);
  }

  setTier(key: TierKeys, value: number): void {
    switch (key) {
      case this.tierKeys.bottom:
        this.bottomTier = value;
        break;
      case this.tierKeys.top:
        this.topTier = value;
        break;
      default:
        console.log('Key Error');
    }
  }

}
