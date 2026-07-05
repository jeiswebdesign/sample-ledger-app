import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function toDateOnly(d) {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  return new Date(d).toISOString().slice(0, 10);
}

function rowToEntry(row) {
  return {
    id: row.id,
    brand: row.brand || '',
    product: row.product || '',
    asin: row.asin || '',
    category: row.category || '',
    dateReceived: toDateOnly(row.date_received),
    value: Number(row.value) || 0,
    collab: row.collab || 'unknown',
    elsewhere: row.elsewhere || '',
    sponsor: row.sponsor || '',
    resold: row.resold || 'no',
    resaleDate: toDateOnly(row.resale_date),
    resaleAmount: Number(row.resale_amount) || 0,
    notes: row.notes || ''
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM sample_entries
        ORDER BY date_received DESC NULLS LAST, created_at DESC
      `;
      res.status(200).json(rows.map(rowToEntry));
      return;
    }

    if (req.method === 'POST') {
      const e = req.body || {};
      if (!e.id || !e.brand) {
        res.status(400).json({ error: 'Missing required fields (id, brand)' });
        return;
      }

      await sql`
        INSERT INTO sample_entries (
          id, brand, product, asin, category, date_received, value,
          collab, elsewhere, sponsor, resold, resale_date, resale_amount, notes
        ) VALUES (
          ${e.id}, ${e.brand}, ${e.product || ''}, ${e.asin || ''}, ${e.category || ''},
          ${e.dateReceived || null}, ${e.value || 0},
          ${e.collab || 'unknown'}, ${e.elsewhere || ''}, ${e.sponsor || ''},
          ${e.resold || 'no'}, ${e.resaleDate || null}, ${e.resaleAmount || 0}, ${e.notes || ''}
        )
        ON CONFLICT (id) DO UPDATE SET
          brand = EXCLUDED.brand,
          product = EXCLUDED.product,
          asin = EXCLUDED.asin,
          category = EXCLUDED.category,
          date_received = EXCLUDED.date_received,
          value = EXCLUDED.value,
          collab = EXCLUDED.collab,
          elsewhere = EXCLUDED.elsewhere,
          sponsor = EXCLUDED.sponsor,
          resold = EXCLUDED.resold,
          resale_date = EXCLUDED.resale_date,
          resale_amount = EXCLUDED.resale_amount,
          notes = EXCLUDED.notes
      `;
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ error: 'Missing id' });
        return;
      }
      await sql`DELETE FROM sample_entries WHERE id = ${id}`;
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}
