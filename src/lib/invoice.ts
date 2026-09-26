import { jsPDF } from 'jspdf';

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  weight?: number;
};

type InvoiceData = {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  status?: string;
  type?: 'Order' | 'Custom Quote';
  material?: string;
  budget?: number;
  description?: string;
};

// Status color mapping for PDF
function getStatusColor(status: string): [number, number, number] {
  if (status === 'Cancelled' || status === 'Rejected') return [220, 50, 50]; // red
  if (status === 'Pending') return [180, 120, 0]; // amber
  if (status === 'Confirmed' || status === 'Contacted' || status === 'Completed' || status === 'Quoted') return [0, 150, 80]; // green
  return [80, 80, 80]; // gray
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();
  const type = data.type || 'Order';
  const status = data.status || 'Pending';

  // Header band
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 40, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RAMEEZ JEWELLERZ', W / 2, 18, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Radiant Beauty, Enduring Value | Since 1991', W / 2, 27, { align: 'center' });
  doc.text('Valliyur, Tirunelveli · +91 90000 00000', W / 2, 33, { align: 'center' });

  // Title
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(type === 'Custom Quote' ? 'CUSTOM QUOTE' : 'INVOICE', 14, 55);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.line(14, 58, W - 14, 58);

  // Order/Quote info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const idLabel = type === 'Custom Quote' ? 'Quote ID' : 'Order ID';
  doc.text(`${idLabel}: ${data.orderId}`, 14, 67);
  doc.text(`Date: ${new Date().toLocaleString('en-IN')}`, 14, 73);
  if (type === 'Custom Quote' && data.material) {
    doc.text(`Material: ${data.material}`, 14, 79);
  } else if (data.paymentMethod) {
    doc.text(`Payment: ${data.paymentMethod}`, 14, 79);
  }

  // STATUS box (colored)
  const [r, g, b] = getStatusColor(status);
  doc.setFillColor(r, g, b);
  doc.roundedRect(W - 60, 62, 46, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(status.toUpperCase(), W - 37, 69, { align: 'center' });

  // Customer info
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Bill To:', W - 90, 85);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(data.customerName, W - 90, 91);
  doc.text(data.phone, W - 90, 97);
  if (data.email) doc.text(data.email, W - 90, 103);
  if (data.address) doc.text(data.address, W - 90, 109);
  if (data.city) doc.text(`${data.city} - ${data.pincode || ''}`, W - 90, 115);

  if (type === 'Custom Quote') {
    // Custom quote layout
    let y = 90;
    if (data.description) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text('Design Description:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(data.description, W - 28);
      doc.text(lines, 14, y + 6);
      y += 6 + lines.length * 5 + 5;
    }
    if (data.budget) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text('Budget:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(212, 175, 55);
      doc.text(`Rs. ${data.budget.toLocaleString('en-IN')}`, 40, y);
      y += 8;
    }

    // Status description
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.setFontSize(10);
    const statusMsg = getStatusMessage(status, 'quote');
    doc.text(statusMsg, 14, y);
  } else {
    // Order invoice with items table
    let y = 128;
    doc.setFillColor(245, 240, 220);
    doc.rect(14, y - 6, W - 28, 10, 'F');
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Item', 16, y);
    doc.text('Qty', W - 70, y);
    doc.text('Price', W - 50, y);
    doc.text('Total', W - 30, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    data.items.forEach((item) => {
      if (y > 250) { doc.addPage(); y = 20; }
      const itemName = item.name.length > 40 ? item.name.slice(0, 37) + '...' : item.name;
      doc.text(itemName, 16, y);
      doc.text(String(item.quantity), W - 70, y);
      doc.text(`${item.price.toLocaleString('en-IN')}`, W - 50, y);
      doc.text(`${(item.price * item.quantity).toLocaleString('en-IN')}`, W - 30, y);
      y += 8;
    });

    // Totals
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, W - 14, y);
    y += 8;
    doc.text('Subtotal:', W - 50, y);
    doc.text(`Rs. ${data.subtotal.toLocaleString('en-IN')}`, W - 30, y);
    y += 7;
    if (data.discount && data.discount > 0) {
      doc.setTextColor(0, 150, 80);
      doc.text('Discount:', W - 50, y);
      doc.text(`- Rs. ${data.discount.toLocaleString('en-IN')}`, W - 30, y);
      y += 7;
      doc.setTextColor(60, 60, 60);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('TOTAL:', W - 50, y);
    doc.setTextColor(212, 175, 55);
    doc.text(`Rs. ${data.total.toLocaleString('en-IN')}`, W - 30, y);

    // Status description
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.setFontSize(10);
    const statusMsg = getStatusMessage(status, 'order');
    doc.text(statusMsg, 14, y);
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for choosing Rameez Jewellerz!', W / 2, 280, { align: 'center' });
  doc.text('BIS 916 Hallmark · Trusted Since 1991 · All Rights Reserved', W / 2, 285, { align: 'center' });

  const filename = type === 'Custom Quote' ? `Quote-${data.orderId}.pdf` : `Invoice-${data.orderId}.pdf`;
  doc.save(filename);
}

function getStatusMessage(status: string, type: 'order' | 'quote'): string {
  if (type === 'quote') {
    switch (status) {
      case 'Pending': return 'Status: Pending - Our team will review your request and contact you soon.';
      case 'Contacted': return 'Status: Contacted - Our team has contacted you regarding this quote.';
      case 'Quoted': return 'Status: Quoted - A price quote has been provided. Please visit our store.';
      case 'Completed': return 'Status: Completed - Your custom jewellery has been crafted successfully!';
      case 'Rejected': return 'Status: Rejected - Unfortunately, this request could not be fulfilled.';
      default: return `Status: ${status}`;
    }
  } else {
    switch (status) {
      case 'Pending': return 'Status: Pending - Your order is awaiting confirmation. Our team will call you.';
      case 'Confirmed': return 'Status: Confirmed - Your order has been confirmed. Visit our store for payment.';
      case 'Contacted': return 'Status: Contacted - Our team has contacted you about this order.';
      case 'Completed': return 'Status: Completed - Your order has been completed. Thank you!';
      case 'Cancelled': return 'Status: Cancelled - This order has been cancelled.';
      default: return `Status: ${status}`;
    }
  }
}
