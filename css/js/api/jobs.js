import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Set CORS headers (optional, allows local testing)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Fetch all jobs, ordered by last_date descending (latest first)
            const { rows } = await sql`SELECT * FROM jobs ORDER BY last_date DESC`;
            return res.status(200).json(rows);
        }

        if (req.method === 'POST') {
            // Insert a new job
            const { title, last_date, link, category } = req.body;
            if (!title || !last_date || !link || !category) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const { rows } = await sql`
                INSERT INTO jobs (title, last_date, link, category) 
                VALUES (${title}, ${last_date}, ${link}, ${category}) 
                RETURNING *
            `;
            return res.status(201).json({ message: 'Job added successfully', job: rows[0] });
        }

        // Method not allowed
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
