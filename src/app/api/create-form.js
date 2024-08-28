import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/forms.body'],
    });

    const forms = google.forms({ version: 'v1', auth });

    // Create a new form
    const form = await forms.forms.create({
      requestBody: {
        info: {
          title: `Feedback Form for User ${userId}`,
        },
      },
    });

    const formId = form.data.formId;

    // Add a text question
    await forms.forms.batchUpdate({
      formId: formId,
      requestBody: {
        requests: [{
          createItem: {
            item: {
              title: 'Please provide your feedback:',
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              },
            },
            location: {
              index: 0
            }
          }
        }]
      },
    });

    res.status(200).json({ 
      message: 'Form created successfully',
      formId: formId,
      formUrl: `https://docs.google.com/forms/d/${formId}/edit`
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Error creating form', error: error.message });
  }
}