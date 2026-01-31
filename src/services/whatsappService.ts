import { CartItem } from '../types';
import { SHOP_SETTINGS } from '../constants';

/**
 * Servicio para generar mensajes de WhatsApp
 */
export class WhatsAppService {
  private static formatCartItems(items: CartItem[]): string {
    return items
      .map((item) => {
        let itemText = `• *${item.name}* x${item.quantity}`;

        // Agregar extras si tiene
        if (item.selectedExtras && item.selectedExtras.length > 0) {
          const extrasText = item.selectedExtras.map(e => `${e.name} (+$${e.price})`).join(', ');
          itemText += `\n  Extras: ${extrasText}`;
        }

        // Agregar hamburguesas de combo si tiene
        if (item.comboBurgers && item.comboBurgers.length > 0) {
          item.comboBurgers.forEach((combo, idx) => {
            itemText += `\n  🍔 ${idx + 1}. ${combo.burger.name}`;
            if (combo.extras.length > 0) {
              itemText += ` + ${combo.extras.map(e => e.name).join(', ')}`;
            }
            if (combo.notes) {
              itemText += `\n    Obs: ${combo.notes}`;
            }
          });
        }

        // Agregar observaciones si tiene
        if (item.notes) {
          itemText += `\n  📝 Obs: ${item.notes}`;
        }

        const itemTotal = this.calculateItemTotal(item);
        itemText += `\n  Subtotal: $${itemTotal.toLocaleString()}`;

        return itemText;
      })
      .join('\n\n');
  }

  private static calculateItemTotal(item: CartItem): number {
    let total = item.price;

    if (item.selectedExtras) {
      total += item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    }

    if (item.comboBurgers) {
      item.comboBurgers.forEach(combo => {
        total += combo.extras.reduce((sum, extra) => sum + extra.price, 0);
      });
    }

    return total * item.quantity;
  }

  static generateOrderMessage(
    cart: CartItem[],
    total: number,
    deliveryMethod: string,
    address?: string,
    paymentMethod?: string,
    customerName?: string,
    betweenStreets?: string,
    observations?: string
  ): string {
    const itemsText = this.formatCartItems(cart);

    let message = `🍔 *NUEVO PEDIDO - ${SHOP_SETTINGS.name}*\n\n`;

    if (customerName) {
      message += `👤 *Cliente:* ${customerName}\n\n`;
    }

    // Método de entrega (Siempre Delivery por ahora, pero mantenemos la lógica)
    const deliveryText = deliveryMethod === 'delivery' ? 'Delivery' : 'Retiro en Local';

    if (deliveryMethod === 'delivery' && address) {
      message += `📍 *Dirección:* ${address}\n`;
      if (betweenStreets) {
        message += `🛣️ *Entre calles:* ${betweenStreets}\n`;
      }
      message += `\n`; // Espacio extra después de la dirección
    }

    message += `📦 *Pedido:*\n${itemsText}\n\n`;
    message += `💰 *TOTAL: $${total.toLocaleString()}*\n\n`;

    message += `🚚 *Entrega:* ${deliveryText}\n`;

    // Método de pago
    if (paymentMethod) {
      const paymentText = paymentMethod === 'efectivo' ? 'Efectivo' :
        paymentMethod === 'transferencia' ? 'Transferencia' : 'Otro';
      message += `💳 *Pago:* ${paymentText}\n`;
    }

    // Observaciones adicionales
    if (observations) {
      message += `\n📝 *Observaciones:*\n${observations}`;
    }

    return encodeURIComponent(message);
  }

  static sendOrder(message: string): void {
    const whatsappUrl = `https://wa.me/${SHOP_SETTINGS.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  static calculateTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => {
      return total + this.calculateItemTotal(item);
    }, 0);
  }
}
