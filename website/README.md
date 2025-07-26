# Port Manager Marketing Website

This is the marketing website for Port Manager, showcasing features, documentation, and tutorials.

## Features

- **Responsive Design**: Works on all devices
- **Full Documentation**: CLI and GUI guides
- **Interactive Code Examples**: With syntax highlighting
- **AI Integration Guide**: For automation and scripting
- **Copy-to-Clipboard**: Easy code copying
- **Smooth Animations**: Enhanced user experience

## Deployment

### GitHub Pages

1. Push to your repository
2. Go to Settings > Pages
3. Select source: Deploy from a branch
4. Choose branch: main, folder: /website
5. Save and wait for deployment

### Netlify

1. Drag and drop the `website` folder to Netlify
2. Or connect your GitHub repository
3. Set build settings: Base directory: `website`

### Vercel

```bash
cd website
vercel
```

### Local Development

```bash
cd website
python -m http.server 8000
# or
npx serve
```

## Structure

```
website/
├── index.html      # Main HTML file
├── styles.css      # All styles
├── script.js       # Interactive features
└── README.md       # This file
```

## Sections

1. **Hero**: Introduction and quick start
2. **Features**: Key capabilities
3. **Installation**: Multiple installation methods
4. **CLI Documentation**: All commands with examples
5. **GUI Documentation**: Desktop app features
6. **AI Integration**: Automation examples
7. **Tutorials**: Step-by-step guides
8. **Best Practices**: Usage recommendations

## Customization

- Colors: Edit CSS variables in `:root`
- Content: Update HTML sections
- Add screenshots: Replace placeholder divs with `<img>` tags

## Performance

- Lightweight: ~15KB total (excluding external fonts/libraries)
- No build process required
- CDN for syntax highlighting (Prism.js)
- Google Fonts for typography

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## License

Same as Port Manager (MIT)