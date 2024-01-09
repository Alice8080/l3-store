import { ProductData, Event } from 'types';
import { genUUID } from '../utils/helpers';

class EventAnalyticsService {
    async init() {
        const route = () => { // Переход по страницам
            window.addEventListener('load', () => {
                const url = document.location.href;
                const timestamp = new Date().getTime();
                const event: Event = {
                    type: 'route',
                    payload: JSON.stringify({
                        url,
                        timestamp
                    })
                }
                this._sendEvent(event);
            })
        }
        route();
    }

    viewCard = async (productElement: HTMLElement, product: ProductData) => { // Просмотр товара в списке товаров 
        const rect = productElement.getBoundingClientRect();
        
        // элемент виден, если он находится в пределах видимой области viewport
        const isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight) && (rect.left >= 0) && (rect.right <= window.innerWidth);
        if (isVisible) {
            const productId = product.id;
            const productResp = await fetch(`/api/getProductSecretKey?id=${productId}`);
            const secretKey = await productResp.json();
            const type = Object.keys(product.log).length ? 'viewCardPromo' : 'viewCard'; // Если в свойствах товара есть не пустое поле log, то тип должен быть viewCardPromo
            const event: Event = {
                type,
                payload: JSON.stringify({ ...product, secretKey }) // payload: всеСвойстваТовара + secretKey товара
            };
            this._sendEvent(event);
        }
    }

    addToCart(product: ProductData) { // Добавление товара в корзину
        const event: Event = {
            type: 'addToCart',
            payload: JSON.stringify(product) // payload: всеСвойстваТовара
        };
        this._sendEvent(event);
    }

    purchase(products: ProductData[], totalPrice: number) { // Оформление заказа
        const orderId: string = genUUID(); // айдиНовогоЗаказа
        const productIds = products.map(product => product.id); // айдиТоваровМассивом
        const payload = {
            orderId,
            totalPrice: Math.round(totalPrice / 1000),
            productIds: JSON.stringify(productIds)
        }
        const event: Event = {
            type: 'purchase',
            payload: JSON.stringify(payload)
        };
        this._sendEvent(event);
    }

    private async _sendEvent(event: Event) {
        fetch('/api/sendEvent', {
            method: 'POST',
            body: JSON.stringify(event)
        });
    }
}

export const eventAnalyticsService = new EventAnalyticsService();