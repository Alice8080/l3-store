import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchTips.tpl.html';

export class searchTips {
  view: View;
  tips: string[];

  constructor() {
    this.tips = [];
    this.view = new ViewTemplate(html).cloneView();
  }
}
