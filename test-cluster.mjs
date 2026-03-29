// Use native fetch (Node 18+)
async function createTestCluster() {
  const ticket = {
    subject: "API Timeout Error",
    description: "The /api/v1/auth endpoint is consistently timing out for all our users in the EMEA region. Urgent fix needed.",
    customerName: "Test User 1",
    customerEmail: "test1@example.com",
    company: "Test Corp",
    category: "Technical"
  };

  console.log('🚀 Creating first ticket for cluster...');
  const res1 = await fetch('http://localhost:3001/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket)
  });
  const data1 = await res1.json();
  console.log(`✅ Ticket 1 created with ID: ${data1.ticket.id}`);

  console.log('🚀 Creating second ticket for cluster...');
  const res2 = await fetch('http://localhost:3001/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...ticket, customerName: "Test User 2", customerEmail: "test2@example.com" })
  });
  const data2 = await res2.json();
  console.log(`✅ Ticket 2 created with ID: ${data2.ticket.id}`);

  console.log('\n✨ AI-Driven Master Incident should now appear on your Dashboard (Threshold: 2 tickets).');
  console.log('👉 Please refresh your browser.');
}

createTestCluster().catch(err => console.error('❌ Error:', err));
