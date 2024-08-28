'use client';
import { useState } from 'react';

export default function CreateFormButton({ userId }) {
  const [formUrl, setFormUrl] = useState(null);

  const handleCreateForm = async () => {
    try {
      const response = await fetch('/api/create-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create form');
      }

      const data = await response.json();
      setFormUrl(data.formUrl);
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateForm}>Create Feedback Form</button>
      {formUrl && (
        <p>
          Form created! <a href={formUrl} target="_blank" rel="noopener noreferrer">Open Form</a>
        </p>
      )}
    </div>
  );
}