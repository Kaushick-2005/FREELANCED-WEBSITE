import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const approved = searchParams.get('approved');
  const reviewType = searchParams.get('reviewType');
  const visible = searchParams.get('visible');

  try {
    const where: any = {};
    if (productId) where.productId = productId;
    if (approved === 'true') where.approved = true;
    if (reviewType) where.reviewType = reviewType;
    if (visible === 'true') where.visible = true;

    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true, nameTa: true } } },
    });

    // Clean up: strip quotes from comment/title
    const cleaned = reviews.map((r) => ({
      ...r,
      comment: r.comment.replace(/^["'`]|["'`]$/g, '').trim(),
      title: r.title ? r.title.replace(/^["'`]|["'`]$/g, '').trim() : '',
    }));

    // Calculate overall rating from ALL reviews (visible + hidden, product + customer)
    // This gives the true average rating regardless of visibility
    const allReviews = await db.review.findMany({
      where: { approved: true },
      select: { rating: true },
    });
    const overallRating = allReviews.length > 0
      ? Math.round((allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length) * 10) / 10
      : 0;
    const totalReviewCount = allReviews.length;

    return NextResponse.json({
      reviews: cleaned,
      overallRating,
      totalReviewCount,
    });
  } catch {
    return NextResponse.json({ reviews: [], overallRating: 0, totalReviewCount: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, ...data } = body;

    if (action === 'create') {
      const { productId, author, rating, title, comment, reviewType, source } = data;
      if (!productId || !author || !rating || !comment) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }

      const cleanComment = String(comment).replace(/^["'`]|["'`]$/g, '').trim();
      const cleanTitle = title ? String(title).replace(/^["'`]|["'`]$/g, '').trim() : '';

      const review = await db.review.create({
        data: {
          productId,
          author,
          rating: Number(rating),
          title: cleanTitle,
          comment: cleanComment,
          reviewType: reviewType || 'product',
          source: source || 'admin',
          approved: true,
          visible: true,
        },
      });

      // Update product rating & reviewCount from ALL approved reviews for that product
      const allProductReviews = await db.review.findMany({ where: { productId, approved: true } });
      const avg = allProductReviews.reduce((s, r) => s + r.rating, 0) / allProductReviews.length;
      await db.product.update({
        where: { id: productId },
        data: { rating: Math.round(avg * 10) / 10, reviewCount: allProductReviews.length },
      });

      return NextResponse.json({ success: true, review });
    }

    if (action === 'delete' && id) {
      await db.review.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (action === 'update' && id) {
      const updateData: any = {};
      if (data.author !== undefined) updateData.author = data.author;
      if (data.rating !== undefined) updateData.rating = Number(data.rating);
      if (data.title !== undefined) updateData.title = String(data.title).replace(/^["'`]|["'`]$/g, '').trim();
      if (data.comment !== undefined) updateData.comment = String(data.comment).replace(/^["'`]|["'`]$/g, '').trim();
      if (data.visible !== undefined) updateData.visible = data.visible;
      if (data.approved !== undefined) updateData.approved = data.approved;
      if (data.reviewType !== undefined) updateData.reviewType = data.reviewType;

      const review = await db.review.update({ where: { id }, data: updateData });
      return NextResponse.json({ success: true, review });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
