# Ferdinand Estoque Portfolio

This repository contains the source for Ferdinand Estoque's personal portfolio and business website.

## Features

- responsive single-page portfolio layout
- custom Ask Anything chatbot experience
- project and skills discovery prompts
- contact form support
- polished visual design with Bootstrap and custom CSS
- improved chat control layout and interaction flow

## Recent updates

- improved chatbot logic for more natural user interactions
- enhanced response handling, follow-up prompts, and helpful quick actions
- added copy-to-clipboard action for bot replies
- improved scroll-to-new-message behavior
- fixed chat action alignment issues and overlap between the Clear button and the chevron scroll button

## Project structure

- `index.html` — main page structure and chatbot widget
- `assets/css/style.css` — site styling and chatbot layout
- `assets/js/main.js` — interactive behavior and chatbot logic
- `forms/contact.php` — contact form processing script
- `api/` — data endpoints and JSON payloads used by the site

## Local usage

1. Open the project in a browser directly from the folder, or run a local static server.
2. For PHP form processing, serve the project through a PHP-enabled local environment.

Example:

```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in the browser.

## Notes

This website is designed to be easy to maintain, extend, and customize for future portfolio or business updates.
