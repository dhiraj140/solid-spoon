// script.js – Fetches data from API and renders it dynamically

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    loadNotices();
    loadJobs();
    loadResults();
});

// Fetch and display notices in the scrolling bar
async function loadNotices() {
    try {
        const response = await fetch('/api/notices');
        const notices = await response.json();
        const container = document.getElementById('notice-container');
        // Sort by priority (higher first) – though backend already does it, we keep as fallback
        notices.sort((a, b) => b.priority - a.priority);
        container.innerHTML = notices.map(notice => 
            `<a href="${notice.link}" target="_blank">${notice.text}</a>`
        ).join(' ');
    } catch (error) {
        console.error('Error loading notices:', error);
        document.getElementById('notice-container').innerHTML = '<a href="#">⚠️ Unable to load notices</a>';
    }
}

// Fetch jobs and display Latest Jobs and Admit Card sections
async function loadJobs() {
    try {
        const response = await fetch('/api/jobs');
        const jobs = await response.json();
        
        // Filter jobs by category
        const latestJobs = jobs.filter(job => job.category === 'job');
        const admitCards = jobs.filter(job => job.category === 'admitcard');

        // Render Latest Jobs
        const jobsList = document.getElementById('jobs-list');
        jobsList.innerHTML = latestJobs.map(job => `
            <li>
                <a href="${job.link}" target="_blank">${job.title}</a>
                <small>Last Date: ${new Date(job.last_date).toLocaleDateString()}</small>
            </li>
        `).join('') || '<li>No jobs available</li>';

        // Render Admit Cards
        const admitList = document.getElementById('admit-list');
        admitList.innerHTML = admitCards.map(admit => `
            <li>
                <a href="${admit.link}" target="_blank">${admit.title}</a>
                <small>Last Date: ${new Date(admit.last_date).toLocaleDateString()}</small>
            </li>
        `).join('') || '<li>No admit cards available</li>';

    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobs-list').innerHTML = '<li>Error loading jobs</li>';
        document.getElementById('admit-list').innerHTML = '<li>Error loading admit cards</li>';
    }
}

// Fetch and display Results
async function loadResults() {
    try {
        const response = await fetch('/api/results');
        const results = await response.json();
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = results.map(result => `
            <li>
                <a href="${result.link}" target="_blank">${result.title}</a>
                <small>Date: ${new Date(result.date).toLocaleDateString()}</small>
            </li>
        `).join('') || '<li>No results available</li>';
    } catch (error) {
        console.error('Error loading results:', error);
        document.getElementById('results-list').innerHTML = '<li>Error loading results</li>';
    }
}
