require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001';

async function runTests() {
    console.log('🚀 Starting System Tests...');
    const reportLines = [];
    reportLines.push(`# Yoga Wellness AI - Test Report`);
    reportLines.push(`**Date:** ${new Date().toLocaleString()}`);
    reportLines.push(`**Status:** 🟢 PASSED`);
    reportLines.push(`---`);

    let allPassed = true;

    // Helper to log and record
    const log = (msg, success = true) => {
        const symbol = success ? '✅' : '❌';
        console.log(`${symbol} ${msg}`);
        reportLines.push(`- ${symbol} **${msg}**`);
        if (!success) allPassed = false;
    };

    try {
        // 1. Health Check
        try {
            const health = await fetch(`${API_URL}/health`).then(r => r.json());
            if (health.status === 'ok') log('Server Health Check Passed');
            else log('Server Health Check Failed', false);
        } catch (e) {
            log(`Server Connection Failed: ${e.message}`, false);
        }

        // 2. AI Query Test
        const testQuestion = "What is the benefit of Downward Dog?";
        let interactionId = null;

        try {
            const start = Date.now();
            const res = await fetch(`${API_URL}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: testQuestion })
            });
            const data = await res.json();
            const duration = Date.now() - start;

            if (data.answer && data.sources.length > 0) {
                log(`AI Response Received in ${duration}ms`);
                log(`Context Retrieved: ${data.sources.length} sources found`);
                interactionId = data.interactionId;

                reportLines.push(`\n**Sample Query:** "${testQuestion}"`);
                reportLines.push(`> **AI Answer:** ${data.answer.substring(0, 100)}...`);
            } else {
                log('AI Response Invalid (Missing answer or sources)', false);
            }
        } catch (e) {
            log(`AI Query Failed: ${e.message}`, false);
        }

        // 3. Database Verification
        if (interactionId) {
            try {
                const record = await prisma.interaction.findUnique({
                    where: { id: interactionId }
                });

                if (record) {
                    const isAtlas = process.env.DATABASE_URL.includes('mongodb.net');
                    log(`Database Record Found: ID ${record.id}`);
                    log(`Storage Location: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
                } else {
                    log('Database Record Missing', false);
                }
            } catch (e) {
                log(`Database Verification Failed: ${e.message}`, false);
            }
        } else {
            log('Skipping DB Check (No Interaction ID)', false);
        }

    } catch (error) {
        console.error('Test Suite Error:', error);
        allPassed = false;
    } finally {
        await prisma.$disconnect();

        // Write Report
        if (!allPassed) reportLines[2] = `**Status:** 🔴 FAILED`; // Update status line

        const reportPath = path.join(__dirname, '..', 'TEST_REPORT.md');
        fs.writeFileSync(reportPath, reportLines.join('\n'));
        console.log(`\n📄 Report generated at: ${reportPath}`);
    }
}

runTests();
