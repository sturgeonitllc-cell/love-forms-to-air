const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { name, email, message } = JSON.parse(event.body);

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

  const data = {
    fields: { Name: name, Email: email, Message: message }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, id: result.id })
      };
    } else {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: result })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
