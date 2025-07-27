#!/usr/bin/env python3
"""
Generate Open Graph and Twitter Card images for Port Keeper
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create output directory if it doesn't exist
output_dir = "../../images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def create_gradient_background(width, height):
    """Create a gradient background"""
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Create gradient from purple (#667eea) to violet (#764ba2)
    for y in range(height):
        # Calculate color for this row
        ratio = y / height
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))
    
    return img

def add_text_and_logo(img, width, height, text_lines, logo_size=100):
    """Add text and logo to the image"""
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fallback to default if not available
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        emoji_font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", 100)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        emoji_font = ImageFont.load_default()
    
    # Draw rocket emoji as logo
    logo_y = height // 2 - 150
    try:
        draw.text((width // 2 - 50, logo_y), "🚀", font=emoji_font, fill="white", anchor="mm")
    except:
        # If emoji doesn't work, draw a simple rocket shape
        rocket_x = width // 2
        rocket_y = logo_y + 50
        # Triangle for rocket
        draw.polygon([
            (rocket_x - 30, rocket_y),
            (rocket_x, rocket_y - 60),
            (rocket_x + 30, rocket_y)
        ], fill="white")
        # Rectangle for body
        draw.rectangle([
            (rocket_x - 30, rocket_y),
            (rocket_x + 30, rocket_y + 40)
        ], fill="white")
    
    # Draw text
    y_offset = height // 2
    for i, (text, font) in enumerate(text_lines):
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (width - text_width) // 2
        y = y_offset + i * 80
        
        # Draw text shadow
        draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 128))
        # Draw text
        draw.text((x, y), text, font=font, fill="white")
    
    return img

# Generate Open Graph image (1200x630)
print("Generating Open Graph image...")
og_img = create_gradient_background(1200, 630)
og_text = [
    ("Port Keeper", None),  # Will use title_font
    ("The Ultimate Port Management Tool", None),  # Will use subtitle_font
    ("for Developers", None)  # Will use subtitle_font
]

# Manually add text since we can't pass font objects in the list
draw = ImageDraw.Draw(og_img)

# Add white overlay for better text visibility
overlay = Image.new('RGBA', (1200, 630), (255, 255, 255, 0))
overlay_draw = ImageDraw.Draw(overlay)
overlay_draw.rectangle([(0, 200), (1200, 430)], fill=(0, 0, 0, 100))
og_img = Image.alpha_composite(og_img.convert('RGBA'), overlay).convert('RGB')

# Add text
draw = ImageDraw.Draw(og_img)
try:
    title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()

# Draw rocket
draw.text((600, 150), "🚀", font=title_font, fill="white", anchor="mm")

# Draw title
draw.text((600, 280), "Port Keeper", font=title_font, fill="white", anchor="mm")

# Draw subtitle
draw.text((600, 360), "The Ultimate Port Management Tool", font=subtitle_font, fill="white", anchor="mm")
draw.text((600, 410), "for Developers", font=subtitle_font, fill="white", anchor="mm")

og_img.save(os.path.join(output_dir, "og-image.png"), "PNG", optimize=True)
print("✅ Open Graph image created: og-image.png")

# Generate Twitter Card image (1200x600)
print("Generating Twitter Card image...")
twitter_img = create_gradient_background(1200, 600)

# Add white overlay
overlay = Image.new('RGBA', (1200, 600), (255, 255, 255, 0))
overlay_draw = ImageDraw.Draw(overlay)
overlay_draw.rectangle([(0, 180), (1200, 420)], fill=(0, 0, 0, 100))
twitter_img = Image.alpha_composite(twitter_img.convert('RGBA'), overlay).convert('RGB')

# Add text
draw = ImageDraw.Draw(twitter_img)

# Draw rocket
draw.text((600, 140), "🚀", font=title_font, fill="white", anchor="mm")

# Draw title
draw.text((600, 270), "Port Keeper", font=title_font, fill="white", anchor="mm")

# Draw subtitle  
draw.text((600, 350), "Manage Development Ports Effortlessly", font=subtitle_font, fill="white", anchor="mm")
draw.text((600, 400), "CLI & GUI • Free • Open Source", font=subtitle_font, fill="white", anchor="mm")

twitter_img.save(os.path.join(output_dir, "twitter-card.png"), "PNG", optimize=True)
print("✅ Twitter Card image created: twitter-card.png")

# Generate a square logo (512x512)
print("Generating logo image...")
logo_img = create_gradient_background(512, 512)

# Add white circle background
draw = ImageDraw.Draw(logo_img)
draw.ellipse([(106, 106), (406, 406)], fill="white")

# Draw rocket in center
try:
    logo_font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", 200)
    draw.text((256, 256), "🚀", font=logo_font, fill=(102, 126, 234), anchor="mm")
except:
    # Fallback: draw a simple rocket
    draw.polygon([
        (256 - 60, 256),
        (256, 256 - 120),
        (256 + 60, 256)
    ], fill=(102, 126, 234))
    draw.rectangle([
        (256 - 60, 256),
        (256 + 60, 256 + 80)
    ], fill=(102, 126, 234))

logo_img.save(os.path.join(output_dir, "logo.png"), "PNG", optimize=True)
print("✅ Logo image created: logo.png")

print("\n✨ All images generated successfully!")