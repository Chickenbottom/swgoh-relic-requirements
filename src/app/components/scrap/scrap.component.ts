import { Component, OnInit } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as Requirements from '../../../assets/scrap-requirements.json';
import * as _ from 'lodash';

enum TierKeys { bottom = 'b', top = 't' }

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss']
})

export class ScrapComponent implements OnInit {
  public characterName = '';
  public multiplier = 1;
  public scrapTotals = {};
  public signalDataTotals = {};
  public tierKeys = TierKeys;
  public currentTier: number;
  public desiredTier: number;
  public scrapNames = [];
  public signalDataNames = [];
  public currentTierOptions = [];
  public totalCharacters: ScrapCharacter[] = [];
  public faTimesCircle = faTimesCircle;

  private allTiers = [0, 1, 2, 3, 4, 5, 6, 7];
  private requirements = Requirements['default'];
  private scrapTotalsRaw = {
    carboniteCircuitBoard: 0,
    bronziumWiring: 0,
    chromiumTransistor: 0,
    aurodiumHeatsink: 0,
    electriumConductor: 0,
    zinbiddleCard: 0
  };
  private signalDataTotalsRaw = {
    fragmentedSignalData: 0,
    incompleteSignalData: 0,
    flawedSignalData: 0
  };

  constructor() {
    this.currentTierOptions = _.dropRight(_.cloneDeep(this.allTiers));
    this.resetCharacter();
    this.resetTotals();
    this.scrapNames = _.keys(this.scrapTotalsRaw);
    this.signalDataNames = _.keys(this.signalDataTotalsRaw);
  }

  ngOnInit(): void {}

  resetTotals(): void {
    this.scrapTotals = _.cloneDeep(this.scrapTotalsRaw);
    this.signalDataTotals = _.cloneDeep(this.signalDataTotalsRaw);
  }

  resetAllCharacters(): void {
    this.totalCharacters = [];
    this.resetTotals();
    this.resetCharacter();
  }

  resetCharacter(): void {
    this.characterName = '';
    this.currentTier = this.allTiers[0];
    this.desiredTier = _.last(this.allTiers);
  }

  setTier(key: TierKeys, value: number): void {
    switch (key) {
      case this.tierKeys.bottom:
        this.currentTier = value;
        break;
      case this.tierKeys.top:
        this.desiredTier = value;
        break;
      default:
        console.log('Key Error');
    }
  }

  totalScrap(): void {
    if (!_.isEmpty(this.totalCharacters)) {
      _.forEach(this.totalCharacters, (character: ScrapCharacter) => {
        this.totalScrapForCharacter(character.currentTier, character.desiredTier, character.multiplier);
      });
    } else {
      this.totalScrapForCharacter(this.currentTier, this.desiredTier, this.multiplier);
    }

  }

  sumTypeTotals(tier: string): void {
    _.forEach(['scrap', 'signalData'], type => {
      const requirementTypeObj = _.get(this.requirements, [tier, type]);
      const currentType = _.isEqual(type, 'scrap') ? this.scrapTotals : this.signalDataTotals;
      _.forEach(_.keys(requirementTypeObj), scrapId => {
        const sum = _.get(requirementTypeObj, [scrapId], 0) + _.get(currentType, [scrapId], 0);
        _.set(currentType, [scrapId], sum);
      });
    });
  }

  totalScrapForCharacter(cTier: number, dTier: number, multiplier: number): void {
    _.forEach(_.range(multiplier), () => {
      _.forEach(_.range(cTier + 1, dTier + 1), tier => {
        this.sumTypeTotals(_.toString(tier));
      });
    });
    console.log(this.scrapTotals);
  }

  addToGrandTotals(): void {
    this.totalCharacters.push(this.createNewCharacter());
    this.resetCharacter();
    this.resetTotals();
    this.totalScrap();
  }

  createNewCharacter(): ScrapCharacter {
    const newChar = {} as ScrapCharacter;
    newChar.name = _.isEmpty(this.characterName) ? `char${this.totalCharacters.length + 1}` : _.cloneDeep(this.characterName);
    newChar.desiredTier = _.cloneDeep(this.desiredTier);
    newChar.currentTier = _.cloneDeep(this.currentTier);
    newChar.multiplier = _.cloneDeep(this.multiplier);

    return newChar;
  }

  printTotals(key: string): string {
    const currentList = _.includes(_.keys(this.scrapTotals), key) ? this.scrapTotals : this.signalDataTotals;

    return this.formatTotals(currentList, key);
  }

  formatTotals(totalsObject: object, key: string): string {
    const total = _.get(totalsObject, [key], 0);
    if (total > 0) {
      return `${_.startCase(key)}: ${total}`;
    } else {
      return undefined;
    }
  }

  getDesiredTierOptions(): number[] {
    return _.range(this.currentTier + 1, this.desiredTier + 1);
  }

  removeCharacter(character: ScrapCharacter): void {
    _.remove(this.totalCharacters, currentCharacter => _.isEqual(currentCharacter, character));
    this.resetTotals();
    this.totalScrap();
  }

  showRequirements(): boolean {
    return !_.isEmpty(this.totalCharacters);
  }

  validateMultiplier(): number {
    const curNum = _.toInteger(this.multiplier);

    return this.multiplier;
  }

  blurMultiplier(): number {
    this.multiplier = this.multiplier > 0 ? this.multiplier : 1;

    return this.multiplier;
  }

}

interface ScrapCharacter {
  name: string;
  currentTier: number;
  desiredTier: number;
  multiplier: number;
}
