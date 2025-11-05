<div align="center">
  <img width="1898" height="848" alt="og" src="https://github.com/user-attachments/assets/747923c0-0475-4892-9fe4-d2733b059727" />
</div>

A project inspired by [The Unsent Project](https://theunsentproject.com/) where people can anonymously post their experiences with [imposter syndrome](https://ctl.stanford.edu/students/imposter-syndrome). Based on the idea that imposter syndrome may never fully go away but can be mitigated through shared unity and understanding that everyone can experience it, even those who are least expected to.

This project is intended for University of Nevada Las Vegas's College of Liberal Arts 100LA final symposium.

For questions or concerns, please contact ``hi@heybob.by``

## Development Setup

```bash
pnpm install
pnpm dev
```

Ensure your environment variables are setup correctly before running.

## Tech Stack

- Next.js 16 w/ React 19
- Better-Auth w/ Drizzle ORM
- Upstash Redis
- TailwindCSS v4
- [Cap Captcha](https://capjs.js.org/)

## Features
* **Moderation Tools**: submission approval, deletion, batch operations, toggle submissions
* **Anonymization**: no accounts, hashed IPs, token-based deletion, no personal data collection, privacy-first captcha, rate limiting
* **User Experience**: infinite scroll, color-coded confessions, shareable links

## License

See [LICENSE](LICENSE.md)
