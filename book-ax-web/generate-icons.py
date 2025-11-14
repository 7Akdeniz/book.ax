#!/usr/bin/env python3
"""
Generate all required icon formats for Book.ax Web App
- favicon.ico (16x16, 32x32, 48x48)
- apple-touch-icon.png (180x180)
- logo.png (512x512)
- og-image.jpg (1200x630)
"""

import os
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    import cairosvg
except ImportError:
    print("❌ Required packages not installed!")
    print("\n🔧 Run: pip3 install pillow cairosvg")
    print("   On macOS: brew install cairo pango gdk-pixbuf libffi")
    exit(1)

# Paths
PUBLIC_DIR = Path(__file__).parent / "public"
FAVICON_SVG = PUBLIC_DIR / "favicon.svg"
LOGO_SVG = PUBLIC_DIR / "logo.svg"

def svg_to_png(svg_path, png_path, width, height=None):
    """Convert SVG to PNG with specified dimensions"""
    if height is None:
        height = width
    
    print(f"  📐 {svg_path.name} → {png_path.name} ({width}x{height}px)")
    
    cairosvg.svg2png(
        url=str(svg_path),
        write_to=str(png_path),
        output_width=width,
        output_height=height
    )

def create_favicon_ico():
    """Create multi-resolution favicon.ico"""
    print("\n🎨 Creating favicon.ico...")
    
    # Generate PNG versions at different sizes
    sizes = [16, 32, 48, 64, 128, 256]
    temp_pngs = []
    
    for size in sizes:
        temp_png = PUBLIC_DIR / f"favicon-{size}.png"
        svg_to_png(FAVICON_SVG, temp_png, size)
        temp_pngs.append(Image.open(temp_png))
    
    # Save as multi-resolution ICO
    ico_path = PUBLIC_DIR / "favicon.ico"
    temp_pngs[0].save(
        ico_path,
        format='ICO',
        sizes=[(s, s) for s in sizes],
        append_images=temp_pngs[1:]
    )
    
    # Cleanup temp files
    for size in sizes:
        (PUBLIC_DIR / f"favicon-{size}.png").unlink()
    
    print(f"  ✅ favicon.ico created (multi-resolution)")

def create_apple_touch_icon():
    """Create Apple Touch Icon (180x180px)"""
    print("\n🍎 Creating apple-touch-icon.png...")
    
    png_path = PUBLIC_DIR / "apple-touch-icon.png"
    svg_to_png(FAVICON_SVG, png_path, 180)
    
    print(f"  ✅ apple-touch-icon.png created (180x180px)")

def create_logo_png():
    """Create logo.png for structured data (512x512px)"""
    print("\n📦 Creating logo.png...")
    
    png_path = PUBLIC_DIR / "logo.png"
    svg_to_png(LOGO_SVG, png_path, 512, 512)
    
    print(f"  ✅ logo.png created (512x512px)")

def create_og_image():
    """Create OpenGraph image for social sharing (1200x630px)"""
    print("\n🌐 Creating og-image.jpg...")
    
    # Create gradient background
    width, height = 1200, 630
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # Gradient from purple to violet
    for y in range(height):
        r = int(139 + (124 - 139) * (y / height))  # 139 → 124
        g = int(92 + (58 - 92) * (y / height))      # 92 → 58
        b = int(246 + (237 - 246) * (y / height))   # 246 → 237
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Load and paste logo (centered)
    try:
        # Convert logo SVG to PNG temporarily
        temp_logo = PUBLIC_DIR / "temp-logo-og.png"
        svg_to_png(LOGO_SVG, temp_logo, 600, 180)
        
        logo = Image.open(temp_logo)
        
        # Center logo
        logo_x = (width - logo.width) // 2
        logo_y = (height - logo.height) // 2
        
        # Paste with transparency
        if logo.mode == 'RGBA':
            img.paste(logo, (logo_x, logo_y), logo)
        else:
            img.paste(logo, (logo_x, logo_y))
        
        temp_logo.unlink()
    except Exception as e:
        print(f"  ⚠️  Could not add logo to OG image: {e}")
    
    # Add text
    try:
        # Try to use system fonts
        try:
            font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
            font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Tagline
        tagline = "Find Your Perfect Stay"
        bbox = draw.textbbox((0, 0), tagline, font=font_small)
        text_width = bbox[2] - bbox[0]
        text_x = (width - text_width) // 2
        
        # Add shadow
        draw.text((text_x + 2, 480 + 2), tagline, fill=(0, 0, 0, 100), font=font_small)
        draw.text((text_x, 480), tagline, fill='white', font=font_small)
        
    except Exception as e:
        print(f"  ⚠️  Could not add text: {e}")
    
    # Save as JPG with high quality
    og_path = PUBLIC_DIR / "og-image.jpg"
    img.save(og_path, 'JPEG', quality=95, optimize=True)
    
    print(f"  ✅ og-image.jpg created (1200x630px)")

def main():
    print("=" * 60)
    print("🎨 Book.ax Icon Generator")
    print("=" * 60)
    
    if not FAVICON_SVG.exists():
        print(f"❌ Error: {FAVICON_SVG} not found!")
        return
    
    if not LOGO_SVG.exists():
        print(f"❌ Error: {LOGO_SVG} not found!")
        return
    
    # Generate all icons
    create_favicon_ico()
    create_apple_touch_icon()
    create_logo_png()
    create_og_image()
    
    print("\n" + "=" * 60)
    print("✅ All icons generated successfully!")
    print("=" * 60)
    print("\n📂 Generated files:")
    print("   • favicon.ico       (multi-resolution)")
    print("   • apple-touch-icon.png (180x180px)")
    print("   • logo.png          (512x512px)")
    print("   • og-image.jpg      (1200x630px)")
    print()

if __name__ == "__main__":
    main()
