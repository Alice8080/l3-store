import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchTips.tpl.html';
import tips from './search-tips.json';
import { addElement } from '../../utils/helpers';

export class SearchTips {
  view: View;
  allTips: string[];
  tips: string[];

  constructor() {
    this.allTips = [...tips]; // Отдельно сохраняем массив всех подсказок из JSON (может приходить с сервера)
    this.tips = [...tips]; // Для актуальных подсказок берутся первые 3 элемента массива подсказок 
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
    this.render();
  }

  render() {
    this.view.tips.innerHTML = '';
    this.view.tipsText.innerText = this.tips.length ? 'Например,' : 'Нет подходящих подсказок';  // Если по запросу пользователя нет товаров в подсказках, выводим оповещение об этом
    this.tips = this.tips.splice(0, 3);

    this.tips.forEach((tip, index) => {
      const $tip = addElement(this.view.tips, 'div', { className: 'tip' });
      const $text = addElement($tip, 'p', { innerText: tip });
      $tip.addEventListener('click', () => { // При нажатии на подсказку она подставляется в поисковый инпут
        const input = document.getElementById('search-input');
        (<HTMLInputElement>input).value = $text.innerText;
      });

      if (index < this.tips.length - 2) { // Если это не последний/предпоследний элемент, добавляем запятую
        addElement(this.view.tips, 'span', { innerHTML: ',&nbsp;' });
      } else if (index === this.tips.length - 2) { // Между последним и предпоследним элементом ставим "или"
        addElement(this.view.tips, 'span', { innerHTML: '&nbsp;или&nbsp;' });
      }
    });

    // Если поле ввода пустое, отображаются первые 3 подсказки из всего массива подсказок
    // При вводе запроса в поисковую строку остаются только соответствующие запросу подсказки
    this.view.searchInput.oninput = (e: Event) => { 
      const target = e.target as HTMLInputElement;
      const request = target.value;
      const currentTips = this.allTips.filter((tip) => tip.toLowerCase().includes(request));
      this.tips = currentTips;
      this.render();
    }
  }
}
