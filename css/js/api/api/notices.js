import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Fetch notices ordered by priority (higher first)
            const { rows } = await sql`SELECT * FROM notices ORDER BY priority DESC`;
            return res.status(200).json(rows);
        }

        if (req.method === 'POST') {
            const { text, link, priority } = req.body;
            if (!text || !link || priority === undefined) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const { rows } = await sql`
                INSERT INTO notices (text, link, priority) 
                VALUES (${text}, ${link}, ${priority}) 
                RETURNING *
            `;
            return res.status(201).json({ message: 'Notice added successfully', notice: rows[0] });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
