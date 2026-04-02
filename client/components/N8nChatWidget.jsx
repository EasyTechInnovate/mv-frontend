"use client";

import { useEffect } from "react";

export default function N8nChatWidget() {
  useEffect(() => {
    // Dynamically load the n8n CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(link);

    // Add custom CSS variables + overrides
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        /* Brand colors */
        --chat--color-primary: #9333ea; /* Purple accent */
        --chat--color-primary-shade-50: #7e22ce;
        --chat--color-primary-shade-100: #6b21a8;

        --chat--color-secondary: #20b69e; /* Teal user bubble */
        --chat--color-secondary-shade-50: #1ca08a;

        --chat--color-white: #ffffff;
        --chat--color-light: #111827; /* Dark background instead of white */
        --chat--color-light-shade-50: #1f2937;
        --chat--color-light-shade-100: #374151;
        --chat--color-medium: #9ca3af;
        --chat--color-dark: #0e0e0e; /* Match site bg */
        --chat--color-disabled: #6b7280;
        --chat--color-typing: #9ca3af;

        /* Layout */
        --chat--window--width: 350px;
        --chat--window--height: 500px;
        --chat--spacing: 1rem;
        --chat--border-radius: 1rem;
        --chat--transition-duration: 0.25s;

        /* Header */
        --chat--header-height: auto;
        --chat--header--padding: 1.25rem;
        --chat--header--background: linear-gradient(135deg, #711CE9, #4f46e5);
        --chat--header--color: #ffffff;
        --chat--heading--font-size: 1.15rem;
        --chat--subtitle--line-height: 1.6;
        --chat--subtitle--font-size: 0.85rem;
        --chat--subtitle--color: rgba(255, 255, 255, 0.85);

        /* Messages */
        --chat--message--font-size: 0.95rem;
        --chat--message--padding: 0.75rem 1.1rem;
        --chat--message--border-radius: 1.25rem;
        --chat--message-line-height: 1.6;
        --chat--message--bot--background: #1f2937;
        --chat--message--bot--color: #f9fafb;
        --chat--message--user--background: linear-gradient(135deg, #711CE9, #4f46e5);
        --chat--message--user--color: #ffffff;

        /* Toggle button */
        --chat--toggle--background: linear-gradient(135deg, #711CE9, #4f46e5);
        --chat--toggle--hover--background: #5a16ba;
        --chat--toggle--active--background: #4a129a;
        --chat--toggle--color: #ffffff;
        --chat--toggle--size: 60px;
      }

      /* High Specificity Selectors for n8n Chat Widget */
      .chat-window .chat-header {
        font-weight: 700 !important;
        letter-spacing: 0.3px !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
        padding-left: 4.5rem !important;
        position: relative !important;
        min-height: 70px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 2px !important;
        background: linear-gradient(135deg, #711CE9, #4f46e5) !important;
      }

      /* Avatar Injection */
      .chat-window .chat-header::before {
        content: "" !important;
        position: absolute !important;
        left: 1.25rem !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 2.5rem !important;
        height: 2.5rem !important;
        border-radius: 50% !important;
        background-image: url('/MahiAI.jpeg') !important;
        background-size: cover !important;
        background-position: center !important;
        border: 2px solid rgba(255, 255, 255, 0.4) !important;
        box-shadow: 0 0 15px rgba(113, 28, 233, 0.4) !important;
        z-index: 1000 !important;
        display: block !important;
      }

      .chat-window .chat-header h1 {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 1.25rem !important;
        color: #ffffff !important;
      }

      /* Online Status Dot in Subtitle */
      .chat-window .chat-header p {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        opacity: 1 !important;
        font-weight: 500 !important;
        margin: 0 !important;
        padding: 0 !important;
        color: rgba(255, 255, 255, 0.9) !important;
        font-size: 0.8rem !important;
        line-height: 1 !important;
      }

      .chat-window .chat-header p::before {
        content: "" !important;
        display: inline-block !important;
        width: 8px !important;
        height: 8px !important;
        background-color: #10b981 !important; /* emerald-500 */
        border-radius: 50% !important;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.9) !important;
        animation: status-pulse 2s infinite !important;
        flex-shrink: 0 !important;
      }

      @keyframes status-pulse {
        0% { transform: scale(0.9); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(0.9); opacity: 1; }
      }

      /* Message Bubbles Styling */
      .chat-message.chat-message-from-bot {
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
        border-bottom-left-radius: 4px !important;
        background-color: #1f2937 !important;
        color: #ffffff !important;
      }

      .chat-message.chat-message-from-user {
        box-shadow: 0 4px 12px rgba(113, 28, 233, 0.3) !important;
        border-bottom-right-radius: 4px !important;
        background: linear-gradient(135deg, #711CE9, #4f46e5) !important;
        color: #ffffff !important;
      }

      .chat-window-toggle {
        box-shadow: 0 8px 24px rgba(113, 28, 233, 0.5) !important;
        transition: all 0.3s ease !important;
      }

      .chat-window-toggle:hover {
        transform: scale(1.1) translateY(-2px) !important;
      }
 
      .chat__toggle {
        box-shadow: 0 8px 24px rgba(113, 28, 233, 0.5);
        transition: all 0.3s ease !important;
      }

      .chat__toggle:hover {
        transform: scale(1.05) translateY(-2px);
        box-shadow: 0 12px 30px rgba(113, 28, 233, 0.6);
      }

      .chat__textarea {
        border-radius: 9999px !important; /* pill shape */
        padding: 0.6rem 1rem !important;
        border: 1px solid #374151 !important;
        background: #1f2937 !important;
        color: #f9fafb !important;
      }

      .chat__textarea::placeholder {
        color: #9ca3af !important;
      }

      /* Custom scrollbar matching globals.css */
      .chat-window ::-webkit-scrollbar {
        width: 8px;
      }
      .chat-window ::-webkit-scrollbar-track {
        background: transparent;
      }
      .chat-window ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 6px;
      }
      .chat-window ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
      .chat-window * {
        scrollbar-width: thin;
        scrollbar-color: #888 transparent;
      }
    `;
    document.head.appendChild(style);

    // Dynamically load the n8n script
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://n8n.seyreon.com/webhook/8b88d4fa-45fe-48a7-9259-48d8bbe32e9b/chat',
        initialMessages: [
          'Hi there! 👋',
          'I’m your Mahi, your AI Assistant. How can I help you today?'
        ],
        i18n: {
          en: {
            title: 'Mahi AI',
            subtitle: 'Online • Responds instantly',
            inputPlaceholder: 'Type your question..',
          },
        }
      });
    `;
    document.body.appendChild(script);

    // cleanup (optional)
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
      document.body.removeChild(script);
    };
  }, []);

  return null;
}