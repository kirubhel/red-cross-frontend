import React from 'react';
import { renderToString } from 'react-dom/server';
import AdminMessagesPage from './src/app/[locale]/admin/messages/page';

try {
  const html = renderToString(<AdminMessagesPage />);
  console.log("Render successful");
} catch (error) {
  console.error("Render failed:", error);
}
